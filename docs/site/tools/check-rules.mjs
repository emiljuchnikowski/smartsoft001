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
 * - R9: every UI component has a story with a `usage` region, in each
 *   library that has the component.
 * - R10: every skill reference points at an existing skill.
 * - R11: every fenced code block declares a language.
 * - R12: every package belongs to exactly one meta package.
 * - R13: every component page documents its usage in a tabs block.
 * - R14: every example app path a skill cites exists in the workspace.
 * - R15: every UI component has a compiled usage example, its template and
 *   its class, in `docs/examples/angular`, and its one `.tsx` file in
 *   `docs/examples/react`, in each library that has the component.
 *
 * - R16: every component skill is named in the components agent of its
 *   plugin (angular-components in smart-angular, react-components in
 *   smart-react).
 * - R17: a sentence that ends with a colon is followed by what it announces:
 *   a list, a table, a code block or a tag. A colon followed by prose or a
 *   heading is what is left when the code it introduced was dropped, as the
 *   component generator drops the code fences of a skill.
 * - R18: every component of either UI library is in both libraries, each
 *   with its component skill in the plugin of its framework.
 * - R19: the two UI libraries agree on their public types: the declarations
 *   of their models, and the component types both export under one name.
 *
 * R9 and R15 check the components of both libraries (the union inventory);
 * R2 keeps the Angular one, the components the site has a page for.
 * `framework-parity.mjs` is the only place R18 and R19 accept a difference
 * between the frameworks, each with a reason; an entry that allows nothing
 * any more is an error too. A component it lets one framework ship alone has
 * no component page, so R9 and R15 skip it as well.
 *
 * R1-R3, R9, R10, R12, R13 and R15 are the parity rules: they compare the workspace
 * with the site and only warn until `--strict` names them. R14 is an error
 * from the start, like R4: a skill citing a file that moved sends the agent to
 * the wrong place, which is worse than no citation at all. R16-R19 are
 * errors from the start as well: a component or an option one framework lacks
 * is a broken promise of the library, not a page still to write.
 */

import { load as parseYaml } from 'js-yaml'
import ts from 'typescript'

import fs from 'node:fs'
import path from 'node:path'

import { fencedLineMask, insideFence, openingFences } from './fences.mjs'
import { API_EXCEPTIONS, COMPONENT_EXCEPTIONS } from './framework-parity.mjs'
import { SECTION_ORDER } from './sections.mjs'
import {
  locateSkill,
  PLUGINS_DIR,
  pluginNames,
  repoSkillDirs,
  skillPath,
} from './skills.mjs'

const SCOPE = '@smartsoft001/'
/** The plugin whose skills document the Angular components. */
const ANGULAR_SKILLS_DIR = `${PLUGINS_DIR}/smart-angular/skills`
/** The sources of the two UI libraries. */
const ANGULAR_LIB = 'packages/shared/angular/src/lib'
const REACT_LIB = 'packages/shared/react/src/lib'
const COMPONENTS_DIR = `${ANGULAR_LIB}/components`
/** The React library: a component it has is documented, and checked, too. */
const REACT_COMPONENTS_DIR = `${REACT_LIB}/components`
const COMPONENT_SKILL_PREFIX = 'angular-components-'
/** The plugin whose skills document the React components. */
const REACT_SKILLS_DIR = `${PLUGINS_DIR}/smart-react/skills`
const REACT_COMPONENT_SKILL_PREFIX = 'react-components-'
/** Where the usage example of a component lives, relative to the repo root. */
const USAGE_EXAMPLES_DIR = 'docs/examples/angular/src/components'
const REACT_USAGE_EXAMPLES_DIR = 'docs/examples/react/src/components'
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
  { dir: 'packages/shared/react', project: 'react' },
  { dir: 'packages/crud/shell/react', project: 'crud-shell-react' },
  // The stories that render the usage examples of the component pages; each
  // Storybook loads the ones of its framework next to the library's own.
  { dir: 'docs/examples/angular', project: 'angular' },
  { dir: 'docs/examples/react', project: 'react' },
]

/** The directories whose stories files the Storybooks load. */
const STORY_ROOTS = ['packages', 'docs/examples']

/** The stories files of both libraries: Angular `.ts`, React `.tsx`. */
const STORY_FILE = /\.stories\.tsx?$/

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
 * True when the directory holds a React component: a `.tsx` file, in the
 * directory or below it, that is neither a spec nor a story. `presets` only
 * holds `.ts` files and is no component.
 */
function hasReactComponent(dir) {
  return walk(dir).some(
    (file) => file.endsWith('.tsx') && !/\.(spec|stories)\.tsx$/.test(file),
  )
}

/**
 * The two UI libraries: where each keeps its components and the plugin
 * skills that document them, how a directory is told to hold a component, and
 * what R9 and R15 expect of a component it has (the story, and the usage
 * example the component page embeds) under which label.
 */
const LIBRARIES = [
  {
    framework: 'angular',
    name: 'Angular',
    label: 'Component',
    root: ANGULAR_LIB,
    modelsDir: `${ANGULAR_LIB}/models`,
    componentsDir: COMPONENTS_DIR,
    skillsDir: ANGULAR_SKILLS_DIR,
    skillPrefix: COMPONENT_SKILL_PREFIX,
    holdsComponent: hasComponent,
    storyExtension: '.stories.ts',
    usageExamples: (name) =>
      ['html', 'ts'].map(
        (extension) =>
          `${USAGE_EXAMPLES_DIR}/${name}/usage.example.${extension}`,
      ),
  },
  {
    framework: 'react',
    name: 'React',
    label: 'React component',
    root: REACT_LIB,
    modelsDir: `${REACT_LIB}/models`,
    componentsDir: REACT_COMPONENTS_DIR,
    skillsDir: REACT_SKILLS_DIR,
    skillPrefix: REACT_COMPONENT_SKILL_PREFIX,
    holdsComponent: hasReactComponent,
    storyExtension: '.stories.tsx',
    usageExamples: (name) => [
      `${REACT_USAGE_EXAMPLES_DIR}/${name}/usage.example.tsx`,
    ],
  },
]

/**
 * The directories the library's `components/index.ts` exports that hold a
 * component.
 */
function exportedComponents(repoRoot, library) {
  const componentsDir = path.join(repoRoot, library.componentsDir)
  const indexFile = path.join(componentsDir, 'index.ts')

  if (!fs.existsSync(indexFile)) return []

  const source = fs.readFileSync(indexFile, 'utf8')

  return [...source.matchAll(/export \* from '\.\/([^']+)'/g)]
    .map((match) => match[1])
    .filter((dir) => library.holdsComponent(path.join(componentsDir, dir)))
}

/** The component names the plugin of the library has a skill directory for. */
function componentSkills(repoRoot, library) {
  return listDirectories(path.join(repoRoot, library.skillsDir))
    .filter((dir) => dir.startsWith(library.skillPrefix))
    .map((dir) => dir.slice(library.skillPrefix.length))
}

/**
 * The components of one library: the component skills of its plugin plus
 * every exported component directory of the library.
 */
function libraryInventory(repoRoot, library) {
  return new Set([
    ...componentSkills(repoRoot, library),
    ...exportedComponents(repoRoot, library),
  ])
}

/**
 * Documented UI components: the component skills of the smart-angular plugin
 * plus every exported component directory of the shared Angular library.
 */
export function componentInventory(repoRoot) {
  return [...libraryInventory(repoRoot, LIBRARIES[0])].sort()
}

/**
 * The components R9 and R15 check, sorted, each with the libraries that have
 * it: every component of either library (the union inventory), except one
 * `framework-parity.mjs` lets one framework ship alone. Such a component has
 * no component page, R2 keeping the Angular inventory, and is documented on
 * its package page, so a story usage region or a usage example of it would
 * be embedded nowhere.
 */
function documentedComponents(ctx) {
  const { components: exceptions } = parityExceptions(ctx)
  const inventories = LIBRARIES.map((library) => ({
    library,
    names: libraryInventory(ctx.repoRoot, library),
  }))
  const names = new Set(inventories.flatMap(({ names }) => [...names]))
  const exempt = (name) =>
    Boolean(exceptions[name]) && !exceptionProblem(exceptions[name], true)

  return [...names]
    .filter((name) => !exempt(name))
    .sort()
    .map((name) => ({
      name,
      libraries: inventories
        .filter(({ names }) => names.has(name))
        .map(({ library }) => library),
    }))
}

/** The skills directory of every plugin, relative to the repo root. */
function pluginSkillDirs(repoRoot) {
  return pluginNames(repoRoot).map((plugin) => ({
    plugin,
    dir: `${PLUGINS_DIR}/${plugin}/skills`,
  }))
}

/**
 * Every user-invocable skill of the plugins (smart-core, smart-angular,
 * smart-react). The repository's own skills, in the root `.claude/skills`
 * and in a package's `.claude/skills`, are tooling for working on the
 * framework, not part of what it ships, so the public site does not document
 * them.
 */
export function skillInventory(repoRoot) {
  const skills = []

  for (const { plugin, dir } of pluginSkillDirs(repoRoot)) {
    const root = path.join(repoRoot, dir)

    for (const name of listDirectories(root)) {
      const file = path.join(root, name, 'SKILL.md')

      if (!fs.existsSync(file)) continue
      if (readFrontmatter(file)?.['user-invocable'] !== true) continue

      skills.push({ name, source: 'plugin', plugin })
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
 * Every story exported by a `*.stories.ts` or `*.stories.tsx` file, with its
 * Storybook id.
 */
export function storyInventory(repoRoot) {
  const stories = []

  for (const root of STORY_ROOTS) {
    const rootDir = path.join(repoRoot, root)

    if (!fs.existsSync(rootDir)) continue

    stories.push(...rootStories(rootDir, root))
  }

  return stories.sort((a, b) => a.id.localeCompare(b.id))
}

/** The stories of one of the `STORY_ROOTS`. */
function rootStories(rootDir, root) {
  const stories = []

  for (const relative of walk(rootDir)) {
    if (!STORY_FILE.test(relative)) continue

    const file = `${root}/${relative}`
    const project = storyProject(file)

    if (!project) continue

    const source = fs.readFileSync(path.join(rootDir, relative), 'utf8')
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

  return stories
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

/** R3: every user-invocable plugin skill has a page under `docs/skills`. */
export function rule3(ctx) {
  return skillInventory(ctx.repoRoot)
    .map(({ name }) => ({ name, page: docsPage(ctx, 'skills', name) }))
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

/**
 * Every `{% … %}` match of `pattern` that is an instruction: a tag inside a
 * fenced code block is a quoted example and is left to the reader. Group 1 of
 * `pattern`, when it has one, holds the attributes.
 */
function tagMatches(source, pattern) {
  const fenced = insideFence(source)

  return [...source.matchAll(pattern)]
    .filter((match) => !fenced(match.index))
    .map((match) => {
      const attributes = {}

      for (const attribute of (match[1] ?? '').matchAll(/(\w+)="([^"]*)"/g)) {
        attributes[attribute[1]] = attribute[2]
      }

      return {
        attributes,
        index: match.index,
        line: lineOf(source, match.index),
      }
    })
}

/** Every self-closing `{% name … /%}` tag of `source`. */
function tags(source, name) {
  return tagMatches(
    source,
    new RegExp(`\\{%\\s*${name}\\s+([^%]*?)\\/%\\}`, 'g'),
  )
}

/**
 * Every opening tag of the block tag `name`, such as `{% tabs %}` or
 * `{% tab title="HTML" %}`. The lookahead keeps `tab` from matching `tabs`.
 */
function blockTags(source, name) {
  return tagMatches(
    source,
    new RegExp(`\\{%\\s*${name}(?![\\w-])([^%]*?)%\\}`, 'g'),
  )
}

/** Every closing `{% /name %}` tag of the block tag `name`. */
function closingTags(source, name) {
  return tagMatches(source, new RegExp(`\\{%\\s*\\/${name}\\s*%\\}`, 'g'))
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

    for (const { line, language } of openingFences(
      fs.readFileSync(page, 'utf8'),
    )) {
      if (!CODE_LANGUAGES.has(language.toLowerCase())) continue

      findings.push({
        rule: 'R6',
        level: 'error',
        message: `${relative}:${line}: inline "${language}" code block, use a {% snippet %} tag instead`,
        file: page,
      })
    }
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

/** The stories files (`*.stories.ts` by default) of a component directory. */
function storiesFiles(dir, extension = '.stories.ts') {
  return walk(dir)
    .filter((file) => file.endsWith(extension))
    .sort()
}

/** True when the file opens a `usage` region and closes it again. */
function hasUsageRegion(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  const start = lines.findIndex((line) => USAGE_REGION_START.test(line))

  if (start === -1) return false

  return lines.slice(start + 1).some((line) => REGION_END.test(line))
}

/**
 * R9: every component has a story with a "usage" region, in each library
 * that has the component. A component `framework-parity.mjs` lets one
 * framework ship alone is skipped: it has no component page to embed the
 * region in.
 */
export function rule9(ctx) {
  const level = isStrict(ctx, 'R9') ? 'error' : 'warn'
  const findings = []

  for (const { name, libraries } of documentedComponents(ctx)) {
    for (const library of libraries) {
      const dir = path.join(ctx.repoRoot, library.componentsDir, name)
      const relative = `${library.componentsDir}/${name}`
      const stories = storiesFiles(dir, library.storyExtension)

      if (!stories.length) {
        findings.push({
          rule: 'R9',
          level,
          message: `${library.label} "${name}" has no Storybook story (expected a *${library.storyExtension} under ${relative} with a "usage" region)`,
          file: dir,
        })
        continue
      }

      if (stories.some((file) => hasUsageRegion(path.join(dir, file)))) {
        continue
      }

      findings.push({
        rule: 'R9',
        level,
        message: `${library.label} "${name}" has no "usage" region in its stories (${relative}/${stories[0]})`,
        file: path.join(dir, stories[0]),
      })
    }
  }

  return findings
}

/** The skill sources a page or a tag can name. */
const SKILL_SOURCES = new Set(['plugin', 'repo'])

/**
 * The directories whose pages document a skill, with the source their
 * `skill:` frontmatter resolves against.
 */
const SKILL_PAGE_DIRS = [{ dir: 'docs/skills/', source: 'plugin' }]

/**
 * The `SKILL.md` of `name` relative to the repo root, looked up in every
 * plugin for a plugin skill, with `exists` telling whether it was found; a
 * plugin skill that was not found names every plugin (`plugins/*`). `null`
 * when `source` is not a known skill source.
 */
function skillFile(repoRoot, source, name) {
  if (!SKILL_SOURCES.has(source)) return null

  const located = locateSkill(repoRoot, name, source)

  return located
    ? { file: located.file, exists: true }
    : { file: skillPath(name, source), exists: false }
}

/**
 * The problems of the `skill:` frontmatter of one page: a documented page
 * names a skill that exists and carries its name as the page title.
 */
function skillPageMessages(ctx, page, relative) {
  const documented = SKILL_PAGE_DIRS.find((entry) =>
    relative.startsWith(entry.dir),
  )

  if (!documented) return []

  const frontmatter = readFrontmatter(page) ?? {}
  const name = frontmatter.skill

  if (!name) return []

  const { file, exists } = skillFile(ctx.repoRoot, documented.source, name)

  if (!exists) {
    return [`skill "${name}" has no SKILL.md (expected ${file})`]
  }

  const declared = (readFrontmatter(path.join(ctx.repoRoot, file)) ?? {}).name

  if (frontmatter.title === declared) return []

  return [
    `title "${frontmatter.title}" does not match the skill name "${declared}"`,
  ]
}

/** The `{% skill %}` tags of one page that resolve to no `SKILL.md`. */
function skillTagMessages(ctx, source) {
  const broken = []

  for (const { attributes, line } of tags(source, 'skill')) {
    const name = attributes.name ?? ''
    const from = attributes.source ?? 'plugin'

    if (skillFile(ctx.repoRoot, from, name)?.exists) continue

    broken.push({ line, message: `unknown skill "${name}" (source "${from}")` })
  }

  return broken
}

/** R10: every skill reference points at an existing skill. */
export function rule10(ctx) {
  const level = isStrict(ctx, 'R10') ? 'error' : 'warn'
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)
    const messages = skillPageMessages(ctx, page, relative).map(
      (message) => `${relative}: ${message}`,
    )

    for (const { line, message } of skillTagMessages(
      ctx,
      fs.readFileSync(page, 'utf8'),
    )) {
      messages.push(`${relative}:${line}: ${message}`)
    }

    findings.push(
      ...messages.map((message) => ({
        rule: 'R10',
        level,
        message,
        file: page,
      })),
    )
  }

  return findings
}

/** R11: every fenced code block declares a language. */
export function rule11(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)

    for (const { line, language } of openingFences(
      fs.readFileSync(page, 'utf8'),
    )) {
      if (language) continue

      findings.push({
        rule: 'R11',
        level: 'error',
        message: `${relative}:${line}: fenced code block has no language (use \`\`\`text for plain output)`,
        file: page,
      })
    }
  }

  return findings
}

/**
 * The packages R12 does not expect any meta package to aggregate, with the
 * reason each one stays out. An entry that stops being true has to be removed:
 * R12 reports a package that is on this list and in a meta package as well.
 */
export const PACKAGES_OUTSIDE_META = {
  fb: 'a standalone integration, chosen per project rather than installed with a stack',
  google:
    'a standalone integration, chosen per project rather than installed with a stack',
  'claude-plugins': 'installed as a Claude Code plugin, not as a library',
  'trans-shell-dtos-services':
    'not published on npm yet (FRA-362), a stack depending on it would not install',
}

/**
 * The meta packages: the `packages/meta/*` packages that exist only to
 * aggregate dependencies, so a consumer installs a stack with one command.
 * Each entry carries the `@smartsoft001/*` packages it depends on, without the
 * scope prefix.
 */
function metaPackages(repoRoot) {
  const metaDir = path.join(repoRoot, 'packages', 'meta')
  const metas = []

  for (const dir of listDirectories(metaDir)) {
    const file = path.join(metaDir, dir, 'package.json')

    let pkg

    try {
      pkg = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      continue
    }

    if (typeof pkg.name !== 'string' || !pkg.name.startsWith(SCOPE)) continue

    const dependencies = Object.keys(pkg.dependencies ?? {})
      .filter((name) => name.startsWith(SCOPE))
      .map((name) => name.slice(SCOPE.length))

    metas.push({
      name: pkg.name.slice(SCOPE.length),
      file,
      dependencies: new Set(dependencies),
    })
  }

  return metas.sort((a, b) => a.name.localeCompare(b.name))
}

/** R12: every package reaches a consumer through a meta package. */
export function rule12(ctx) {
  const level = isStrict(ctx, 'R12') ? 'error' : 'warn'
  const metas = metaPackages(ctx.repoRoot)
  const metaNames = new Set(metas.map((meta) => meta.name))
  const finding = (message, file) => ({ rule: 'R12', level, message, file })
  const findings = []

  for (const name of packageInventory(ctx.repoRoot)) {
    // A meta package aggregates the others, it does not belong to one itself.
    if (metaNames.has(name)) continue

    const owners = metas.filter((meta) => meta.dependencies.has(name))
    const named = owners.map((meta) => meta.name).join(', ')

    if (Object.hasOwn(PACKAGES_OUTSIDE_META, name)) {
      findings.push(
        ...owners.map((meta) =>
          finding(
            `Package "${name}" is excluded but also listed in meta package "${meta.name}"`,
            meta.file,
          ),
        ),
      )
    } else if (!owners.length) {
      findings.push(
        finding(
          `Package "${name}" belongs to no meta package (add it to one of packages/meta/* or to the exclusions in check-rules.mjs)`,
          path.join(ctx.repoRoot, 'packages'),
        ),
      )
    } else if (owners.length > 1) {
      findings.push(
        finding(
          `Package "${name}" belongs to more than one meta package (${named})`,
          owners[0].file,
        ),
      )
    }
  }

  return findings
}

/**
 * The tab titles every component page carries, in the order they appear, and
 * the ones it may carry on top of them. The `Nx generator` tab only shows up
 * once a generator collection exists, so it is allowed but not required.
 */
const REQUIRED_USAGE_TABS = ['HTML', 'TypeScript', 'Claude Code']
/** The React variant shows the one file a consumer writes. */
const REACT_USAGE_TABS = ['TSX', 'Claude Code']
const ALLOWED_USAGE_TABS = [
  ...REQUIRED_USAGE_TABS,
  ...REACT_USAGE_TABS,
  'Nx generator',
]
const REACT_BLOCK = '{% framework name="react" %}'

/** The `title` of every `{% tab %}` between the tabs block delimiters. */
function usageTabTitles(source, opening, closing) {
  return blockTags(source, 'tab')
    .filter((tag) => tag.index > opening.index && tag.index < closing.index)
    .map((tag) => tag.attributes.title)
}

/** R13: every component page documents its usage in a tabs block. */
export function rule13(ctx) {
  const level = isStrict(ctx, 'R13') ? 'error' : 'warn'
  const findings = []

  for (const page of docsPages(ctx)) {
    const relative = relativeToDocs(ctx, page)

    // The section index documents no component of its own.
    if (!/^docs\/components\/[^/]+\/page\.md$/.test(relative)) continue

    const source = fs.readFileSync(page, 'utf8')
    const report = (message) =>
      findings.push({
        rule: 'R13',
        level,
        message: `${relative}: ${message}`,
        file: page,
      })
    const opening = blockTags(source, 'tabs')
    const closing = closingTags(source, 'tabs')

    if (!opening.length || !closing.length) {
      report('the usage section has no {% tabs %} block')
      continue
    }

    const titles = usageTabTitles(source, opening[0], closing.at(-1))
    const required = source.includes(REACT_BLOCK)
      ? [...new Set([...REQUIRED_USAGE_TABS, ...REACT_USAGE_TABS])]
      : REQUIRED_USAGE_TABS

    for (const title of required) {
      if (!titles.includes(title)) report(`usage tabs are missing "${title}"`)
    }

    for (const title of new Set(titles)) {
      if (ALLOWED_USAGE_TABS.includes(title)) continue

      report(`unexpected usage tab "${title}"`)
    }
  }

  return findings
}

/**
 * The example application the skills cite as their reference implementation,
 * and a backticked path into it. A bare `docs/examples/app` names the app as
 * a whole; a trailing `/` is how prose points at a directory.
 */
const EXAMPLE_APP_DIR = 'docs/examples/app'
const EXAMPLE_APP_PATH = /`(docs\/examples\/app(?:\/[^`\s]*)?)`/g

/**
 * Every `SKILL.md` of both skill sources, relative to the repo root: every
 * plugin, and the repository's skills in the root `.claude/skills` and in
 * each package's `.claude/skills`.
 */
function skillFiles(repoRoot) {
  const files = []
  const dirs = [
    ...pluginSkillDirs(repoRoot).map(({ dir }) => dir),
    ...repoSkillDirs(repoRoot),
  ]

  for (const dir of dirs) {
    for (const name of listDirectories(path.join(repoRoot, dir))) {
      const file = `${dir}/${name}/SKILL.md`

      if (fs.existsSync(path.join(repoRoot, file))) files.push(file)
    }
  }

  return files
}

/** R14: every example app path a skill cites exists in the workspace. */
export function rule14(ctx) {
  const findings = []

  for (const file of skillFiles(ctx.repoRoot)) {
    const resolved = path.join(ctx.repoRoot, file)
    const source = fs.readFileSync(resolved, 'utf8')

    // A path inside a fenced block is not skipped on purpose: the agent reads
    // a code block as readily as prose, so a stale path there misleads it too.
    for (const match of source.matchAll(EXAMPLE_APP_PATH)) {
      const cited = match[1].replace(/\/$/, '')

      // A directory is as good a reference as a file: `existsSync` accepts both.
      if (fs.existsSync(path.join(ctx.repoRoot, cited))) continue

      findings.push({
        rule: 'R14',
        level: 'error',
        message: `${file}:${lineOf(source, match.index)}: cited path "${cited}" does not exist under ${EXAMPLE_APP_DIR}`,
        file: resolved,
      })
    }
  }

  return findings
}

/**
 * R15: every component has a usage example. Its template and its class are
 * the HTML and TypeScript tabs of the component page, the code a consumer
 * writes, so a component without one falls back to its Storybook story. A
 * component the React library has needs its `.tsx` example for the TSX tab;
 * each library that has the component is checked. A component
 * `framework-parity.mjs` lets one framework ship alone is skipped: it has no
 * component page to show the example on.
 */
export function rule15(ctx) {
  const level = isStrict(ctx, 'R15') ? 'error' : 'warn'
  const findings = []

  for (const { name, libraries } of documentedComponents(ctx)) {
    for (const { label, usageExamples } of libraries) {
      const missing = usageExamples(name).filter(
        (file) => !fs.existsSync(path.join(ctx.repoRoot, file)),
      )

      if (!missing.length) continue

      findings.push({
        rule: 'R15',
        level,
        message: `${label} "${name}" has no usage example (expected ${missing.join(' and ')})`,
        file: path.join(ctx.repoRoot, missing[0]),
      })
    }
  }

  return findings
}

/**
 * The agents that delegate UI work to the component skills of their plugin:
 * each plugin's skills with `prefix` must be named in its `agent`.
 */
const COMPONENT_AGENTS = [
  {
    plugin: 'smart-angular',
    prefix: COMPONENT_SKILL_PREFIX,
    agent: 'angular-components',
  },
  {
    plugin: 'smart-react',
    prefix: REACT_COMPONENT_SKILL_PREFIX,
    agent: 'react-components',
  },
]

/**
 * R16: every component skill is named in the components agent of its plugin.
 * The agent only delegates to the skills its catalogue lists, so a skill
 * missing there is never used, however complete. An error from the start,
 * like R14.
 */
export function rule16(ctx) {
  return COMPONENT_AGENTS.flatMap(({ plugin, prefix, agent }) => {
    const file = `${PLUGINS_DIR}/${plugin}/agents/${agent}.md`
    const resolved = path.join(ctx.repoRoot, file)

    if (!fs.existsSync(resolved)) return []

    const source = fs.readFileSync(resolved, 'utf8')

    return listDirectories(
      path.join(ctx.repoRoot, PLUGINS_DIR, plugin, 'skills'),
    )
      .filter((name) => name.startsWith(prefix))
      .filter((name) => !source.includes(`\`${name}\``))
      .map((name) => ({
        rule: 'R16',
        level: 'error',
        message: `Skill "${name}" is not named in the ${agent} agent (${file})`,
        file: resolved,
      }))
  })
}

/** What may follow a line ending with a colon: the thing it announces. */
const ANNOUNCED = /^(?:[-*+] |\d+\. |\||```|~~~|>|\{% (?!\/))/

/**
 * The 1-based line numbers of the lines of `source` that end with a colon
 * but are not followed by what they announce. Lines in code blocks and the
 * frontmatter are skipped, and so are colons a list item or an indented line
 * ends with, since nested content follows those.
 */
export function danglingColons(source) {
  const lines = source.split('\n')
  const fenced = fencedLineMask(source)
  const found = []
  let start = 0

  if (lines[0]?.trim() === '---') {
    const end = lines.indexOf('---', 1)

    start = end === -1 ? 0 : end + 1
  }

  for (let index = start; index < lines.length; index++) {
    const line = lines[index]

    if (fenced[index] || !line.trimEnd().endsWith(':')) continue
    if (/^\s/.test(line) || /^(?:[-*+] |\d+\. |#)/.test(line)) continue

    let next = index + 1

    while (next < lines.length && lines[next].trim() === '') next++

    if (next < lines.length && ANNOUNCED.test(lines[next].trim())) continue

    found.push(index + 1)
  }

  return found
}

/** R17: a sentence that ends with a colon is followed by what it announces. */
export function rule17(ctx) {
  const findings = []

  for (const page of docsPages(ctx)) {
    const source = fs.readFileSync(page, 'utf8')

    for (const line of danglingColons(source)) {
      findings.push({
        rule: 'R17',
        level: 'error',
        message: `${relativeToDocs(ctx, page)}:${line}: the sentence ends with a colon but no list, table, code block or tag follows it`,
        file: page,
      })
    }
  }

  return findings
}

/** The one place a difference between the two frameworks is allowed. */
const PARITY_FILE = 'docs/site/tools/framework-parity.mjs'

/**
 * The differences between the frameworks R18 and R19 accept:
 * `framework-parity.mjs`, unless the context brings its own, as the tests do
 * for a fixture workspace.
 */
function parityExceptions(ctx) {
  return ctx.parity ?? { components: COMPONENT_EXCEPTIONS, api: API_EXCEPTIONS }
}

/**
 * True when the workspace has both UI libraries. R18 and R19 compare the two,
 * so a workspace without one of them, like the fixture workspaces of the other
 * rules, has nothing to compare.
 */
function hasBothLibraries(repoRoot) {
  return LIBRARIES.every(({ root }) => fs.existsSync(path.join(repoRoot, root)))
}

/** The library of `framework`, `undefined` for any other value. */
function libraryOf(framework) {
  return LIBRARIES.find((library) => library.framework === framework)
}

/**
 * What is wrong with an entry of `framework-parity.mjs`, or `null`. Every
 * entry carries a reason, and its `only`, mandatory when `required`, names one
 * of the two frameworks.
 */
function exceptionProblem(entry, required) {
  if ((required || entry.only !== undefined) && !libraryOf(entry.only)) {
    return 'names no framework ("only" is "angular" or "react")'
  }

  if (typeof entry.reason !== 'string' || !entry.reason.trim()) {
    return 'has no reason'
  }

  return null
}

/**
 * What a valid component exception means for the component `name`: the
 * libraries R18 holds to it, and why the entry is stale, or `null`. The
 * entry lets the framework it names ship the component alone; once the other
 * framework has the component or its skill, both are held to it again, and a
 * component neither framework has is left alone.
 */
function componentExemption(name, exception, libraries) {
  const owner = libraryOf(exception.only)
  const holders = libraries.filter(
    ({ exported, skills }) => exported.has(name) || skills.has(name),
  )
  const others = holders.filter(({ library }) => library !== owner)

  if (!holders.length) {
    return {
      checked: [],
      stale: 'neither framework has the component or its skill',
    }
  }

  if (!others.length) return { checked: holders, stale: null }

  const too = holders.length > others.length ? ' too' : ''

  return {
    checked: libraries,
    stale: `${others[0].library.name} has the component or its skill${too}`,
  }
}

/**
 * R18: every component of either library is in both, each with its
 * component skill, unless `framework-parity.mjs` lets one framework ship it
 * alone. An error from the start, like R14.
 */
export function rule18(ctx) {
  if (!hasBothLibraries(ctx.repoRoot)) return []

  const libraries = LIBRARIES.map((library) => ({
    library,
    exported: new Set(exportedComponents(ctx.repoRoot, library)),
    skills: new Set(componentSkills(ctx.repoRoot, library)),
  }))
  const { components: exceptions } = parityExceptions(ctx)
  const names = new Set([
    ...libraries.flatMap(({ exported, skills }) => [...exported, ...skills]),
    ...Object.keys(exceptions),
  ])
  const parityFile = path.join(ctx.repoRoot, PARITY_FILE)
  const findings = []
  const report = (message, file) =>
    findings.push({ rule: 'R18', level: 'error', message, file })

  for (const name of [...names].sort()) {
    const exception = exceptions[name]
    const problem = exception && exceptionProblem(exception, true)
    let checked = libraries

    if (problem) {
      report(
        `Component exception "${name}" in ${PARITY_FILE} ${problem}`,
        parityFile,
      )
    } else if (exception) {
      const exemption = componentExemption(name, exception, libraries)

      checked = exemption.checked

      if (exemption.stale) {
        report(
          `Component exception "${name}" (${libraryOf(exception.only).name} only) in ${PARITY_FILE} is stale: ${exemption.stale} (remove the entry)`,
          parityFile,
        )
      }
    }

    for (const { library, exported } of checked) {
      const dir = `${library.componentsDir}/${name}`
      const skill = `${library.skillsDir}/${library.skillPrefix}${name}/SKILL.md`
      const label = `${library.name} component "${name}"`

      if (!exported.has(name)) {
        report(
          `${label} is not in the library (expected a component in ${dir}, exported from ${library.componentsDir}/index.ts)`,
          path.join(ctx.repoRoot, dir),
        )
      }

      if (!fs.existsSync(path.join(ctx.repoRoot, skill))) {
        report(
          `${label} has no skill (expected ${skill})`,
          path.join(ctx.repoRoot, skill),
        )
      }
    }
  }

  return findings
}

/** The files R19 reads below `dir`: sources, without specs and stories. */
function apiSourceFiles(dir) {
  return walk(dir)
    .filter((file) => /\.tsx?$/.test(file))
    .filter((file) => !/(\.d|\.spec|\.stories|\.test)\.tsx?$/.test(file))
    .sort()
    .map((file) => path.join(dir, file))
}

function isExported(statement) {
  return Boolean(
    statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    ),
  )
}

/**
 * The literals of a type that is a literal or a union of literals only,
 * sorted and written the same way on both sides (`'a'`, `1`, `true`), or
 * `null` for any other type.
 */
function literalsOf(type) {
  let node = type

  while (node && ts.isParenthesizedTypeNode(node)) node = node.type

  if (!node) return null

  const parts = ts.isUnionTypeNode(node) ? node.types : [node]

  if (!parts.every((part) => ts.isLiteralTypeNode(part))) return null

  const texts = parts.map(({ literal }) =>
    ts.isStringLiteral(literal) ? `'${literal.text}'` : literal.getText(),
  )

  return [...new Set(texts)].sort()
}

/**
 * What only one of the Angular and the React list holds, as
 * `a in Angular only and b in React only`, or `null` when they hold the same.
 */
function exclusive(angular, react) {
  const parts = [
    [angular.filter((item) => !react.includes(item)), 'Angular'],
    [react.filter((item) => !angular.includes(item)), 'React'],
  ]
    .filter(([only]) => only.length)
    .map(([only, framework]) => `${only.join(', ')} in ${framework} only`)

  return parts.length ? parts.join(' and ') : null
}

/**
 * How the literals of the Angular and the React type differ, as the phrase
 * R19 reports, or `null` when they agree or neither type is a union of
 * literals.
 */
function literalDrift(angular, react) {
  if (!angular && !react) return null

  if (!angular || !react) {
    const [union, other] = angular ? ['Angular', 'React'] : ['React', 'Angular']

    return `is a union of literals in ${union} but not in ${other}`
  }

  const only = exclusive(angular, react)

  return only && `allows ${only}`
}

/** The name of an interface member, `null` for an index or call signature. */
function memberName(member, source) {
  if (!member.name) return null

  return ts.isComputedPropertyName(member.name)
    ? member.name.getText(source)
    : member.name.text
}

/**
 * The name R19 compares a member under: without the trailing `$` Angular
 * gives an `Observable` member (`disabled$` in Angular is `disabled` in
 * React).
 */
function comparedName(name) {
  return name.replace(/\$$/, '')
}

/**
 * The named members of an interface, by compared name, with the name as
 * written, its optionality, its literals and where it is.
 */
function interfaceMembers(members, source, locate) {
  const result = new Map()

  for (const member of members) {
    const name = memberName(member, source)

    if (name === null) continue

    result.set(comparedName(name), {
      name,
      optional: Boolean(member.questionToken),
      literals: literalsOf(member.type),
      where: locate(member),
    })
  }

  return result
}

/**
 * The declarations one exported top-level statement makes, as
 * `[name, node, description]` entries; the description carries the kind R19
 * compares first and, by kind, what it compares next.
 */
function statementDeclarations(statement, source, locate) {
  const named = (description) => [[statement.name.text, statement, description]]

  if (ts.isInterfaceDeclaration(statement)) {
    return named({
      kind: 'interface',
      members: interfaceMembers(statement.members, source, locate),
    })
  }

  if (ts.isTypeAliasDeclaration(statement)) {
    return named({ kind: 'type alias', literals: literalsOf(statement.type) })
  }

  if (ts.isEnumDeclaration(statement)) {
    return named({
      kind: 'enum',
      names: statement.members.map((member) => memberName(member, source)),
    })
  }

  if (ts.isClassDeclaration(statement) && statement.name) {
    return named({ kind: 'class' })
  }

  if (ts.isFunctionDeclaration(statement) && statement.name) {
    return named({ kind: 'function' })
  }

  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations
      .filter((declaration) => ts.isIdentifier(declaration.name))
      .map((declaration) => [
        declaration.name.text,
        declaration,
        { kind: 'const' },
      ])
  }

  return []
}

/**
 * The exported top-level declarations of the sources below `dir` (relative
 * to the repo root), by name; the first file that declares a name wins. Each
 * one records its file and where it is, as `path:line`.
 */
function exportedDeclarations(repoRoot, dir) {
  const declarations = new Map()

  for (const file of apiSourceFiles(path.join(repoRoot, dir))) {
    const source = ts.createSourceFile(
      file,
      fs.readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    )
    const relative = path.relative(repoRoot, file).split(path.sep).join('/')
    const locate = (node) => {
      const start = source.getLineAndCharacterOfPosition(node.getStart(source))

      return `${relative}:${start.line + 1}`
    }

    for (const statement of source.statements.filter(isExported)) {
      for (const [name, node, description] of statementDeclarations(
        statement,
        source,
        locate,
      )) {
        if (declarations.has(name)) continue

        declarations.set(name, { ...description, file, where: locate(node) })
      }
    }
  }

  return declarations
}

/** The interfaces and type aliases among `declarations`. */
function typeDeclarations(declarations) {
  return new Map(
    [...declarations].filter(([, { kind }]) =>
      ['interface', 'type alias'].includes(kind),
    ),
  )
}

/**
 * How the members of two interfaces named `name` differ: a member one side
 * declares and the other not, its optionality, its literals.
 */
function memberDifferences(name, angular, react) {
  const differences = []
  const members = new Set([...angular.members.keys(), ...react.members.keys()])

  for (const member of [...members].sort()) {
    const key = `${name}.${member}`
    const a = angular.members.get(member)
    const r = react.members.get(member)

    if (!a || !r) {
      const [owner, declaration, declared] = a
        ? [LIBRARIES[0], angular, a]
        : [LIBRARIES[1], react, r]

      differences.push({
        key,
        only: owner.framework,
        message: `Member "${name}.${declared.name}" is declared in ${owner.name} only (${declared.where})`,
        file: declaration.file,
      })
      continue
    }

    if (a.optional !== r.optional) {
      const state = ({ optional }) => (optional ? 'optional' : 'required')

      differences.push({
        key,
        message: `Member "${key}" is ${state(a)} in Angular (${a.where}) but ${state(r)} in React (${r.where})`,
        file: angular.file,
      })
    }

    const drift = literalDrift(a.literals, r.literals)

    if (drift) {
      differences.push({
        key,
        message: `Member "${key}" ${drift} (${a.where}, ${r.where})`,
        file: angular.file,
      })
    }
  }

  return differences
}

/**
 * How two declarations of `name`, the Angular one and the React one, differ:
 * `{ key, only, message, file }` entries, where `key` is `name` or
 * `name.member` and `only`, for something one side has, names that side.
 * Member types other than literal unions are not compared: `TemplateRef`
 * against `ReactNode` or `Signal<T>` against `T` are the frameworks' idioms.
 */
function declarationDifferences(name, angular, react) {
  const both = `${angular.where}, ${react.where}`

  if (angular.kind !== react.kind) {
    const article = ({ kind }) =>
      `${/^[aeiou]/.test(kind) ? 'an' : 'a'} ${kind}`

    return [
      {
        key: name,
        message: `Declaration "${name}" is ${article(angular)} in Angular (${angular.where}) but ${article(react)} in React (${react.where})`,
        file: angular.file,
      },
    ]
  }

  const differences = []
  const literals = literalDrift(angular.literals, react.literals)
  const enumMembers =
    angular.names && react.names && exclusive(angular.names, react.names)

  if (literals) {
    differences.push({
      key: name,
      message: `Type "${name}" ${literals} (${both})`,
      file: angular.file,
    })
  }

  if (enumMembers) {
    differences.push({
      key: name,
      message: `Enum "${name}" has ${enumMembers} (${both})`,
      file: angular.file,
    })
  }

  if (angular.members && react.members) {
    differences.push(...memberDifferences(name, angular, react))
  }

  return differences
}

/**
 * How the models of the two libraries differ: a declaration one of them
 * exports and the other does not, and how the declarations both export
 * differ.
 */
function modelDifferences(angular, react) {
  const names = new Set([...angular.keys(), ...react.keys()])
  const differences = []

  for (const name of [...names].sort()) {
    if (angular.has(name) && react.has(name)) {
      differences.push(
        ...declarationDifferences(name, angular.get(name), react.get(name)),
      )
      continue
    }

    const [owner, declaration] = angular.has(name)
      ? [LIBRARIES[0], angular.get(name)]
      : [LIBRARIES[1], react.get(name)]

    differences.push({
      key: name,
      only: owner.framework,
      message: `Declaration "${name}" is exported by the ${owner.name} models only (${declaration.where})`,
      file: declaration.file,
    })
  }

  return differences
}

/**
 * How the declarations both libraries export under the same name differ; a
 * name only one of them exports, like a React `Smart*Props`, is no
 * difference.
 */
function sharedNameDifferences(angular, react) {
  return [...angular.keys()]
    .filter((name) => react.has(name))
    .sort()
    .flatMap((name) =>
      declarationDifferences(name, angular.get(name), react.get(name)),
    )
}

/**
 * A function that returns the entry of the API exceptions that allows a
 * difference, or `null`. An entry allows a difference of its key; with
 * `only`, only that framework may have what the other lacks. An entry for a
 * declaration without `only` allows every difference of its members as well.
 */
function apiExceptionMatcher(exceptions) {
  const entries = new Map(
    Object.entries(exceptions).map(([key, entry]) => [
      comparedName(key),
      { key, ...entry },
    ]),
  )

  return ({ key, only }) => {
    const exact = entries.get(key)

    if (exact && (!exact.only || exact.only === only)) return exact

    const declaration = entries.get(key.split('.')[0])

    return key.includes('.') && declaration && !declaration.only
      ? declaration
      : null
  }
}

/**
 * True when one of the declaration maps of a library declares `key`: a
 * declaration name, or `Name.member` for a member of it.
 */
function declares(maps, key) {
  const [name, member] = comparedName(key).split('.')
  const declaration = maps.map((map) => map.get(name)).find(Boolean)

  if (!declaration) return false

  return member === undefined || Boolean(declaration.members?.has(member))
}

/**
 * Why an API exception that allowed no difference is stale, from the
 * libraries that declare its key.
 */
function staleApiState(only, holders) {
  if (!holders.length) return 'neither library declares it'
  if (holders.length === 1) return `only ${holders[0].name} declares it`

  return only ? 'both libraries declare it' : 'the two libraries agree on it'
}

/**
 * R19: the two libraries agree on their public types. Their models export
 * the same declarations, and the interfaces and type aliases both
 * `components/` trees export under one name match: the same kind, the same
 * members with the same optionality, the same literals and enum members.
 * Differences are allowed only by `framework-parity.mjs`. An error from the
 * start, like R14.
 */
export function rule19(ctx) {
  if (!hasBothLibraries(ctx.repoRoot)) return []

  const models = LIBRARIES.map(({ modelsDir }) =>
    exportedDeclarations(ctx.repoRoot, modelsDir),
  )
  const components = LIBRARIES.map(({ componentsDir }) =>
    typeDeclarations(exportedDeclarations(ctx.repoRoot, componentsDir)),
  )
  const differences = [
    ...modelDifferences(...models),
    ...sharedNameDifferences(...components),
  ]
  const exceptions = parityExceptions(ctx).api
  const problems = new Map(
    Object.entries(exceptions)
      .map(([key, entry]) => [key, exceptionProblem(entry, false)])
      .filter(([, problem]) => problem),
  )
  const allowed = apiExceptionMatcher(
    Object.fromEntries(
      Object.entries(exceptions).filter(([key]) => !problems.has(key)),
    ),
  )
  const parityFile = path.join(ctx.repoRoot, PARITY_FILE)
  const used = new Set()
  const findings = []
  const report = (message, file) =>
    findings.push({ rule: 'R19', level: 'error', message, file })

  for (const difference of differences) {
    const entry = allowed(difference)

    if (entry) {
      used.add(entry.key)
    } else {
      report(difference.message, difference.file)
    }
  }

  for (const key of Object.keys(exceptions).sort()) {
    if (problems.has(key)) {
      report(
        `API exception "${key}" in ${PARITY_FILE} ${problems.get(key)}`,
        parityFile,
      )
      continue
    }

    if (used.has(key)) continue

    const { only } = exceptions[key]
    const label = only ? ` (${libraryOf(only).name} only)` : ''
    const holders = LIBRARIES.filter((library, index) =>
      declares([models[index], components[index]], key),
    )

    report(
      `API exception "${key}"${label} in ${PARITY_FILE} is stale: ${staleApiState(only, holders)} (remove the entry)`,
      parityFile,
    )
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
    rule10,
    rule11,
    rule12,
    rule13,
    rule14,
    rule15,
    rule16,
    rule17,
    rule18,
    rule19,
  ].flatMap((rule) => rule(ctx))
}
