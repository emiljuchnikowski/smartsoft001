#!/usr/bin/env node
/**
 * Regenerates `docs/site/src/lib/navigation.ts` from the frontmatter of every
 * `docs/site/src/app/**\/page.md`. Pass `--check` to verify the file on disk is
 * up to date without writing it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  collectPages,
  buildNavigation,
  renderNavigationTs,
} from './navigation.mjs'

const toolsDir = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.dirname(toolsDir)
const repoRoot = path.resolve(siteDir, '..', '..')
const appDir = path.join(siteDir, 'src', 'app')
const outFile = path.join(siteDir, 'src', 'lib', 'navigation.ts')

function run(argv) {
  const pages = collectPages(appDir)
  const sections = buildNavigation(pages)
  const source = renderNavigationTs(sections)
  const target = path.relative(repoRoot, outFile).split(path.sep).join('/')

  if (argv.includes('--check')) {
    const current = fs.existsSync(outFile)
      ? fs.readFileSync(outFile, 'utf8')
      : ''

    if (current !== source) {
      throw new Error(
        `[navigation] ${target} is out of date, run \`node docs/site/tools/generate-navigation.mjs\``,
      )
    }
  } else {
    fs.mkdirSync(path.dirname(outFile), { recursive: true })
    fs.writeFileSync(outFile, source)
  }

  console.log(
    `navigation: ${sections.length} sections, ${pages.length} pages → ${target}`,
  )
}

try {
  run(process.argv.slice(2))
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
