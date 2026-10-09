import * as fs from 'node:fs'
import * as path from 'node:path'

import { insideFence } from './fences.mjs'
import { parseFrontmatter } from './navigation.mjs'

/**
 * Skill headers: instead of retyping what a skill does, a page.md writes
 *
 *   {% skill name="audit-log" /%}
 *
 * and this module expands the tag into a callout plus an invocation table
 * built from the frontmatter of the skill's own `SKILL.md`. Claude Code reads
 * that same file, so the published page can never drift from the skill.
 *
 * Used by the webpack loader (src/markdoc/snippet-loader.mjs) and by the
 * search indexer, which reads the same pages straight from disk.
 */

// A tag has to own its line: `{% skill … /%}` inside a sentence stays
// verbatim, exactly like a tag quoted inside a fenced code block.
const SKILL_TAG = /^[ \t]*\{%\s*skill\b([^\n]*?)\/%\}[ \t]*$/gm
const ATTRIBUTE = /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

const REPO_URL = 'https://github.com/emiljuchnikowski/smartsoft001/blob/main'

/**
 * The plugins of the `smartsoft` marketplace, one directory each
 * (`smart-core`, `smart-angular`, `smart-react`). A plugin skill lives in
 * `<plugin>/skills/<name>/SKILL.md` and is invoked as `/<plugin>:<name>`.
 */
export const PLUGINS_DIR = 'packages/shared/claude-plugins/src/plugins'

/**
 * The repository's own skills: the shared ones in the root `.claude/skills`,
 * the framework ones next to their package, in a `.claude/skills` below
 * `packages/`.
 */
export const REPO_SKILLS_DIR = '.claude/skills'
const PACKAGES_DIR = 'packages'
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'coverage'])

/** Skill sources a page or a tag can name. */
const SOURCES = new Set(['plugin', 'repo'])

const DEFAULT_SOURCE = 'plugin'
const NO_TOOLS = '—'

function skillError(message) {
  return new Error(`[skill] ${message}`)
}

function sourceOf(source, tag) {
  if (SOURCES.has(source)) return source

  const expected = [...SOURCES].map((name) => `"${name}"`).join(', ')

  throw skillError(
    `${tag ? `${tag}: ` : ''}unknown source "${source}", expected one of ${expected}`,
  )
}

/** Every plugin of the marketplace, by directory name. */
export function pluginNames(repoRoot) {
  const dir = path.join(repoRoot, PLUGINS_DIR)

  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

/**
 * Every directory that holds repository skills, relative to the repo root:
 * the root `.claude/skills` first, then each `.claude/skills` found below
 * `packages/`, skipping `node_modules`, build output and other dot
 * directories.
 */
export function repoSkillDirs(repoRoot) {
  const dirs = [REPO_SKILLS_DIR]

  const visit = (relative) => {
    const absolute = path.join(repoRoot, relative)

    if (!fs.existsSync(absolute)) return

    const entries = fs
      .readdirSync(absolute, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const { name } of entries) {
      const child = `${relative}/${name}`

      if (name === '.claude') {
        const skills = `${child}/skills`

        if (fs.existsSync(path.join(repoRoot, skills))) dirs.push(skills)
      } else if (!name.startsWith('.') && !SKIPPED_DIRS.has(name)) {
        visit(child)
      }
    }
  }

  visit(PACKAGES_DIR)

  return dirs
}

/**
 * The path of a skill's `SKILL.md`, relative to the repository root. A plugin
 * skill needs the plugin that ships it; without one the plugin segment is `*`,
 * which is what a lookup that found nothing reports.
 */
export function skillPath(name, source = DEFAULT_SOURCE, plugin = null) {
  if (sourceOf(source) === 'repo') return `${REPO_SKILLS_DIR}/${name}/SKILL.md`

  return `${PLUGINS_DIR}/${plugin ?? '*'}/skills/${name}/SKILL.md`
}

/**
 * Finds a skill: a repo skill in the root `.claude/skills` or a package's
 * `.claude/skills`, a plugin skill in whichever plugin of the marketplace
 * ships it. Returns its path relative to the repository root and its plugin
 * (`null` for a repo skill), or `null` when the skill does not exist.
 */
export function locateSkill(repoRoot, name, source = DEFAULT_SOURCE) {
  if (sourceOf(source) === 'repo') {
    const root = skillPath(name, source)

    if (fs.existsSync(path.join(repoRoot, root))) {
      return { file: root, plugin: null }
    }

    for (const dir of repoSkillDirs(repoRoot)) {
      const file = `${dir}/${name}/SKILL.md`

      if (fs.existsSync(path.join(repoRoot, file)))
        return { file, plugin: null }
    }

    return null
  }

  for (const plugin of pluginNames(repoRoot)) {
    const file = skillPath(name, source, plugin)

    if (fs.existsSync(path.join(repoRoot, file))) return { file, plugin }
  }

  return null
}

/** How a reader invokes the skill: `/smart-core:audit-log` or `/plan`. */
export function skillInvocation(name, plugin = null) {
  return `/${plugin ? `${plugin}:` : ''}${name}`
}

/** `allowed-tools` is written either as a YAML list or as one comma separated string. */
function parseAllowedTools(value) {
  if (Array.isArray(value)) {
    return value.map((tool) => String(tool).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tool) => tool.trim())
      .filter(Boolean)
  }

  return []
}

/**
 * Reads the frontmatter of one `SKILL.md`. Throws when the skill is unknown or
 * its frontmatter lacks the fields the header is built from.
 */
export function readSkillMeta({ repoRoot, name, source = DEFAULT_SOURCE }) {
  sourceOf(source)

  const located = locateSkill(repoRoot, name, source)

  if (!located) {
    throw skillError(
      `skill "${name}" does not exist (looked for ${skillPath(name, source)} in ${repoRoot})`,
    )
  }

  const { file: relativePath, plugin } = located
  const file = path.resolve(repoRoot, relativePath)
  const { data } = parseFrontmatter(fs.readFileSync(file, 'utf8'))

  for (const field of ['name', 'description']) {
    if (!data[field]) {
      throw skillError(`skill "${name}": ${relativePath} has no "${field}"`)
    }
  }

  return {
    name: data.name,
    source,
    plugin,
    description: String(data.description).trim(),
    userInvocable: data['user-invocable'] === true,
    allowedTools: parseAllowedTools(data['allowed-tools']),
    file,
    relativePath,
  }
}

/** Reads `name` and `source` out of a single `{% skill … /%}` tag. */
export function parseSkillTag(tagSource) {
  const attributes = {}
  for (const [, key, double, single] of tagSource.matchAll(ATTRIBUTE)) {
    attributes[key] = double ?? single
  }

  const tag = tagSource.trim()
  const { name, source = DEFAULT_SOURCE } = attributes

  if (!name) {
    throw skillError(`${tag} has no "name" attribute`)
  }

  sourceOf(source, tag)

  return { name, source }
}

/** A `|` would end the table cell it sits in, so it has to be escaped. */
function escapePipes(text) {
  return text.replace(/\|/g, '\\|')
}

/** The callout and invocation table introducing a skill page. */
export function renderSkillHeader(meta) {
  const { name, source, plugin, description, allowedTools, relativePath } = meta
  const invocation = skillInvocation(name, plugin)
  const tools =
    allowedTools.length > 0
      ? allowedTools.map((tool) => `\`${tool}\``).join(', ')
      : NO_TOOLS
  const link = `[\`SKILL.md\`](${REPO_URL}/${relativePath ?? skillPath(name, source, plugin)})`

  return [
    `{% callout title="${invocation}" %}`,
    escapePipes(description),
    '{% /callout %}',
    '',
    '| Invocation | Allowed tools | Source |',
    '| --- | --- | --- |',
    `| \`${invocation}\` | ${tools} | ${link} |`,
  ].join('\n')
}

/**
 * Replaces every `{% skill … /%}` line of `markdown` with the header of that
 * skill. Everything else is returned untouched, including a tag inside a
 * fenced code block: that one is a quoted example of the syntax, not an
 * instruction. `onDependency` is called once per `SKILL.md` so that the loader
 * rebuilds the page when the skill changes.
 */
export function expandSkillTags(markdown, { repoRoot, onDependency } = {}) {
  const announced = new Set()
  const fenced = insideFence(markdown)

  return markdown.replace(SKILL_TAG, (tag, rawAttributes, offset) => {
    if (fenced(offset)) {
      return tag
    }

    const { name, source } = parseSkillTag(tag)
    const meta = readSkillMeta({ repoRoot, name, source })

    if (!announced.has(meta.file)) {
      announced.add(meta.file)
      onDependency?.(meta.file)
    }

    return renderSkillHeader(meta)
  })
}
