import * as path from 'node:path'
import * as url from 'node:url'

import { expandSkillTags } from '../../tools/skills.mjs'
import { expandSnippets } from '../../tools/snippets.mjs'
import { expandStoryTemplates } from '../../tools/templates.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..', '..')
const repoRoot = path.resolve(siteRoot, '..', '..')
const examplesRoot = path.join(repoRoot, 'docs', 'examples')

/**
 * Webpack loader expanding the build time tags of a `page.md`: `{% snippet … /%}`
 * becomes a fenced code block, `{% skill … /%}` the header of that skill and
 * `{% story-template … /%}` the markup a Storybook story renders. It runs with
 * `enforce: 'pre'`, i.e. before the Markdoc loader, so Markdoc only ever sees
 * plain markdown and its own tags.
 *
 * Errors are intentionally not caught: a snippet pointing at a file or region
 * that no longer exists, a tag naming an unknown skill, or a story template
 * that no longer resolves, must break the build.
 */
export default function snippetLoader(source) {
  const onDependency = (file) => this.addDependency(file)

  const withSnippets = expandSnippets(source, {
    pagePath: this.resourcePath,
    examplesRoot,
    repoRoot,
    onDependency,
  })
  const withSkills = expandSkillTags(withSnippets, { repoRoot, onDependency })

  return expandStoryTemplates(withSkills, { repoRoot, onDependency })
}
