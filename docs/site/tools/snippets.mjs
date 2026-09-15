import * as fs from 'node:fs'
import * as path from 'node:path'

import { insideFence } from './fences.mjs'

/**
 * Executable snippets: instead of copying code into the docs, a page.md writes
 *
 *   {% snippet file="crud/basic-entity.ts" region="entity" /%}
 *
 * and this module inlines the real file (or one `#region` of it) as a fenced
 * code block before Markdoc ever sees the page. Examples therefore live in
 * compiled, linted sources and can never drift from the documentation.
 *
 * Used by the webpack loader (src/markdoc/snippet-loader.mjs) and by the
 * search indexer, which reads the same files straight from disk.
 */

const SNIPPET_TAG = /\{%\s*snippet\b([\s\S]*?)\/%\}/g
const ATTRIBUTE = /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

// `// #region name`, `/* #region name */`, `<!-- #region name -->` or, for
// shell, YAML and other `#` comment languages, `# #region name`.
const REGION_START =
  /^\s*(?:\/\/|\/\*|<!--|#)\s*#region\s+(.*?)\s*(?:-->|\*\/)?\s*$/
const REGION_END = /^\s*(?:\/\/|\/\*|<!--|#)\s*#endregion\b/

const LANGUAGES = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  mjs: 'js',
  cjs: 'js',
  html: 'html',
  scss: 'scss',
  css: 'css',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
  md: 'md',
  yml: 'yaml',
  yaml: 'yaml',
}

const REGION_NOT_FOUND = 'SNIPPET_REGION_NOT_FOUND'

function snippetError(message) {
  return new Error(`[snippet] ${message}`)
}

function parseAttributes(source) {
  const attributes = {}
  for (const [, name, double, single] of source.matchAll(ATTRIBUTE)) {
    attributes[name] = double ?? single
  }
  return attributes
}

function isInside(root, target) {
  const relative = path.relative(root, target)
  return (
    relative.length > 0 &&
    !relative.startsWith('..') &&
    !path.isAbsolute(relative)
  )
}

/**
 * `packages/…` refers to the published libraries, anything else to a file of
 * the `docs/examples` workspace. Both are sandboxes: a snippet may not reach
 * outside of the root it was resolved against.
 */
export function resolveSnippetPath(file, { examplesRoot, repoRoot }) {
  const root = file.startsWith('packages/') ? repoRoot : examplesRoot
  const absolutePath = path.resolve(root, file)

  if (!isInside(root, absolutePath)) {
    throw snippetError(`file "${file}" resolves outside of "${root}"`)
  }

  return absolutePath
}

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

/**
 * Returns the body of `region`, or the whole content when `region` is
 * undefined. Marker lines are always dropped, including the markers of nested
 * regions, and the result is dedented by its common indentation.
 */
export function extractRegion(content, region) {
  const stack = []
  const collected = []
  let depth = -1
  let found = false

  for (const line of content.split('\n')) {
    const start = line.match(REGION_START)
    if (start) {
      stack.push(start[1])
      if (region !== undefined && !found && start[1] === region) {
        depth = stack.length
        found = true
      }
      continue
    }

    if (REGION_END.test(line)) {
      stack.pop()
      // `#endregion` closes the innermost open region.
      if (depth !== -1 && stack.length < depth) {
        depth = -1
      }
      continue
    }

    if (region === undefined || depth !== -1) {
      collected.push(line)
    }
  }

  if (region !== undefined && !found) {
    const error = snippetError(`region "${region}" not found`)
    error.code = REGION_NOT_FOUND
    throw error
  }

  return dedent(trimBlankLines(collected)).join('\n')
}

/** The fence language: `lang` wins, otherwise the file extension decides. */
export function languageFor(file, lang) {
  if (lang) {
    return lang
  }

  const extension = path.extname(file).slice(1).toLowerCase()

  return LANGUAGES[extension] ?? 'text'
}

/**
 * Replaces every `{% snippet … /%}` tag of `source` with a fenced code block.
 * Everything else is returned untouched, including a tag inside a fenced code
 * block: that one is a quoted example of the syntax, not an instruction.
 * `onDependency` is called once per referenced file so that the loader can
 * watch it in dev mode.
 */
export function expandSnippets(
  source,
  { pagePath, examplesRoot, repoRoot, onDependency } = {},
) {
  const announced = new Set()
  const fenced = insideFence(source)

  return source.replace(SNIPPET_TAG, (tag, rawAttributes, offset) => {
    if (fenced(offset)) {
      return tag
    }

    const { file, region, lang } = parseAttributes(rawAttributes)

    if (!file) {
      throw snippetError(`${pagePath}: ${tag.trim()} has no "file" attribute`)
    }

    const absolutePath = resolveSnippetPath(file, { examplesRoot, repoRoot })

    if (!announced.has(absolutePath)) {
      announced.add(absolutePath)
      onDependency?.(absolutePath)
    }

    if (!fs.existsSync(absolutePath)) {
      throw snippetError(
        `${pagePath}: file "${file}" does not exist (looked in ${absolutePath})`,
      )
    }

    const content = fs.readFileSync(absolutePath, 'utf8')

    let code
    try {
      code = extractRegion(content, region)
    } catch (error) {
      if (error.code === REGION_NOT_FOUND) {
        throw snippetError(
          `${pagePath}: region "${region}" not found in "${file}" (${absolutePath})`,
        )
      }
      throw error
    }

    return `\`\`\`${languageFor(file, lang)}\n${code}\n\`\`\``
  })
}
