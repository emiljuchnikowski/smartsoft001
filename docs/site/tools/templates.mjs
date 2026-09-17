import * as fs from 'node:fs'

import { insideFence } from './fences.mjs'
import { extractRegion, resolveSnippetPath } from './snippets.mjs'

/**
 * Story templates as pasteable HTML: instead of a hand-written ```html block,
 * a component page writes
 *
 *   {% story-template file="packages/…/button.component.stories.ts" /%}
 *
 * and this module cuts the Angular `template:` literal out of that story's
 * `usage` region, inlines the constants it interpolates and inlines the result
 * as a fenced block before Markdoc ever sees the page. The published markup is
 * therefore the markup Storybook renders, and cannot drift from it.
 *
 * Used by the webpack loader (src/markdoc/snippet-loader.mjs) and by the
 * search indexer, which reads the same pages straight from disk.
 */

// A tag has to own its line: the expansion is a block, so a tag inside a
// sentence stays verbatim, exactly like a tag quoted in a fenced code block.
const STORY_TEMPLATE_TAG =
  /^[ \t]*\{%\s*story-template\b([^\n]*?)\/%\}[ \t]*$/gm
const ATTRIBUTE = /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

const DEFAULT_REGION = 'usage'

function templateError(message) {
  return new Error(`[story-template] ${message}`)
}

const TEMPLATE_PROPERTY = /(?<![\w$])template\s*:\s*`/

// `const NAME =`, `export const NAME: Type =`, at any indentation.
const DECLARATION =
  /(?:^|[\n;])[ \t]*(?:export[ \t]+)?const[ \t]+([A-Za-z_$][\w$]*)[ \t]*(?::[^=\n]*)?=[ \t]*\n?[ \t]*/g

function dedent(lines) {
  const indents = lines
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(/^[ \t]*/)[0].length)
  const common = indents.length > 0 ? Math.min(...indents) : 0

  return lines.map((line) => line.slice(common))
}

function trimBlankLines(lines) {
  const trimmed = [...lines]
  while (trimmed.length > 0 && trimmed[0].trim() === '') {
    trimmed.shift()
  }
  while (trimmed.length > 0 && trimmed.at(-1).trim() === '') {
    trimmed.pop()
  }
  return trimmed
}

function normalize(text) {
  return dedent(trimBlankLines(text.split('\n'))).join('\n')
}

/**
 * A template literal escapes the three characters that would end it or open an
 * interpolation. Every other backslash belongs to the markup and stays.
 */
function unescapeLiteral(value) {
  return value.replace(/\\([`$\\])/g, '$1')
}

/** The contents of the template literal opened at `start`, or null. */
function readLiteral(source, start) {
  let index = start + 1

  while (index < source.length) {
    const character = source[index]

    if (character === '\\') {
      index += 2
      continue
    }
    if (character === '`') {
      return { value: source.slice(start + 1, index), end: index }
    }
    if (character === '$' && source[index + 1] === '{') {
      index = endOfInterpolation(source, index)
      continue
    }
    index += 1
  }

  return null
}

/** The contents of the quoted string opened at `start`, or null. */
function readQuoted(source, start) {
  const quote = source[start]
  let index = start + 1
  let value = ''

  while (index < source.length) {
    const character = source[index]

    if (character === '\\') {
      value += source[index + 1]
      index += 2
      continue
    }
    if (character === quote) {
      return { value, end: index }
    }
    if (character === '\n') {
      return null
    }
    value += character
    index += 1
  }

  return null
}

/** The index just after the `}` closing the `${` opened at `start`. */
function endOfInterpolation(source, start) {
  let index = start + 2
  let depth = 1

  while (index < source.length) {
    const character = source[index]

    if (character === '\\') {
      index += 2
      continue
    }
    if (character === '`') {
      const literal = readLiteral(source, index)
      index = literal ? literal.end + 1 : source.length
      continue
    }
    if (character === "'" || character === '"') {
      const quoted = readQuoted(source, index)
      index = quoted ? quoted.end + 1 : index + 1
      continue
    }
    if (character === '{') {
      depth += 1
    } else if (character === '}') {
      depth -= 1
      if (depth === 0) {
        return index + 1
      }
    }
    index += 1
  }

  return source.length
}

/** Every `${…}` of `text`, in order, with its bounds and inner expression. */
function interpolations(text) {
  const found = []

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '\\') {
      index += 1
      continue
    }
    if (text[index] === '$' && text[index + 1] === '{') {
      const end = endOfInterpolation(text, index)
      found.push({
        start: index,
        end,
        expression: text.slice(index + 2, end - 1).trim(),
      })
      index = end - 1
    }
  }

  return found
}

/**
 * `['a', 'b'].join(' ')` as the string it produces, or null when the array
 * holds anything but plain strings.
 */
function readJoinedArray(source, start) {
  const items = []
  let index = start + 1

  while (index < source.length) {
    const character = source[index]

    if (character === ']') {
      const join = source
        .slice(index + 1)
        .match(/^\s*\.join\(\s*(?:'([^']*)'|"([^"]*)")?\s*\)/)
      if (!join) {
        return null
      }
      return { value: items.join(join[1] ?? join[2] ?? ',') }
    }
    if (character === "'" || character === '"') {
      const quoted = readQuoted(source, index)
      if (!quoted) {
        return null
      }
      items.push(quoted.value)
      index = quoted.end + 1
      continue
    }
    if (!/[\s,]/.test(character)) {
      return null
    }
    index += 1
  }

  return null
}

/**
 * The module-level string constants of `source`, by name. Values are returned
 * as declared: a value that interpolates another constant keeps its `${…}`.
 */
export function resolveConstants(source) {
  const constants = new Map()

  for (const match of source.matchAll(DECLARATION)) {
    const start = match.index + match[0].length
    const character = source[start]

    if (character === "'" || character === '"') {
      const quoted = readQuoted(source, start)
      if (quoted) {
        constants.set(match[1], quoted.value)
      }
      continue
    }
    if (character === '`') {
      const literal = readLiteral(source, start)
      if (literal) {
        constants.set(match[1], literal.value)
      }
      continue
    }
    if (character === '[') {
      const joined = readJoinedArray(source, start)
      if (joined) {
        constants.set(match[1], joined.value)
      }
    }
  }

  return constants
}

/** The whitespace `start` sits behind on its line, or null when code precedes it. */
function indentOf(text, start) {
  const prefix = text.slice(text.lastIndexOf('\n', start - 1) + 1, start)

  return /^[ \t]*$/.test(prefix) ? prefix : null
}

/** A block pasted at an indented placeholder keeps its shape under it. */
function reindent(value, indent) {
  return value
    .split('\n')
    .map((line, position) => (position === 0 ? line : indent + line))
    .join('\n')
}

/**
 * Replaces every `${NAME}` of `text` that names a known constant. A constant
 * whose own value interpolates further constants is expanded too; `seen`
 * stops a cycle, leaving the `${…}` in place for the caller to report.
 */
function substitute(text, constants, seen = new Set()) {
  let result = ''
  let cursor = 0

  for (const { start, end, expression } of interpolations(text)) {
    if (!constants.has(expression) || seen.has(expression)) {
      continue
    }

    const value = substitute(
      constants.get(expression),
      constants,
      new Set(seen).add(expression),
    )
    const indent = indentOf(text, start)

    result +=
      text.slice(cursor, start) +
      (indent === null ? value : reindent(normalize(value), indent))
    cursor = end
  }

  return result + text.slice(cursor)
}

/**
 * The first `template:` literal of `region`, as HTML: dedented, with the
 * module-level constants it interpolates inlined.
 *
 * Returns `{ html, unresolved }`, where `unresolved` lists the expressions
 * (without their `${}`) that no constant could stand in for — a function call,
 * an `.map()` over story data — so a caller can decide whether the markup is
 * fit to publish. Returns null when the region or its template is missing.
 */
export function extractTemplate(source, { region = 'usage' } = {}) {
  let body
  try {
    body = extractRegion(source, region)
  } catch {
    // The only failure of extractRegion is a region the story does not have.
    return null
  }

  const match = body.match(TEMPLATE_PROPERTY)
  if (!match) {
    return null
  }

  const literal = readLiteral(body, match.index + match[0].length - 1)
  if (!literal) {
    return null
  }

  const resolved = substitute(
    normalize(literal.value),
    resolveConstants(source),
  )
  const unresolved = [
    ...new Set(interpolations(resolved).map(({ expression }) => expression)),
  ]

  return { html: unescapeLiteral(resolved), unresolved }
}

/** Reads `file` and `region` out of a single `{% story-template … /%}` tag. */
export function parseStoryTemplateTag(tagSource) {
  const attributes = {}
  for (const [, key, double, single] of tagSource.matchAll(ATTRIBUTE)) {
    attributes[key] = double ?? single
  }

  const { file, region = DEFAULT_REGION } = attributes

  if (!file) {
    throw templateError(`${tagSource.trim()} has no "file" attribute`)
  }

  return { file, region }
}

/**
 * A story is a library file, so it resolves against the repository root and,
 * like a snippet, may not reach outside of it.
 */
function storyPath(file, repoRoot) {
  try {
    return resolveSnippetPath(file, { examplesRoot: repoRoot, repoRoot })
  } catch (error) {
    throw templateError(error.message.replace(/^\[snippet\] /, ''))
  }
}

/** The html of one tag, or an error explaining why the story yields none. */
function htmlFor(file, region, repoRoot) {
  const absolutePath = storyPath(file, repoRoot)

  if (!fs.existsSync(absolutePath)) {
    throw templateError(
      `file "${file}" does not exist (looked in ${absolutePath})`,
    )
  }

  const extracted = extractTemplate(fs.readFileSync(absolutePath, 'utf8'), {
    region,
  })

  if (!extracted) {
    throw templateError(
      `"${file}" has no "${region}" region with a template literal`,
    )
  }

  if (extracted.unresolved.length > 0) {
    const leftovers = extracted.unresolved
      .map((expression) => `\${${expression}}`)
      .join(', ')

    throw templateError(
      `the "${region}" template of "${file}" interpolates ${leftovers}, which is not a module-level string constant`,
    )
  }

  return { html: extracted.html, absolutePath }
}

/**
 * Replaces every `{% story-template … /%}` line of `markdown` with the story's
 * template as an html code block. Everything else is returned untouched,
 * including a tag inside a fenced code block: that one is a quoted example of
 * the syntax, not an instruction. `onDependency` is called once per story so
 * that the loader rebuilds the page when the story changes.
 */
export function expandStoryTemplates(
  markdown,
  { repoRoot, onDependency } = {},
) {
  const announced = new Set()
  const fenced = insideFence(markdown)

  return markdown.replace(STORY_TEMPLATE_TAG, (tag, rawAttributes, offset) => {
    if (fenced(offset)) {
      return tag
    }

    const { file, region } = parseStoryTemplateTag(tag)
    const { html, absolutePath } = htmlFor(file, region, repoRoot)

    if (!announced.has(absolutePath)) {
      announced.add(absolutePath)
      onDependency?.(absolutePath)
    }

    return `\`\`\`html\n${html}\n\`\`\``
  })
}
