#!/usr/bin/env node
/**
 * Regenerates one `docs/site/src/app/docs/components/<name>/page.md` per
 * documented `smart-*` component, plus the section index. The material comes
 * from the component skill, its Storybook story and, where it exists, a
 * hand written page under `docs/site/content/components`.
 *
 * Usage: node docs/site/tools/generate-components.mjs [--check] [--root <dir>]
 *
 * `--check` verifies what is on disk without writing it, which is what CI
 * runs. `--root` points the generator at another workspace and is used by the
 * tests. Warnings never fail the run: a component whose story has no `usage`
 * region still gets a page, only without the usage block.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import prettier from 'prettier'

import { collectComponents } from './components.mjs'

const toolsDir = path.dirname(fileURLToPath(import.meta.url))
const defaultRoot = path.resolve(toolsDir, '..', '..', '..')

function parseArgs(argv) {
  const rootIndex = argv.indexOf('--root')

  return {
    check: argv.includes('--check'),
    repoRoot:
      rootIndex === -1 ? defaultRoot : path.resolve(argv[rootIndex + 1]),
  }
}

/**
 * Formats a page the way `nx format` would, so a generated page never shows
 * up as a diff after the repository is formatted.
 */
async function format(source, file) {
  const config = (await prettier.resolveConfig(file)) ?? {}

  return prettier.format(source, { ...config, parser: 'markdown' })
}

function relative(repoRoot, file) {
  return path.relative(repoRoot, file).split(path.sep).join('/')
}

/** The component directories that are on disk but no longer documented. */
function staleDirectories(componentsDir, names) {
  if (!fs.existsSync(componentsDir)) return []

  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !names.has(entry.name))
    .map((entry) => path.join(componentsDir, entry.name))
}

function write(file, source) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, source)
}

function reportLine(entry) {
  return entry.missing
    ? `${entry.component}: no stories file with a "${entry.missing.replace('-region', '')}" region`
    : `dropped fence: ${entry.component} — ${entry.section} (${entry.language || 'text'})`
}

async function run(argv) {
  const { check, repoRoot } = parseArgs(argv)
  const componentsDir = path.join(
    repoRoot,
    'docs',
    'site',
    'src',
    'app',
    'docs',
    'components',
  )
  const { pages, index, report, warnings } = collectComponents(repoRoot)
  const files = [
    ...pages.map((page) => ({
      file: path.join(componentsDir, page.name, 'page.md'),
      content: page.content,
    })),
    { file: path.join(componentsDir, 'page.md'), content: index },
  ]
  const names = new Set(pages.map((page) => page.name))
  const stale = staleDirectories(componentsDir, names)

  for (const { file, content } of files) {
    const source = await format(content, file)

    if (!check) {
      write(file, source)
      continue
    }

    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''

    if (current !== source) {
      throw new Error(
        `[components] ${relative(repoRoot, file)} is out of date, run \`node docs/site/tools/generate-components.mjs\``,
      )
    }
  }

  if (stale.length) {
    if (check) {
      throw new Error(
        `[components] ${relative(repoRoot, stale[0])} documents a component that no longer exists, run \`node docs/site/tools/generate-components.mjs\``,
      )
    }

    for (const dir of stale) fs.rmSync(dir, { recursive: true, force: true })
  }

  console.log(
    `components: ${pages.length} pages → ${relative(repoRoot, componentsDir)}`,
  )

  for (const entry of report) console.log(reportLine(entry))
  for (const warning of warnings) console.log(`warning: ${warning}`)
}

try {
  await run(process.argv.slice(2))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
