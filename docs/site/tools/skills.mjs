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

const SOURCES = {
  plugin: {
    dir: 'packages/shared/claude-plugins/src/plugins/smart/skills',
    prefix: 'smart:',
  },
  repo: {
    dir: '.claude/skills',
    prefix: '',
  },
}

const DEFAULT_SOURCE = 'plugin'
const NO_TOOLS = '—'

function skillError(message) {
  return new Error(`[skill] ${message}`)
}

function sourceOf(source, tag) {
  const known = SOURCES[source]

  if (!known) {
    const expected = Object.keys(SOURCES)
      .map((name) => `"${name}"`)
      .join(', ')

    throw skillError(
      `${tag ? `${tag}: ` : ''}unknown source "${source}", expected one of ${expected}`,
    )
  }

  return known
}

/** The path of a skill's `SKILL.md`, relative to the repository root. */
export function skillPath(name, source = DEFAULT_SOURCE) {
  return `${sourceOf(source).dir}/${name}/SKILL.md`
}

/** How a reader invokes the skill: `/smart:audit-log` or `/plan`. */
export function skillInvocation(name, source = DEFAULT_SOURCE) {
  return `/${sourceOf(source).prefix}${name}`
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

  const relativePath = skillPath(name, source)
  const file = path.resolve(repoRoot, relativePath)

  if (!fs.existsSync(file)) {
    throw skillError(
      `skill "${name}" does not exist (looked for ${relativePath} in ${repoRoot})`,
    )
  }

  const { data } = parseFrontmatter(fs.readFileSync(file, 'utf8'))

  for (const field of ['name', 'description']) {
    if (!data[field]) {
      throw skillError(`skill "${name}": ${relativePath} has no "${field}"`)
    }
  }

  return {
    name: data.name,
    source,
    description: String(data.description).trim(),
    userInvocable: data['user-invocable'] === true,
    allowedTools: parseAllowedTools(data['allowed-tools']),
    file,
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
  const { name, source, description, allowedTools } = meta
  const invocation = skillInvocation(name, source)
  const tools =
    allowedTools.length > 0
      ? allowedTools.map((tool) => `\`${tool}\``).join(', ')
      : NO_TOOLS
  const link = `[\`SKILL.md\`](${REPO_URL}/${skillPath(name, source)})`

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
