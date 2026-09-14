import * as path from 'node:path'
import * as url from 'node:url'

import { expandSnippets } from '../../tools/snippets.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..', '..')
const repoRoot = path.resolve(siteRoot, '..', '..')
const examplesRoot = path.join(repoRoot, 'docs', 'examples')

/**
 * Webpack loader expanding `{% snippet … /%}` tags of a `page.md` into fenced
 * code blocks. It runs with `enforce: 'pre'`, i.e. before the Markdoc loader,
 * so Markdoc only ever sees plain markdown.
 *
 * Errors are intentionally not caught: a snippet pointing at a file or region
 * that no longer exists must break the build.
 */
export default function snippetLoader(source) {
  return expandSnippets(source, {
    pagePath: this.resourcePath,
    examplesRoot,
    repoRoot,
    onDependency: (file) => this.addDependency(file),
  })
}
