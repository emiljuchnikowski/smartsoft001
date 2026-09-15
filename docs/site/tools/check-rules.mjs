/**
 * The rules `tools/scripts/docs-check.mjs` runs over the documentation site:
 *
 * - R1: every publishable package has a page under `docs/packages`.
 * - R2: every UI component has a page under `docs/components`.
 * - R3: every user-invocable skill has a page, per its source.
 * - R4: every `{% snippet %}` tag points at an existing file and region.
 * - R5: every `{% storybook %}` tag points at a story that exists.
 * - R6: reference pages embed snippets, never inline code.
 * - R7: every page declares a title and a known section.
 * - R8: every package page names its package and follows the skeleton.
 * - R9: every UI component has a story with a `usage` region.
 *
 * R1-R3 and R9 are the parity rules: they compare the workspace with the
 * site and only warn until `--strict` names them.
 */

import { load as parseYaml } from 'js-yaml'

import fs from 'node:fs'
import path from 'node:path'

import { SECTION_ORDER } from './sections.mjs'

const SCOPE = '@smartsoft001/'
const PLUGIN_SKILLS_DIR =
  'packages/shared/claude-plugins/src/plugins/smart/skills'
const REPO_SKILLS_DIR = '.claude/skills'
const COMPONENTS_DIR = 'packages/shared/angular/src/lib/components'
const COMPONENT_SKILL_PREFIX = 'angular-components-'
const EXCLUDED_PACKAGES = new Set(['claude-plugins'])
const CODE_LANGUAGES = new Set([
  'ts',
  'typescript',
  'tsx',
  'html',
  'angular-html',
])

/**
 * Pages below these directories (relative to the docs app) must embed their
 * code through `{% snippet %}` tags instead of hand-writing it. The root
 * `page.md` is deliberately not covered: it is a landing page, not reference
 * documentation.
 */
export const NO_HANDWRITTEN_CODE_DIRS = [
  'docs/architecture',
  'docs/components',
  'docs/crud',
  'docs/installation',
  'docs/introduction',
  'docs/packages',
]

const STORY_PROJECTS = [
  { dir: 'packages/shared/angular', project: 'angular' },
  { dir: 'packages/crud/shell/angular', project: 'crud-shell-angular' },
]

/**
 * Lists every file below `dir` (recursively), skipping `node_modules`.
 * Returns paths relative to `dir`, using POSIX separators.
 */
export function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return []

  const result = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue

    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      result.push(...walk(full, base))
    } else if (entry.isFile()) {
      result.push(path.relative(base, full).split(path.sep).join('/'))
    }
  }

  return result
}

function listDirectories(dir) {
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

/**
 * Reads the YAML frontmatter block of a markdown file. Returns `null` when the
 * block is present but cannot be parsed, so callers can tell "no frontmatter"
 * from "broken frontmatter".
 */
function readFrontmatter(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)

  if (lines[0].trim() !== '---') return {}

  const end = lines.indexOf('---', 1)

  if (end === -1) return {}

  let parsed

  try {
    parsed = parseYaml(lines.slice(1, end).join('\n'))
  } catch {
    return null
  }

  return parsed && typeof parsed === 'object' ? parsed : {}
}

/**
 * Every publishable `@smartsoft001/*` package, without the scope prefix.
 */
export function packageInventory(repoRoot) {
  const packagesDir = path.join(repoRoot, 'packages')
  const names = []

  for (const file of walk(packagesDir)) {
    if (path.basename(file) !== 'package.json') continue

    let pkg

    try {
      pkg = JSON.parse(fs.readFileSync(path.join(packagesDir, file), 'utf8'))
    } catch {
      continue
    }

    if (typeof pkg.name !== 'string' || !pkg.name.startsWith(SCOPE)) continue

    const name = pkg.name.slice(SCOPE.length)

    if (EXCLUDED_PACKAGES.has(name)) continue

    names.push(name)
  }

  return [...new Set(names)].sort()
}

/**
 * True when the directory holds a `*.component.ts` that declares a real
 * Angular component. Helper directories such as `base` only hold `@Directive`
 * classes and are not documented on their own page.
 */
function hasComponent(dir) {
  return walk(dir)
    .filter((file) => file.endsWith('.component.ts'))
    .some((file) =>
      fs.readFileSync(path.join(dir, file), 'utf8').includes('@Component('),
    )
}

/**
 * Documented UI components: the plugin component skills plus every exported
 * component directory of the shared Angular library.
 */
export function componentInventory(repoRoot) {
  const names = new Set()

  for (const dir of listDirectories(path.join(repoRoot, PLUGIN_SKILLS_DIR))) {
    if (dir.startsWith(COMPONENT_SKILL_PREFIX)) {
      names.add(dir.slice(COMPONENT_SKILL_PREFIX.length))
    }
  }

  const componentsDir = path.join(repoRoot, COMPONENTS_DIR)
  const indexFile = path.join(componentsDir, 'index.ts')

  if (fs.existsSync(indexFile)) {
    const source = fs.readFileSync(indexFile, 'utf8')

    for (const match of source.matchAll(/export \* from '\.\/([^']+)'/g)) {
      const dir = match[1]

      if (hasComponent(path.join(componentsDir, dir))) {
        names.add(dir)
      }
    }
  }

  return [...names].sort()
}

/**
 * Every user-invocable skill, from the plugin and from `.claude/skills`.
 */
export function skillInventory(repoRoot) {
  const sources = [
    { dir: PLUGIN_SKILLS_DIR, source: 'plugin' },
    { dir: REPO_SKILLS_DIR, source: 'repo' },
  ]
  const skills = []

  for (const { dir, source } of sources) {
    const root = path.join(repoRoot, dir)

    for (const name of listDirectories(root)) {
      const file = path.join(root, name, 'SKILL.md')

      if (!fs.existsSync(file)) continue
      if (readFrontmatter(file)?.['user-invocable'] !== true) continue

      skills.push({ name, source })
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Lodash-compatible `startCase`, which is how Storybook derives a story name
 * from its export name (`AllVariants` -> `All Variants`).
 */
export function startCase(value) {
  const words = value.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+|\b)|[A-Z]?[a-z]+|[A-Z]+|\d+/g,
  )

  if (!words) return value

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Storybook's id sanitizer: lowercase, non-alphanumeric runs become `-`.
 */
export function sanitize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripStrings(line) {
  return line.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, "''")
}

export function metaTitle(source) {
  const lines = source.split(/\r?\n/)
  const start = lines.findIndex((line) =>
    /^\s*(const meta\b|export default \{)/.test(line),
  )

  if (start === -1) return null

  let depth = 0

  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index]

    if (depth === 1) {
      const match = line.match(/^\s*title:\s*(['"`])(.*?)\1/)

      if (match) return match[2]
    }

    const stripped = stripStrings(line)

    depth += (stripped.match(/\{/g) ?? []).length
    depth -= (stripped.match(/\}/g) ?? []).length

    if (index > start && depth <= 0) return null
  }

  return null
}

function storyProject(file) {
  const match = STORY_PROJECTS.find(({ dir }) => file.startsWith(`${dir}/`))

  return match ? match.project : null
}

/**
 * Every story exported by a `*.stories.ts` file, with its Storybook id.
 */
export function storyInventory(repoRoot) {
  const packagesDir = path.join(repoRoot, 'packages')
  const stories = []

  for (const relative of walk(packagesDir)) {
    if (!relative.endsWith('.stories.ts')) continue

    const file = `packages/${relative}`
    const project = storyProject(file)

    if (!project) continue

    const source = fs.readFileSync(path.join(packagesDir, relative), 'utf8')
    const title = metaTitle(source)

    if (!title) continue

    for (const match of source.matchAll(/^export const (\w+)/gm)) {
      const name = match[1]

      if (name === 'meta' || name === 'default') continue

      stories.push({
        project,
        id: `${sanitize(title)}--${sanitize(startCase(name))}`,
        file,
      })
    }
  }

  return stories.sort((a, b) => a.id.localeCompare(b.id))
}

function docsPage(ctx, ...segments) {
  return path.join(ctx.docsAppDir, 'docs', ...segments, 'page.md')
}

/**
 * True when `rule` is one of the parity rules the caller asked to be strict
 * about. `ctx.strict` is a collection of rule ids (`['R1']`, `new Set(['R1'])`)
 * so a section can be enforced before the others are written; `true` means
 * every parity rule and `false` means none.
 */
function isStrict(ctx, rule) {
  const { strict } = ctx

  if (typeof strict === 'boolean' || strict == null) return Boolean(strict)

  return strict instanceof Set ? strict.has(rule) : [...strict].includes(rule)
}

function missingPageFinding(ctx, rule, kind, name, page) {
  return {
    rule,
    level: isStrict(ctx, rule) ? 'error' : 'warn',
    message: `${kind} "${name}" has no documentation page (expected ${path
      .relative(ctx.docsAppDir, page)
      .split(path.sep)
      .join('/')})`,
    file: page,
  }
}

/** R1: every publishable package has a page under `docs/packages`. */
export function rule1(ctx) {
  return packageInventory(ctx.repoRoot)
    .map((name) => ({ name, page: docsPage(ctx, 'packages', name) }))
    .filter(({ page }) => !fs.existsSync(page))
    .map(({ name, page }) =>
      missingPageFinding(ctx, 'R1', 'Package', name, page),
    )
}

/** R2: every UI component has a page under `docs/components`. */
export function rule2(ctx) {
  return componentInventory(ctx.repoRoot)
    .map((name) => ({ name, page: docsPage(ctx, 'components', name) }))
    .filter(({ page }) => !fs.existsSync(page))
    .map(({ name, page }) =>
      missingPageFinding(ctx, 'R2', 'Component', name, page),
    )
}

/** R3: every user-invocable skill has a page, per its source. */
export function rule3(ctx) {
  return skillInventory(ctx.repoRoot)
    .map(({ name, source }) => ({
      name,
      page: docsPage(
        ctx,
        source === 'plugin' ? 'skills' : 'contributing',
        name,
      ),
    }))
    .filter(({ page }) => !fs.existsSync(page))
    .map(({ name, page }) => missingPageFinding(ctx, 'R3', 'Skill', name, page))
}

/** Every `page.md` below the docs app, as absolute paths. */
function docsPages(ctx) {
  return walk(ctx.docsAppDir)
    .filter((file) => path.basename(file) === 'page.md')
    .sort()
    .map((file) => path.join(ctx.docsAppDir, file))
}

function relativeToDocs(ctx, page) {
  return path.relative(ctx.docsAppDir, page).split(path.sep).join('/')
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length
}

function tags(source, name) {
  const pattern = new RegExp(`\\{%\\s*${name}\\s+([^%]*?)\\/%\\}`, 'g')

  return [...source.matchAll(pattern)].map((match) => {
    const attributes = {}

    for (const attribute of match[1].matchAll(/(\w+)="([^"]*)"/g)) {
      attributes[attribute[1]] = attribute[2]
    }

    return { attributes, line: lineOf(source, match.index) }
  })
}

function hasRegion(source, region) {
  return source
    .split(/\r?\n/)
    .some(
      (line) =>
        line.trim() === `// #region ${region}` ||
        line.trim() === `# #region ${region}` ||
        line.trim() === `<!-- #region ${region} -->`,
    )
}

function resolveSnippet(ctx, file) {
  const root = file.startsWith('packages/') ? ctx.repoRoot : ctx.examplesRoot
  const resolved = path.resolve(root, file)

  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null

  return resolved
}

/** R4: every `{% snippet %}` tag points at an existing file and region. */
export function rule4(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const source = fs.readFileSync(page, 'utf8')

    for (const { attributes, line } of tags(source, 'snippet')) {
      const where = `${relativeToDocs(ctx, page)}:${line}`
      const file = attributes.file ?? ''
      const resolved = resolveSnippet(ctx, file)

      if (!resolved) {
        findings.push({
          rule: 'R4',
          level: 'error',
          message: `${where}: snippet file "${file}" points outside its root`,
          file: page,
        })
        continue
      }

      if (!fs.existsSync(resolved)) {
        findings.push({
          rule: 'R4',
          level: 'error',
          message: `${where}: snippet file "${file}" does not exist`,
          file: page,
        })
        continue
      }

      const region = attributes.region

      if (region && !hasRegion(fs.readFileSync(resolved, 'utf8'), region)) {
        findings.push({
          rule: 'R4',
          level: 'error',
          message: `${where}: snippet file "${file}" has no region "${region}"`,
          file: page,
        })
      }
    }
  }

  return findings
}

/** R5: every `{% storybook %}` tag points at a story that exists. */
export function rule5(ctx) {
  const stories = storyInventory(ctx.repoRoot)
  const findings = []

  for (const page of docsPages(ctx)) {
    const source = fs.readFileSync(page, 'utf8')

    for (const { attributes, line } of tags(source, 'storybook')) {
      const { project = '', story = '' } = attributes
      const known = stories.some(
        (item) => item.project === project && item.id === story,
      )

      if (known) continue

      findings.push({
        rule: 'R5',
        level: 'error',
        message: `${relativeToDocs(ctx, page)}:${line}: unknown story "${story}" for project "${project}"`,
        file: page,
      })
    }
  }

  return findings
}

/** R6: reference pages embed snippets, never inline code. */
export function rule6(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)
    const covered = NO_HANDWRITTEN_CODE_DIRS.some((dir) =>
      relative.startsWith(`${dir}/`),
    )

    if (!covered) continue

    const lines = fs.readFileSync(page, 'utf8').split(/\r?\n/)
    let fence = null

    lines.forEach((line, index) => {
      const match = line.match(/^\s*(`{3,}|~{3,})\s*([\w-]*)/)

      if (!match) return

      if (fence) {
        if (match[1].startsWith(fence) && !match[2]) fence = null
        return
      }

      fence = match[1]

      if (!CODE_LANGUAGES.has(match[2].toLowerCase())) return

      findings.push({
        rule: 'R6',
        level: 'error',
        message: `${relative}:${index + 1}: inline "${match[2]}" code block, use a {% snippet %} tag instead`,
        file: page,
      })
    })
  }

  return findings
}

/** R7: every page declares a title and a known section. */
export function rule7(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)
    const frontmatter = readFrontmatter(page)
    const report = (message) =>
      findings.push({ rule: 'R7', level: 'error', message, file: page })

    if (!frontmatter) {
      report(`${relative}: invalid frontmatter, it is not valid YAML`)
      continue
    }

    if (!frontmatter.title) report(`${relative}: missing frontmatter "title"`)

    if (!frontmatter.section) {
      report(`${relative}: missing frontmatter "section"`)
    } else if (!SECTION_ORDER.includes(frontmatter.section)) {
      report(`${relative}: unknown section "${frontmatter.section}"`)
    }
  }

  return findings
}

/**
 * The sections every package page carries, in the order they must appear in
 * the template.
 */
const PACKAGE_HEADINGS = ['## Install', '## Usage', '## API']

/** The body of the `## <name>` section, up to the next `## ` heading. */
function section(source, heading) {
  const lines = source.split(/\r?\n/)
  const start = lines.findIndex((line) => line.trim() === heading)

  if (start === -1) return null

  const rest = lines.slice(start + 1)
  const end = rest.findIndex((line) => /^##\s/.test(line))

  return (end === -1 ? rest : rest.slice(0, end)).join('\n')
}

/** R8: every package page names its package and follows the page skeleton. */
export function rule8(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)
    const match = relative.match(/^docs\/packages\/([^/]+)\/page\.md$/)

    if (!match) continue

    const source = fs.readFileSync(page, 'utf8')
    const frontmatter = readFrontmatter(page) ?? {}
    const expected = `${SCOPE}${match[1]}`
    const declared = frontmatter.package
    const report = (message) =>
      findings.push({
        rule: 'R8',
        level: 'error',
        message: `${relative}: ${message}`,
        file: page,
      })

    if (!declared) {
      report(`missing frontmatter "package", expected "${expected}"`)
    } else if (declared !== expected) {
      report(`frontmatter "package" is "${declared}", expected "${expected}"`)
    }

    for (const heading of PACKAGE_HEADINGS) {
      if (section(source, heading) === null) {
        report(`missing heading "${heading}"`)
      }
    }

    if (!tags(source, 'snippet').length) {
      report('no {% snippet %} tag, package pages embed their examples')
    }

    const install = section(source, '## Install')

    if (
      install !== null &&
      !/^\s*(`{3,}|~{3,})\s*bash\b/m.test(install) &&
      !install.includes('{% callout')
    ) {
      report(
        '"## Install" section has neither a bash code block nor a {% callout %}',
      )
    }
  }

  return findings
}

/**
 * The `// #region usage` marker `{% snippet %}` reads, as `snippets.mjs`
 * writes it: a line comment opening the region, closed by a `#endregion`.
 */
const USAGE_REGION_START = /^\s*\/\/\s*#region\s+usage\s*$/
const REGION_END = /^\s*(?:\/\/|\/\*|<!--|#)\s*#endregion\b/

/** The `*.stories.ts` files of a component directory, sorted. */
function storiesFiles(dir) {
  return walk(dir)
    .filter((file) => file.endsWith('.stories.ts'))
    .sort()
}

/** True when the file opens a `usage` region and closes it again. */
function hasUsageRegion(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  const start = lines.findIndex((line) => USAGE_REGION_START.test(line))

  if (start === -1) return false

  return lines.slice(start + 1).some((line) => REGION_END.test(line))
}

/** R9: every component has a story with a "usage" region. */
export function rule9(ctx) {
  const level = isStrict(ctx, 'R9') ? 'error' : 'warn'
  const findings = []

  for (const name of componentInventory(ctx.repoRoot)) {
    const dir = path.join(ctx.repoRoot, COMPONENTS_DIR, name)
    const relative = `${COMPONENTS_DIR}/${name}`
    const stories = storiesFiles(dir)

    if (!stories.length) {
      findings.push({
        rule: 'R9',
        level,
        message: `Component "${name}" has no Storybook story (expected a *.stories.ts under ${relative} with a "usage" region)`,
        file: dir,
      })
      continue
    }

    if (stories.some((file) => hasUsageRegion(path.join(dir, file)))) continue

    findings.push({
      rule: 'R9',
      level,
      message: `Component "${name}" has no "usage" region in its stories (${relative}/${stories[0]})`,
      file: path.join(dir, stories[0]),
    })
  }

  return findings
}

/** Every rule, in order. */
export function runAllRules(ctx) {
  return [
    rule1,
    rule2,
    rule3,
    rule4,
    rule5,
    rule6,
    rule7,
    rule8,
    rule9,
  ].flatMap((rule) => rule(ctx))
}
