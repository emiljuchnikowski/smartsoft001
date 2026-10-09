/**
 * Builds one documentation page per `smart-*` component out of the material
 * the workspace already keeps: the component skill Claude Code reads, the
 * Storybook story the component ships and, when it exists, a compiled example
 * of extending its base class.
 *
 * Every component exists in `@smartsoft001/angular` and `@smartsoft001/react`.
 * A page carries one variant per framework, each in a `{% framework %}`
 * block built from that framework's skill, examples and Storybook; the reader
 * picks one with the switch under the title.
 *
 * Skills are written for an agent, not for a reader: they repeat the code the
 * documentation embeds through `{% snippet %}` tags and carry sections ("When
 * to Use This Skill", "File Locations") that only make sense to Claude. The
 * transformation here keeps the prose and the API tables, drops the rest and
 * inserts the executed usage example plus the live story in their place.
 *
 * Pure functions only: the CLI in `generate-components.mjs` owns the writes.
 */
import fs from 'node:fs'
import path from 'node:path'

import yaml from 'js-yaml'

import {
  componentInventory,
  metaTitle,
  sanitize,
  startCase,
} from './check-rules.mjs'
import { parseFrontmatter } from './navigation.mjs'
import { PLUGINS_DIR } from './skills.mjs'

const REPO_URL = 'https://github.com/emiljuchnikowski/smartsoft001/tree/main'
const CONTENT_DIR = 'docs/site/content/components'
const EXAMPLES_DIR = 'docs/examples'
const USAGE_REGION = 'usage'

/**
 * Where each framework keeps what its variant of a component page is built
 * from: the library, the component skills of its plugin, the Storybook
 * project and the executed examples under `docs/examples`.
 */
export const FRAMEWORK_SOURCES = {
  angular: {
    packageName: '@smartsoft001/angular',
    componentsDir: 'packages/shared/angular/src/lib/components',
    skillsDir: `${PLUGINS_DIR}/smart-angular/skills`,
    skillPrefix: 'angular-components-',
    plugin: 'smart-angular',
    agentPage: '/docs/skills/angular-components-agent',
    storyProject: 'angular',
    storyExtension: '.stories.ts',
    examplesDir: 'angular/src/components',
  },
  react: {
    packageName: '@smartsoft001/react',
    componentsDir: 'packages/shared/react/src/lib/components',
    skillsDir: `${PLUGINS_DIR}/smart-react/skills`,
    skillPrefix: 'react-components-',
    plugin: 'smart-react',
    agentPage: '/docs/skills/react-components-agent',
    storyProject: 'react',
    storyExtension: '.stories.tsx',
    examplesDir: 'react/src/components',
  },
}

const ANGULAR = FRAMEWORK_SOURCES.angular
const SKILL_PREFIX = ANGULAR.skillPrefix

/**
 * Component name to the Nx generator that scaffolds a usage of it. Empty while
 * the workspace ships no generator collection; adding an entry here makes the
 * generator tab appear on that component's page.
 */
const GENERATORS = new Map()

/** Sections written for Claude Code, dropped from the published page. */
const DROPPED_SECTIONS = new Set([
  'when to use this skill',
  'file locations',
  'usage examples',
])

/**
 * The React skills keep their examples under `## Usage`, prose included; the
 * executed example and the story of the generated usage block replace it.
 */
const REACT_DROPPED_SECTIONS = new Set([...DROPPED_SECTIONS, 'usage'])

/** Components whose story needs more room than the default frame. */
export const TALL_STORIES = new Set([
  'page',
  'sidebar-layout',
  'stacked-layout',
  'multi-column-layout',
  'form',
  'list',
  'table',
  'details',
  'sidebar-navigation',
  'vertical-navigation',
  'command-palette',
  'calendar',
])

const DEFAULT_STORY_HEIGHT = 320
const TALL_STORY_HEIGHT = 560

const FENCE = /^\s*(`{3,}|~{3,})\s*([\w-]*)/
const HEADING = /^(#{1,6})\s+(.*)$/
const EXTENDING = /^extending\b/
const REPLACING = /^replacing the implementation$/

/** `# AccordionBaseComponent (Base Only)` -> `AccordionBaseComponent`. */
const TRAILING_PARENTHETICAL = /\s*\([^()]*\)\s*$/

/** `Button Component`, `Card Base Component`, `AccordionBaseComponent`. */
const TITLE_SUFFIX = /\s*(?:Base\s?Component|\s+Component)$/

const EXTENDING_HEADING = 'Extending the base class'

/**
 * Splits a markdown body into headings, fenced code blocks and plain lines.
 * Everything downstream works on these tokens, so a `#` inside a fence is
 * never mistaken for a heading.
 */
function tokenize(body) {
  const lines = body.split('\n')
  const tokens = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const fence = FENCE.exec(line)

    if (fence) {
      const [, marker, language] = fence
      const block = [line]

      index += 1

      while (index < lines.length) {
        const current = lines[index]
        const close = FENCE.exec(current)

        block.push(current)
        index += 1

        if (
          close &&
          close[1][0] === marker[0] &&
          close[1].length >= marker.length &&
          !close[2]
        ) {
          break
        }
      }

      tokens.push({ type: 'fence', language, lines: block })
      continue
    }

    const heading = HEADING.exec(line)

    if (heading) {
      tokens.push({
        type: 'heading',
        level: heading[1].length,
        text: heading[2].trim(),
      })
    } else {
      tokens.push({ type: 'line', text: line })
    }

    index += 1
  }

  return tokens
}

/**
 * The page title: the H1 without the class name decoration a skill carries,
 * so `# AccordionBaseComponent (Base Only)` becomes `Accordion`. Without an
 * H1 the start cased directory name has to do.
 */
export function deriveTitle(body, name) {
  const h1 = tokenize(body).find(
    (token) => token.type === 'heading' && token.level === 1,
  )

  if (!h1) return startCase(name)

  return h1.text
    .replace(TRAILING_PARENTHETICAL, '')
    .replace(TITLE_SUFFIX, '')
    .trim()
}

/** The tokens of the intro (after the H1, before the first `##`) and the rest. */
function splitIntro(tokens) {
  const h1 = tokens.findIndex(
    (token) => token.type === 'heading' && token.level === 1,
  )
  const start = h1 === -1 ? 0 : h1 + 1
  const offset = tokens
    .slice(start)
    .findIndex((token) => token.type === 'heading' && token.level >= 2)
  const end = offset === -1 ? tokens.length : start + offset

  return { intro: tokens.slice(start, end), rest: tokens.slice(end) }
}

/** Groups the tokens after the intro into one entry per top level section. */
function splitSections(tokens) {
  const sections = []

  for (const token of tokens) {
    if (token.type === 'heading' && token.level === 2) {
      sections.push({ heading: token, tokens: [] })
    } else if (sections.length) {
      sections[sections.length - 1].tokens.push(token)
    }
  }

  return sections
}

function onlyFences(section) {
  return section.tokens.every(
    (token) =>
      token.type === 'fence' || (token.type === 'line' && !token.text.trim()),
  )
}

/**
 * Applies the section rules: agent-only sections go and a `## Usage` that
 * holds nothing but code goes, because the generated usage block replaces it.
 */
function keepSections(sections, dropped = DROPPED_SECTIONS) {
  return sections.filter((section) => {
    const key = section.heading.text.toLowerCase()

    if (dropped.has(key)) return false

    return !(key === 'usage' && onlyFences(section))
  })
}

/** The end of the section a heading opens: the next heading as high, or up. */
function sectionEnd(tokens, start) {
  const { level } = tokens[start]
  const offset = tokens
    .slice(start + 1)
    .findIndex((token) => token.type === 'heading' && token.level <= level)

  return offset === -1 ? tokens.length : start + 1 + offset
}

/**
 * Rewrites every "Extending the Base Class" section, whichever level it sits
 * at: skills write it as `## Extending the Base Class` and, where it hangs
 * off a base class section, as `### Extending`. The prose repeats a code
 * sample, so the section is worth keeping only when a compiled example exists
 * to put in its place; otherwise it goes.
 */
function replaceExtending(tokens, example) {
  const result = []
  let index = 0

  while (index < tokens.length) {
    const token = tokens[index]
    const isExtending =
      token.type === 'heading' &&
      token.level >= 2 &&
      EXTENDING.test(token.text.toLowerCase())

    if (!isExtending) {
      result.push(token)
      index += 1
      continue
    }

    if (example) {
      result.push(
        { type: 'heading', level: token.level, text: EXTENDING_HEADING },
        { type: 'line', text: '' },
        {
          type: 'line',
          raw: true,
          text: `{% snippet file="${example}" region="${USAGE_REGION}" /%}`,
        },
        { type: 'line', text: '' },
      )
    }

    index = sectionEnd(tokens, index)
  }

  return result
}

/**
 * The React skills explain under `## Replacing the Implementation` how to
 * register a component of your own, and end that explanation with the full
 * custom component. The compiled example takes the place of that last code
 * block, so the prose and the hook tables around it stay; without an example
 * every block of the section goes, like everywhere else.
 */
function replaceReplacing(tokens, example) {
  if (!example) return tokens

  const start = tokens.findIndex(
    (token) =>
      token.type === 'heading' &&
      token.level === 2 &&
      REPLACING.test(token.text.toLowerCase()),
  )

  if (start === -1) return tokens

  const end = sectionEnd(tokens, start)
  let last = -1

  for (let index = start + 1; index < end; index += 1) {
    if (tokens[index].type === 'fence') last = index
  }

  if (last === -1) return tokens

  return [
    ...tokens.slice(0, last),
    {
      type: 'line',
      raw: true,
      text: `{% snippet file="${example}" region="${USAGE_REGION}" /%}`,
    },
    ...tokens.slice(last + 1),
  ]
}

/**
 * Removes every fenced code block, reporting each one with the heading it sat
 * under so the CLI can show what the page no longer says.
 */
function dropFences(tokens, component, fallbackSection, report) {
  let section = fallbackSection

  return tokens.filter((token) => {
    if (token.type === 'heading') {
      section = token.text
      return true
    }

    if (token.type !== 'fence') return true

    report.push({ component, section, language: token.language })

    return false
  })
}

/**
 * A sentence that introduced a dropped code block ("Register it under
 * `button`:") would end the paragraph on a colon. The React skills lead into
 * their code that way, so their variant ends such a sentence with a full stop.
 */
function endSentencesBeforeFences(tokens) {
  const result = tokens.map((token) => ({ ...token }))

  for (let index = 0; index < result.length; index += 1) {
    if (result[index].type !== 'fence') continue

    let previous = index - 1

    while (
      previous >= 0 &&
      result[previous].type === 'line' &&
      !result[previous].text.trim()
    ) {
      previous -= 1
    }

    const line = result[previous]

    if (line?.type !== 'line' || line.raw) continue

    line.text = line.text.replace(/:\s*$/, '.')
  }

  return result
}

/**
 * Removes the headings whose section holds nothing any more, which is what a
 * `### IButtonOptions` that only wrapped a code fence becomes. Walking
 * backwards prunes the sub headings first, so a section emptied by its own
 * sub headings goes as well.
 */
function pruneEmptyHeadings(tokens) {
  const keep = tokens.map(() => true)

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index]

    if (token.type !== 'heading') continue

    let hasContent = false

    for (let next = index + 1; next < tokens.length; next += 1) {
      const candidate = tokens[next]

      if (candidate.type === 'heading' && candidate.level <= token.level) break
      if (!keep[next]) continue

      if (candidate.type === 'heading' || candidate.text.trim()) {
        hasContent = true
        break
      }
    }

    keep[index] = hasContent
  }

  return tokens.filter((_, index) => keep[index])
}

/** Markdoc reads `{%` as the start of a tag, so skill prose has to escape it. */
function escapeMarkdoc(text) {
  return text.replace(/\{%/g, '\\{%')
}

/**
 * Renders the tokens back to markdown. Everything that came out of the skill
 * is escaped; the tags the generator injects are marked `raw` and pass
 * through, because they are the only Markdoc this page is meant to run.
 */
function renderTokens(tokens) {
  return tokens.map((token) => {
    if (token.type === 'heading') {
      return `${'#'.repeat(token.level)} ${escapeMarkdoc(token.text)}`
    }

    return token.raw ? token.text : escapeMarkdoc(token.text)
  })
}

/** Collapses the blank runs a dropped fence or section leaves behind. */
function tidy(lines) {
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '\n')
}

function frontmatter(data) {
  return `---\n${yaml.dump(data, { lineWidth: -1 })}---\n`
}

function storyHeight(name) {
  return TALL_STORIES.has(name) ? TALL_STORY_HEIGHT : DEFAULT_STORY_HEIGHT
}

/**
 * The same example in the shape each reader needs it: the markup to paste into
 * a template, the TypeScript behind it, and the way to ask Claude Code for it.
 *
 * The code tabs show what a consumer writes: the template and the component
 * class of a compiled, tested example in `docs/examples/angular`, with the
 * typed `options` and the output handlers. The story stays the source of the
 * live embed below the tabs; its `render`/`args` plumbing is Storybook's, not
 * the reader's, so it is only the fallback for a component that has no usage
 * example yet.
 *
 * A fourth tab, the Nx generator that scaffolds a usage of the component, is
 * part of this contract but stays out until such a generator exists: see
 * `generatorTab`.
 */
function usageBlock(name, story, usage, framework = 'angular') {
  if (framework === 'react') return reactUsageBlock(name, story, usage)

  const tabs = [
    {
      title: 'HTML',
      lines: [
        usage
          ? `{% snippet file="${usage.html}" region="${USAGE_REGION}" /%}`
          : `{% story-template file="${story.file}" region="${USAGE_REGION}" /%}`,
      ],
    },
    {
      title: 'TypeScript',
      lines: [
        `{% snippet file="${usage ? usage.ts : story.file}" region="${USAGE_REGION}" /%}`,
      ],
    },
    { title: 'Claude Code', lines: skillTabLines(name) },
  ]

  const generator = generatorTab(name)

  if (generator) tabs.splice(2, 0, generator)

  return renderUsage(name, story, tabs, ANGULAR)
}

/**
 * The React variant: the component a consumer writes, in one file, and the
 * way to ask Claude Code for it. Without an executed example the story's
 * `usage` region stands in, like the Angular fallback.
 */
function reactUsageBlock(name, story, usage) {
  const tabs = [
    {
      title: 'TSX',
      lines: [
        `{% snippet file="${usage ? usage.tsx : story.file}" region="${USAGE_REGION}" /%}`,
      ],
    },
    {
      title: 'Claude Code',
      lines: skillTabLines(name, FRAMEWORK_SOURCES.react),
    },
  ]

  return renderUsage(name, story, tabs, FRAMEWORK_SOURCES.react)
}

function renderUsage(name, story, tabs, sources) {
  return [
    '## Usage',
    '',
    '{% tabs %}',
    ...tabs.flatMap(({ title, lines }) => [
      '',
      `{% tab title="${title}" %}`,
      '',
      ...lines,
      '',
      '{% /tab %}',
    ]),
    '',
    '{% /tabs %}',
    '',
    `{% storybook project="${sources.storyProject}" story="${story.id}" height=${storyHeight(name)} /%}`,
    '',
  ]
}

/**
 * How to get the component out of Claude Code. The per-component skills are
 * background knowledge rather than commands (`user-invocable: false`), so what
 * a developer types is a request to the agent, not a slash command.
 */
function skillTabLines(name, sources = ANGULAR) {
  return [
    `With the [\`${sources.plugin}@smartsoft\` plugin](/docs/skills/installing-the-plugin) installed, ask for the component and Claude Code reads the \`${sources.skillPrefix}${name}\` skill through its [components agent](${sources.agentPage}):`,
    '',
    '```text',
    `Add a ${name} to the settings page, using ${sources.packageName}.`,
    '```',
    '',
    'The skill carries the same API this page documents, so the generated code matches it.',
  ]
}

/**
 * The Nx generator tab, once the workspace ships a generator collection. It is
 * resolved per component so the tab appears on the pages that have one and
 * nowhere else; today no collection exists, so this returns null everywhere.
 */
function generatorTab(name) {
  const generator = GENERATORS.get(name)

  if (!generator) return null

  return {
    title: 'Nx generator',
    lines: ['```bash', `npx nx generate ${generator} --name=my-${name}`, '```'],
  }
}

function sourceBlock(name, sources = ANGULAR) {
  const library = `${sources.componentsDir}/${name}`
  const skill = `${sources.skillPrefix}${name}`

  return [
    '## Source',
    '',
    `The component lives in [\`${library}\`](${REPO_URL}/${library}) and is ` +
      `documented for Claude Code by the [\`${skill}\`](${REPO_URL}/${sources.skillsDir}/${skill}) skill.`,
    '',
  ]
}

/** The intro, with the first paragraph marked as the page lead. */
function renderIntro(intro) {
  const body = tidy(renderTokens(intro)).split('\n')
  const last = body.findIndex((line, index) => index > 0 && !line.trim())
  const end = last === -1 ? body.length - 1 : last - 1

  if (body[end]?.trim()) body[end] = `${body[end]} {% .lead %}`

  return body
}

/**
 * The body of one framework's variant of a component page, out of that
 * framework's skill: the intro as the lead, the usage block, the sections a
 * reader needs and the source links.
 */
function renderVariant(framework, { name, source, story, usage, example }) {
  const sources = FRAMEWORK_SOURCES[framework]
  const { data, body } = parseFrontmatter(source)
  const title = deriveTitle(body, name)
  const component = framework === 'angular' ? name : `${name} (${framework})`
  const report = []
  const tokens = tokenize(body)
  const { intro, rest } = splitIntro(tokens)
  const sections =
    framework === 'angular'
      ? keepSections(splitSections(replaceExtending(rest, example)))
      : keepSections(
          splitSections(
            endSentencesBeforeFences(replaceReplacing(rest, example)),
          ),
          REACT_DROPPED_SECTIONS,
        )
  const lines = [
    ...renderIntro(dropFences(intro, component, title, report)),
    '',
    '---',
    '',
  ]

  if (story) {
    lines.push(...usageBlock(name, story, usage, framework))
  } else {
    report.push({ component, missing: 'usage-region' })
  }

  for (const section of sections) {
    const kept = dropFences(
      [section.heading, ...section.tokens],
      component,
      section.heading.text,
      report,
    )

    lines.push(...tidy(renderTokens(pruneEmptyHeadings(kept))).split('\n'), '')
  }

  lines.push(...sourceBlock(name, sources))

  return {
    title,
    description: data.description ?? `${title} component.`,
    lines,
    report,
  }
}

/**
 * The variants of a page, each wrapped in its `{% framework %}` block. A page
 * with one variant needs no block and no switch.
 */
function renderVariants(variants) {
  if (variants.length === 1) return variants[0].lines

  return variants.flatMap(({ framework, lines }) => [
    `{% framework name="${framework}" %}`,
    '',
    ...lines,
    '',
    '{% /framework %}',
    '',
  ])
}

/**
 * Turns one `SKILL.md` into a component page. `story`, `usage` and `example`
 * are the resolved references (or `null`), so the transformation itself
 * touches no file system. `react` carries the same references for the React
 * variant, or `null` for a component the React library does not have.
 */
export function transformSkillToPage({
  name,
  order,
  source,
  story,
  usage = null,
  example,
  react = null,
}) {
  const angular = renderVariant('angular', {
    name,
    source,
    story,
    usage,
    example,
  })
  const variants = [{ framework: 'angular', ...angular }]

  if (react) {
    variants.push({ framework: 'react', ...renderVariant('react', react) })
  }

  const { title, description } = angular

  return {
    title,
    description,
    report: variants.flatMap((variant) => variant.report),
    content:
      frontmatter({
        title,
        section: 'Components',
        order,
        component: name,
        skill: `${SKILL_PREFIX}${name}`,
        ...frameworksOf(variants),
        nextjs: { metadata: { title, description } },
      }) +
      '\n' +
      tidy(renderVariants(variants)),
  }
}

/** The `frameworks` frontmatter key of a page with more than one variant. */
function frameworksOf(variants) {
  return variants.length > 1
    ? { frameworks: variants.map((variant) => variant.framework) }
    : {}
}

/**
 * Hand written pages keep their body word for word; only the frontmatter the
 * generator owns (order, section, component) is added.
 */
export function transformContentToPage({ name, order, source, react = null }) {
  const { data, body } = parseFrontmatter(source)
  const title = data.title ?? startCase(name)
  const description = data.nextjs?.metadata?.description ?? data.description
  const variants = [{ framework: 'angular', lines: body.split('\n') }]
  const report = []

  // The hand written page is the Angular variant; the React one comes from
  // the React skill like on every other page.
  if (react) {
    const variant = renderVariant('react', react)

    variants.push({ framework: 'react', ...variant })
    report.push(...variant.report)
  }

  return {
    title,
    description,
    report,
    content:
      frontmatter({
        ...data,
        section: 'Components',
        order,
        component: name,
        ...frameworksOf(variants),
      }) +
      '\n' +
      tidy(renderVariants(variants)),
  }
}

const INDEX_LEAD =
  'Every component has the same options, behaviour and Tailwind classes in ' +
  '`@smartsoft001/angular` (`<smart-button>`) and `@smartsoft001/react` ' +
  '(`SmartButton`). Each page documents both: pick Angular or React under ' +
  "its title to see that framework's API, an executed usage example and " +
  'the live Storybook story.'

/** A description is prose from a skill: it may hold a `|` or a `{%`. */
function cell(description) {
  return escapeMarkdoc(description).replace(/\|/g, '\\|')
}

/** The `docs/components` landing page: one row per component. */
export function renderIndexPage(entries) {
  const lines = [
    '',
    `The framework ships ${entries.length} UI components. ${INDEX_LEAD} {% .lead %}`,
    '',
    '---',
    '',
    '| Component | Description |',
    '| --- | --- |',
    ...entries.map(
      ({ name, description }) =>
        `| [\`${name}\`](/docs/components/${name}) | ${cell(description)} |`,
    ),
    '',
  ]

  return (
    frontmatter({
      title: 'Components',
      section: 'Components',
      order: 0,
      nextjs: {
        metadata: {
          title: 'Components',
          description:
            'Every UI component of @smartsoft001/angular and @smartsoft001/react, with a link to its reference page.',
        },
      },
    }) + lines.join('\n')
  )
}

function hasUsageRegion(source) {
  return source
    .split(/\r?\n/)
    .some((line) => line.trim() === `// #region ${USAGE_REGION}`)
}

function firstStoryExport(source) {
  for (const match of source.matchAll(/^export const (\w+)/gm)) {
    if (match[1] !== 'meta' && match[1] !== 'default') return match[1]
  }

  return null
}

/**
 * The stories file of a component that carries the `usage` region, with the
 * Storybook id of its first story. `null` when the story is still missing:
 * the page then ships without the usage block and the CLI says so.
 */
export function findStory(repoRoot, name, framework = 'angular') {
  const { componentsDir, storyExtension } = FRAMEWORK_SOURCES[framework]
  const dir = path.join(repoRoot, componentsDir, name)

  if (!fs.existsSync(dir)) return null

  for (const entry of fs.readdirSync(dir).sort()) {
    if (!entry.endsWith(storyExtension)) continue

    const source = fs.readFileSync(path.join(dir, entry), 'utf8')

    if (!hasUsageRegion(source)) continue

    const title = metaTitle(source)
    const story = firstStoryExport(source)

    if (!title || !story) continue

    return {
      file: `${componentsDir}/${name}/${entry}`,
      id: `${sanitize(title)}--${sanitize(startCase(story))}`,
    }
  }

  return null
}

/**
 * The compiled usage example of a component: the template and the component
 * class a consumer writes in Angular, the one `.tsx` file in React. `null`
 * until every file exists.
 */
export function findUsage(repoRoot, name, framework = 'angular') {
  const base = `${FRAMEWORK_SOURCES[framework].examplesDir}/${name}/usage.example`
  const usage =
    framework === 'react'
      ? { tsx: `${base}.tsx` }
      : { html: `${base}.html`, ts: `${base}.ts` }
  const exists = (file) =>
    fs.existsSync(path.join(repoRoot, EXAMPLES_DIR, file))

  return Object.values(usage).every(exists) ? usage : null
}

/**
 * The compiled example of a component of your own: extending the base class
 * in Angular, a component built on the hook and registered on the provider in
 * React.
 */
export function findExample(repoRoot, name, framework = 'angular') {
  const extension = framework === 'react' ? 'tsx' : 'ts'
  const file = `${FRAMEWORK_SOURCES[framework].examplesDir}/${name}/custom.example.${extension}`

  return fs.existsSync(path.join(repoRoot, EXAMPLES_DIR, file)) ? file : null
}

/** The references of the React variant of a component, or `null`. */
function reactVariant(repoRoot, name) {
  const { skillsDir, skillPrefix } = FRAMEWORK_SOURCES.react
  const source = readIfExists(
    path.join(repoRoot, skillsDir, `${skillPrefix}${name}`, 'SKILL.md'),
  )

  if (!source) return null

  return {
    name,
    source,
    story: findStory(repoRoot, name, 'react'),
    usage: findUsage(repoRoot, name, 'react'),
    example: findExample(repoRoot, name, 'react'),
  }
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
}

/**
 * Every component page plus the index, in inventory order. `report` collects
 * the dropped fences and the missing story regions, `warnings` the components
 * nothing could be written from.
 */
export function collectComponents(
  repoRoot,
  names = componentInventory(repoRoot),
) {
  const pages = []
  const entries = []
  const report = []
  const warnings = []
  let order = 0

  for (const name of names) {
    const content = readIfExists(path.join(repoRoot, CONTENT_DIR, `${name}.md`))
    const skill = readIfExists(
      path.join(
        repoRoot,
        ANGULAR.skillsDir,
        `${SKILL_PREFIX}${name}`,
        'SKILL.md',
      ),
    )

    if (!content && !skill) {
      warnings.push(`no source for component ${name}`)
      continue
    }

    order += 1

    const react = reactVariant(repoRoot, name)
    const page = content
      ? transformContentToPage({ name, order, source: content, react })
      : transformSkillToPage({
          name,
          order,
          source: skill,
          story: findStory(repoRoot, name),
          usage: findUsage(repoRoot, name),
          example: findExample(repoRoot, name),
          react,
        })

    pages.push({ name, content: page.content })
    entries.push({ name, description: page.description })
    report.push(...page.report)
  }

  return { pages, entries, index: renderIndexPage(entries), report, warnings }
}
