import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { parseFrontmatter } from './navigation.mjs'
import {
  collectComponents,
  deriveTitle,
  findExample,
  findStory,
  renderIndexPage,
  transformContentToPage,
  transformSkillToPage,
} from './components.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.join(here, '__fixtures__', 'components')
const skillsDir = path.join(
  fixtureRoot,
  'packages/shared/claude-plugins/src/plugins/smart/skills',
)

function skill(name) {
  return fs.readFileSync(
    path.join(skillsDir, `angular-components-${name}`, 'SKILL.md'),
    'utf8',
  )
}

function content(name) {
  return fs.readFileSync(
    path.join(fixtureRoot, 'docs/site/content/components', `${name}.md`),
    'utf8',
  )
}

function storyOf(name, id) {
  return {
    file: `packages/shared/angular/src/lib/components/${name}/${name}.component.stories.ts`,
    id,
  }
}

describe('deriveTitle', () => {
  test('drops a trailing " Component" from the H1', () => {
    assert.equal(deriveTitle('# Button Component\n', 'button'), 'Button')
  })

  test('keeps the rest of a multi word H1', () => {
    assert.equal(
      deriveTitle('# Sign-in Form Component\n', 'sign-in-form'),
      'Sign-in Form',
    )
  })

  test('drops a trailing parenthetical and a "BaseComponent" suffix', () => {
    assert.equal(
      deriveTitle('# AccordionBaseComponent (Base Only)\n', 'accordion'),
      'Accordion',
    )
  })

  test('drops a spelled out "Base Component" suffix', () => {
    assert.equal(deriveTitle('# Card Base Component\n', 'card'), 'Card')
  })

  test('keeps an H1 that carries no suffix at all', () => {
    assert.equal(deriveTitle('# Icon\n', 'icon'), 'Icon')
  })

  test('falls back to the start cased directory name without an H1', () => {
    assert.equal(
      deriveTitle('No heading here.\n', 'select-menu'),
      'Select Menu',
    )
  })

  test('ignores a heading inside a fenced code block', () => {
    const body = '```bash\n# Not a title\n```\n\n# Real Component\n'

    assert.equal(deriveTitle(body, 'real'), 'Real')
  })
})

describe('transformSkillToPage frontmatter', () => {
  test('renders the documented frontmatter keys in order', () => {
    const { content: page } = transformSkillToPage({
      name: 'button',
      order: 1,
      source: skill('button'),
      story: storyOf('button', 'components-button--playground'),
      example: 'angular/src/components/button/custom.example.ts',
    })

    assert.ok(
      page.startsWith(
        [
          '---',
          'title: Button',
          'section: Components',
          'order: 1',
          'component: button',
          'skill: angular-components-button',
          'nextjs:',
          '  metadata:',
          '    title: Button',
          '    description: Button component API with InjectionToken pattern for custom implementations.',
          '---',
          '',
        ].join('\n'),
      ),
      page.slice(0, 400),
    )
  })

  test('quotes a description with a colon and quotes as valid yaml', () => {
    const { content: page } = transformSkillToPage({
      name: 'widget',
      order: 4,
      source: skill('widget'),
      story: storyOf('widget', 'smart-widget-widget--playground'),
      example: null,
    })

    const { data } = parseFrontmatter(page)

    assert.equal(
      data.nextjs.metadata.description,
      'Widget component: renders "smart" widgets, fast.',
    )
  })
})

describe('transformSkillToPage body', () => {
  const button = () =>
    transformSkillToPage({
      name: 'button',
      order: 1,
      source: skill('button'),
      story: storyOf('button', 'components-button--playground'),
      example: 'angular/src/components/button/custom.example.ts',
    })

  test('marks the first intro paragraph as the lead and keeps the rest', () => {
    const { content: page } = button()

    assert.match(
      page,
      /The `<smart-button>` component wraps a button and can be replaced through a token\. \{% \.lead %\}\n\nIt renders `ButtonStandardComponent` by default\./,
    )
  })

  test('drops the sections that are written for Claude, not for readers', () => {
    const { content: page } = button()

    assert.ok(!page.includes('## When to Use This Skill'))
    assert.ok(!page.includes('## Usage Examples'))
    assert.ok(!page.includes('## File Locations'))
  })

  test('keeps the reference sections in their original order', () => {
    const { content: page } = button()
    const headings = page.match(/^## .*$/gm)

    assert.deepEqual(headings, [
      '## Usage',
      '## Components',
      '## API',
      '## Extending the base class',
      '## Source',
    ])
  })

  test('keeps sub headings, tables and inline code of the kept sections', () => {
    const { content: page } = button()

    assert.ok(page.includes('### ButtonComponent (`<smart-button>`)'))
    assert.ok(
      page.includes('| `options`  | `InputSignal<IButton>` | required |'),
    )
  })

  test('removes every fenced code block the skill wrote', () => {
    const { content: page } = button()

    // The page still contains fences of its own: the Claude Code tab shows a
    // prompt, and the HTML tab is produced from the story at build time. What
    // must be gone is the prose code the skill carried.
    assert.ok(!page.includes('interface IButtonOptions'))
    assert.ok(!page.includes('```typescript'))
    assert.ok(!page.includes('```html'))
  })

  test('drops a sub heading left empty by the removed fence', () => {
    const { content: page } = button()

    assert.ok(!page.includes('### IButtonOptions'))
    assert.ok(page.includes('### Inputs'))
    assert.ok(page.includes('### ButtonBaseComponent (abstract)'))
  })

  test('reports every dropped fence with its nearest heading and language', () => {
    const { report } = button()

    assert.deepEqual(
      report.filter((entry) => entry.language),
      [
        {
          component: 'button',
          section: 'ButtonComponent (`<smart-button>`)',
          language: 'typescript',
        },
        { component: 'button', section: 'IButtonOptions', language: 'ts' },
      ],
    )
  })

  test('inserts the usage block between the intro and the first section', () => {
    const { content: page } = button()

    const story =
      'packages/shared/angular/src/lib/components/button/button.component.stories.ts'
    const usage = page.slice(
      page.indexOf('## Usage'),
      page.indexOf('## Components'),
    )

    assert.match(page, /---\n\n## Usage\n/)
    assert.match(usage, /\{% tabs %\}/)
    assert.match(
      usage,
      new RegExp(
        `\\{% tab title="HTML" %\\}\\n\\n\\{% story-template file="${story}" region="usage" /%\\}`,
      ),
    )
    assert.match(
      usage,
      new RegExp(
        `\\{% tab title="TypeScript" %\\}\\n\\n\\{% snippet file="${story}" region="usage" /%\\}`,
      ),
    )
    assert.match(usage, /\{% tab title="Claude Code" %\}/)
    assert.match(usage, /\{% \/tabs %\}/)
    assert.match(
      usage,
      /\{% storybook project="angular" story="components-button--playground" height=320 \/%\}/,
    )
  })

  test('orders the tabs markup, code, then the way to ask for it', () => {
    const { content: page } = button()
    const order = ['HTML', 'TypeScript', 'Claude Code'].map((title) =>
      page.indexOf(`{% tab title="${title}" %}`),
    )

    assert.ok(order.every((index) => index > -1))
    assert.deepEqual(
      [...order].sort((a, b) => a - b),
      order,
    )
  })

  test('leaves out the generator tab while no generator collection exists', () => {
    const { content: page } = button()

    assert.ok(!page.includes('Nx generator'))
  })

  test('uses the taller story frame for the layout components', () => {
    const { content: page } = transformSkillToPage({
      name: 'form',
      order: 3,
      source: skill('button'),
      story: storyOf('form', 'smart-form-form--playground'),
      example: null,
    })

    assert.ok(page.includes('story="smart-form-form--playground" height=560'))
  })

  test('replaces the extending section with the example snippet', () => {
    const { content: page } = button()

    assert.match(
      page,
      /## Extending the base class\n\n\{% snippet file="angular\/src\/components\/button\/custom\.example\.ts" region="usage" \/%\}\n/,
    )
  })

  test('ends with the source section linking the library and the skill', () => {
    const { content: page } = button()

    assert.ok(
      page.endsWith(
        '## Source\n\n' +
          'The component lives in [`packages/shared/angular/src/lib/components/button`]' +
          '(https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/button)' +
          ' and is documented for Claude Code by the [`angular-components-button`]' +
          '(https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/claude-plugins/src/plugins/smart/skills/angular-components-button)' +
          ' skill.\n',
      ),
      page.slice(-500),
    )
  })

  test('never leaves three blank lines behind a dropped section', () => {
    const { content: page } = button()

    assert.ok(!page.includes('\n\n\n'))
  })
})

describe('transformSkillToPage deviations', () => {
  const widget = () =>
    transformSkillToPage({
      name: 'widget',
      order: 4,
      source: skill('widget'),
      story: storyOf('widget', 'smart-widget-widget--playground'),
      example: null,
    })

  test('drops a "## Usage" section that only holds code fences', () => {
    const { content: page } = widget()
    const headings = page.match(/^## .*$/gm)

    assert.deepEqual(headings, [
      '## Usage',
      '## Components',
      '## API',
      '## Source',
    ])
    assert.ok(!page.includes('<smart-widget mode="compact" />'))
  })

  test('escapes a literal Markdoc tag written in the skill prose', () => {
    const { content: page } = widget()

    assert.ok(page.includes('Legacy templates wrote \\{% widget %} inline.'))
  })

  test('derives the story id from the meta title of the stories file', () => {
    const { content: page } = widget()

    assert.ok(page.includes('story="smart-widget-widget--playground"'))
  })

  test('adds no extending section when the skill has none', () => {
    const { content: page } = widget()

    assert.ok(!page.toLowerCase().includes('## extending'))
  })

  test('drops the extending section when no example file exists', () => {
    const { content: page, report } = transformSkillToPage({
      name: 'gadget',
      order: 2,
      source: skill('gadget'),
      story: null,
      example: null,
    })

    assert.ok(!page.toLowerCase().includes('extending'))
    assert.deepEqual(report, [{ component: 'gadget', missing: 'usage-region' }])
  })

  test('omits the usage block when no stories file carries the region', () => {
    const { content: page } = transformSkillToPage({
      name: 'gadget',
      order: 2,
      source: skill('gadget'),
      story: null,
      example: null,
    })

    assert.ok(!page.includes('{% storybook'))
    assert.ok(!page.includes('## Usage'))
  })

  test('renders the whole page of a skill without story or example', () => {
    const { content: page } = transformSkillToPage({
      name: 'gadget',
      order: 2,
      source: skill('gadget'),
      story: null,
      example: null,
    })

    assert.equal(
      page,
      [
        '---',
        'title: Gadget',
        'section: Components',
        'order: 2',
        'component: gadget',
        'skill: angular-components-gadget',
        'nextjs:',
        '  metadata:',
        '    title: Gadget',
        '    description: Gadget component API.',
        '---',
        '',
        'The `<smart-gadget>` component renders a gadget. {% .lead %}',
        '',
        '---',
        '',
        '## Components',
        '',
        '### GadgetComponent (`<smart-gadget>`)',
        '',
        'Main wrapper component.',
        '',
        '## Source',
        '',
        'The component lives in [`packages/shared/angular/src/lib/components/gadget`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/angular/src/lib/components/gadget) and is documented for Claude Code by the [`angular-components-gadget`](https://github.com/emiljuchnikowski/smartsoft001/tree/main/packages/shared/claude-plugins/src/plugins/smart/skills/angular-components-gadget) skill.',
        '',
      ].join('\n'),
    )
  })
})

describe('transformSkillToPage extending at level three', () => {
  const source = [
    '# Gizmo Component',
    '',
    'A gizmo.',
    '',
    '## Base Class API (for Extension)',
    '',
    '### Members',
    '',
    'Some prose.',
    '',
    '### Extending',
    '',
    'Extend the base class:',
    '',
    '```typescript',
    'class MyGizmo extends GizmoBaseComponent {}',
    '```',
    '',
    '## File Locations',
    '',
    '- somewhere',
    '',
  ].join('\n')

  function page(example) {
    return transformSkillToPage({
      name: 'gizmo',
      order: 1,
      source,
      story: null,
      example,
    })
  }

  test('replaces it with the example snippet, keeping the heading level', () => {
    const { content } = page('angular/src/components/gizmo/custom.example.ts')

    assert.match(
      content,
      /### Extending the base class\n\n\{% snippet file="angular\/src\/components\/gizmo\/custom\.example\.ts" region="usage" \/%\}\n/,
    )
    assert.ok(content.includes('## Base Class API (for Extension)'))
    assert.ok(content.includes('### Members'))
    assert.ok(!content.includes('Extend the base class:'))
  })

  test('drops it, prose and all, when no example exists', () => {
    const { content } = page(null)

    assert.ok(!content.includes('Extending'))
    assert.ok(!content.includes('Extend the base class:'))
    assert.ok(content.includes('### Members'))
  })
})

describe('transformContentToPage', () => {
  test('keeps the hand written body and adds the computed frontmatter', () => {
    const { content: page } = transformContentToPage({
      name: 'loader',
      order: 3,
      source: content('loader'),
    })

    assert.ok(
      page.startsWith(
        [
          '---',
          'title: Loader',
          'nextjs:',
          '  metadata:',
          '    title: Loader',
          '    description: The loader overlay, shown while a page waits for data.',
          'section: Components',
          'order: 3',
          'component: loader',
          '---',
          '',
        ].join('\n'),
      ),
      page.slice(0, 400),
    )
    assert.ok(
      page.endsWith(
        '{% snippet file="angular/src/components/loader/basic.example.ts" region="usage" /%}\n',
      ),
    )
  })

  test('reads the description out of the hand written frontmatter', () => {
    const { description } = transformContentToPage({
      name: 'loader',
      order: 3,
      source: content('loader'),
    })

    assert.equal(
      description,
      'The loader overlay, shown while a page waits for data.',
    )
  })
})

describe('findStory', () => {
  test('finds the stories file carrying the usage region and builds its id', () => {
    assert.deepEqual(findStory(fixtureRoot, 'widget'), {
      file: 'packages/shared/angular/src/lib/components/widget/widget.component.stories.ts',
      id: 'smart-widget-widget--playground',
    })
  })

  test('returns null when the stories file has no usage region', () => {
    assert.equal(findStory(fixtureRoot, 'gadget'), null)
  })

  test('returns null when the component has no stories file', () => {
    assert.equal(findStory(fixtureRoot, 'loader'), null)
  })
})

describe('findExample', () => {
  test('returns the examples relative path when the file exists', () => {
    assert.equal(
      findExample(fixtureRoot, 'button'),
      'angular/src/components/button/custom.example.ts',
    )
  })

  test('returns null when the component has no extension example', () => {
    assert.equal(findExample(fixtureRoot, 'widget'), null)
  })
})

describe('renderIndexPage', () => {
  const entries = [
    { name: 'button', description: 'Button component API.' },
    { name: 'widget', description: 'Widget component: renders widgets.' },
  ]

  test('renders the frontmatter, the lead and one table row per component', () => {
    const page = renderIndexPage(entries)

    assert.equal(
      page,
      [
        '---',
        'title: Components',
        'section: Components',
        'order: 0',
        'nextjs:',
        '  metadata:',
        '    title: Components',
        '    description: Every smart-* UI component of @smartsoft001/angular, with a link to its reference page.',
        '---',
        '',
        "The `@smartsoft001/angular` package ships 2 `smart-*` components. Each page shows the component's API, an executed usage example taken from its Storybook story, and the live story itself. {% .lead %}",
        '',
        '---',
        '',
        '| Component | Description |',
        '| --- | --- |',
        '| [`button`](/docs/components/button) | Button component API. |',
        '| [`widget`](/docs/components/widget) | Widget component: renders widgets. |',
        '',
      ].join('\n'),
    )
  })
  test('escapes a pipe and a literal Markdoc tag in a description', () => {
    const page = renderIndexPage([
      { name: 'toggle', description: 'On | off, written {% inline %}.' },
    ])

    assert.ok(
      page.includes(
        '| [`toggle`](/docs/components/toggle) | On \\| off, written \\{% inline %}. |',
      ),
      page,
    )
  })
})

describe('collectComponents', () => {
  test('numbers the pages alphabetically, starting after the index', () => {
    const { pages } = collectComponents(fixtureRoot)

    assert.deepEqual(
      pages.map(({ name }) => name),
      ['button', 'gadget', 'loader', 'widget'],
    )
    assert.ok(pages[0].content.includes('\norder: 1\n'))
    assert.ok(pages[3].content.includes('\norder: 4\n'))
  })

  test('prefers the hand written content file over a skill', () => {
    const { pages } = collectComponents(fixtureRoot)
    const loader = pages.find((page) => page.name === 'loader')

    assert.ok(loader.content.includes('The `<smart-loader>` component covers'))
    assert.ok(!loader.content.includes('## Source'))
  })

  test('reports the components whose stories carry no usage region', () => {
    const { report } = collectComponents(fixtureRoot)

    assert.deepEqual(
      report.filter((entry) => entry.missing),
      [{ component: 'gadget', missing: 'usage-region' }],
    )
  })

  test('lists every component on the index page', () => {
    const { index } = collectComponents(fixtureRoot)

    assert.ok(index.includes('ships 4 `smart-*` components'))
    assert.ok(index.includes('| [`loader`](/docs/components/loader) |'))
    assert.ok(
      index.includes(
        '| [`widget`](/docs/components/widget) | Widget component: renders "smart" widgets, fast. |',
      ),
    )
  })
})

describe('generate-components CLI', () => {
  const cli = path.join(here, 'generate-components.mjs')

  function workspace() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'components-'))

    fs.cpSync(fixtureRoot, dir, { recursive: true })

    return dir
  }

  function run(root, ...args) {
    return execFileSync(process.execPath, [cli, '--root', root, ...args], {
      encoding: 'utf8',
    })
  }

  test('writes a page per component plus the index and reports its work', () => {
    const root = workspace()
    const output = run(root)
    const componentsDir = path.join(root, 'docs/site/src/app/docs/components')

    assert.deepEqual(fs.readdirSync(componentsDir).sort(), [
      'button',
      'gadget',
      'loader',
      'page.md',
      'widget',
    ])
    assert.match(
      output,
      /components: 4 pages → docs\/site\/src\/app\/docs\/components/,
    )
    assert.match(output, /dropped fence: button — IButtonOptions \(ts\)/)
    assert.match(output, /gadget: no stories file with a "usage" region/)
  })

  test('deletes the pages of components that left the inventory', () => {
    const root = workspace()
    const stale = path.join(root, 'docs/site/src/app/docs/components/ghost')

    fs.mkdirSync(stale, { recursive: true })
    fs.writeFileSync(path.join(stale, 'page.md'), '---\ntitle: Ghost\n---\n')
    run(root)

    assert.equal(fs.existsSync(stale), false)
  })

  test('--check passes right after a run', () => {
    const root = workspace()

    run(root)

    assert.doesNotThrow(() => run(root, '--check'))
  })

  test('--check fails when a page on disk drifted', () => {
    const root = workspace()

    run(root)
    fs.writeFileSync(
      path.join(root, 'docs/site/src/app/docs/components/button/page.md'),
      'stale\n',
    )

    assert.throws(
      () => run(root, '--check'),
      (error) => {
        assert.equal(error.status, 1)
        assert.match(error.stderr, /out of date/)
        return true
      },
    )
  })

  test('warns about a component nothing can be written from', () => {
    const root = workspace()

    fs.rmSync(path.join(root, 'docs/site/content/components/loader.md'))

    const output = run(root)

    assert.match(output, /warning: no source for component loader/)
    assert.match(output, /components: 3 pages/)
    assert.equal(
      fs.existsSync(
        path.join(root, 'docs/site/src/app/docs/components/loader/page.md'),
      ),
      false,
    )
  })

  test('--check fails when a component page is missing', () => {
    const root = workspace()

    assert.throws(() => run(root, '--check'), { status: 1 })
  })
})
