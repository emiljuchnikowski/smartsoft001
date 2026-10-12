import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  componentInventory,
  danglingColons,
  NO_HANDWRITTEN_CODE_DIRS,
  PACKAGES_OUTSIDE_META,
  packageInventory,
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
  runAllRules,
  skillInventory,
  storyInventory,
} from './check-rules.mjs'
import { API_EXCEPTIONS, COMPONENT_EXCEPTIONS } from './framework-parity.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.join(here, '__fixtures__', 'check')
const regionRoot = path.join(here, '__fixtures__', 'check-r9')
const skillRoot = path.join(here, '__fixtures__', 'check-r10')
const fenceRoot = path.join(here, '__fixtures__', 'check-r11')
const metaRoot = path.join(here, '__fixtures__', 'check-r12')
const tabsRoot = path.join(here, '__fixtures__', 'check-r13')
const citedRoot = path.join(here, '__fixtures__', 'check-r14')
const agentRoot = path.join(here, '__fixtures__', 'check-r16')
const quotedRoot = path.join(here, '__fixtures__', 'check-fenced')
const reactRoot = path.join(here, '__fixtures__', 'check-react')
const parityRoot = path.join(here, '__fixtures__', 'check-r18')
const apiRoot = path.join(here, '__fixtures__', 'check-r19')

/** The exceptions of `framework-parity.mjs` a parity test runs with. */
const NO_EXCEPTIONS = { components: {}, api: {} }
const REASON = 'The fixture needs it.'

function parityContext(overrides = {}) {
  return context({
    repoRoot: parityRoot,
    docsAppDir: path.join(parityRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(parityRoot, 'docs', 'examples'),
    parity: NO_EXCEPTIONS,
    ...overrides,
  })
}

function apiContext(overrides = {}) {
  return parityContext({
    repoRoot: apiRoot,
    docsAppDir: path.join(apiRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(apiRoot, 'docs', 'examples'),
    ...overrides,
  })
}

function reactContext(overrides = {}) {
  return context({
    repoRoot: reactRoot,
    docsAppDir: path.join(reactRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(reactRoot, 'docs', 'examples'),
    ...overrides,
  })
}

function context(overrides = {}) {
  return {
    repoRoot: fixtureRoot,
    docsAppDir: path.join(fixtureRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(fixtureRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function regionContext(overrides = {}) {
  return {
    repoRoot: regionRoot,
    docsAppDir: path.join(regionRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(regionRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function skillContext(overrides = {}) {
  return {
    repoRoot: skillRoot,
    docsAppDir: path.join(skillRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(skillRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function quotedContext(overrides = {}) {
  return {
    repoRoot: quotedRoot,
    docsAppDir: path.join(quotedRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(quotedRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function fenceContext(overrides = {}) {
  return {
    repoRoot: fenceRoot,
    docsAppDir: path.join(fenceRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(fenceRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function metaContext(overrides = {}) {
  return {
    repoRoot: metaRoot,
    docsAppDir: path.join(metaRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(metaRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function tabsContext(overrides = {}) {
  return {
    repoRoot: tabsRoot,
    docsAppDir: path.join(tabsRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(tabsRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

function citedContext(overrides = {}) {
  return {
    repoRoot: citedRoot,
    docsAppDir: path.join(citedRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(citedRoot, 'docs', 'examples'),
    strict: false,
    ...overrides,
  }
}

describe('packageInventory', () => {
  test('lists @smartsoft001 package names without the scope, sorted', () => {
    const names = packageInventory(fixtureRoot)

    assert.deepEqual(names, ['alpha', 'beta-shell-dtos'])
  })

  test('skips claude-plugins, unscoped packages and node_modules', () => {
    const names = packageInventory(fixtureRoot)

    assert.ok(!names.includes('claude-plugins'))
    assert.ok(!names.includes('not-scoped'))
    assert.ok(!names.includes('ghost'))
  })
})

describe('componentInventory', () => {
  test('unions plugin component skills with exported component directories', () => {
    const names = componentInventory(fixtureRoot)

    assert.deepEqual(names, ['button', 'card', 'loader'])
  })

  test('ignores exported directories without a component file', () => {
    const names = componentInventory(fixtureRoot)

    assert.ok(!names.includes('base'))
  })

  test('ignores exported directories whose class is a directive, not a component', () => {
    const names = componentInventory(fixtureRoot)

    assert.ok(!names.includes('panel'))
  })
})

describe('skillInventory', () => {
  test('keeps only plugin skills marked user-invocable, from every plugin', () => {
    const skills = skillInventory(fixtureRoot)

    assert.deepEqual(skills, [
      { name: 'audit-log', source: 'plugin', plugin: 'smart-core' },
      { name: 'format-code', source: 'plugin', plugin: 'smart-core' },
      {
        name: 'scaffold-nx-workspace',
        source: 'plugin',
        plugin: 'smart-angular',
      },
    ])
  })

  test('treats a missing user-invocable field as false', () => {
    const skills = skillInventory(fixtureRoot)

    assert.ok(!skills.some((skill) => skill.name === 'internal-only'))
  })
})

describe('storyInventory', () => {
  test('builds storybook ids from the meta title and the export name', () => {
    const stories = storyInventory(fixtureRoot)

    assert.deepEqual(
      stories.map((story) => story.id),
      [
        'smart-crud-list-page--default',
        'components-button--playground',
        'components-button--all-variants',
      ].sort(),
    )
  })

  test('resolves the storybook project from the file location', () => {
    const stories = storyInventory(fixtureRoot)
    const allVariants = stories.find(
      (story) => story.id === 'components-button--all-variants',
    )
    const list = stories.find(
      (story) => story.id === 'smart-crud-list-page--default',
    )

    assert.equal(allVariants.project, 'angular')
    assert.equal(list.project, 'crud-shell-angular')
  })

  test('ignores a nested title property that is not the meta title', () => {
    const stories = storyInventory(fixtureRoot)

    assert.ok(!stories.some((story) => story.id.startsWith('note--')))
  })

  test('lists the usage example stories of docs/examples under their framework', () => {
    const stories = storyInventory(
      path.join(here, '__fixtures__', 'check-docs-stories'),
    )

    assert.deepEqual(
      stories.map(({ id, project }) => ({ id, project })),
      [
        { id: 'docs-usage-examples--button', project: 'angular' },
        { id: 'docs-usage-examples--button-group', project: 'react' },
      ],
    )
  })
})

describe('danglingColons (R17)', () => {
  test('reports a colon followed by prose or a heading', () => {
    const source = [
      'Register it through the token:',
      '',
      'The preset consumes the existing API.',
      '',
      'Apply the map:',
      '',
      '## API',
    ].join('\n')

    assert.deepEqual(danglingColons(source), [1, 5])
  })

  test('accepts a colon followed by a list, a table, a code block or a tag', () => {
    const source = [
      'Features:',
      '- one',
      '',
      'Inputs:',
      '',
      '| Input | Type |',
      '',
      'The command:',
      '```bash',
      'npm test',
      '```',
      '',
      'The example:',
      '',
      '{% snippet file="a.ts" region="usage" /%}',
      '',
      'Steps:',
      '1. first',
    ].join('\n')

    assert.deepEqual(danglingColons(source), [])
  })

  test('reports a colon at the end of the page and before a closing tag', () => {
    const source = ['Use it like this:', '', '{% /framework %}', 'Last:'].join(
      '\n',
    )

    assert.deepEqual(danglingColons(source), [1, 4])
  })

  test('skips the frontmatter, code blocks, list items and indented lines', () => {
    const source = [
      '---',
      'frameworks:',
      '  - angular',
      '---',
      '```text',
      'Prompt:',
      '```',
      '- item with nested content:',
      '  more',
      '    indented:',
      '',
      'Done.',
    ].join('\n')

    assert.deepEqual(danglingColons(source), [])
  })
})

describe('rule1 (package pages)', () => {
  test('reports nothing for a package that has a page', () => {
    const findings = rule1(context())

    assert.ok(!findings.some((finding) => finding.message.includes('alpha')))
  })

  test('reports a package without a page as a warning', () => {
    const findings = rule1(context())

    assert.equal(findings.length, 1)
    assert.equal(findings[0].rule, 'R1')
    assert.equal(findings[0].level, 'warn')
    assert.match(findings[0].message, /beta-shell-dtos/)
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule1(context({ strict: true }))

    assert.equal(findings[0].level, 'error')
  })

  test('raises the level to error when only R1 is strict', () => {
    const findings = rule1(context({ strict: new Set(['R1']) }))

    assert.equal(findings[0].level, 'error')
  })
})

describe('rule2 (component pages)', () => {
  test('reports nothing for a component that has a page', () => {
    const findings = rule2(context())

    assert.ok(!findings.some((finding) => finding.message.includes('button')))
  })

  test('reports components without a page', () => {
    const findings = rule2(context())

    assert.deepEqual(
      findings.map((finding) => finding.level),
      ['warn', 'warn'],
    )
    assert.match(findings[0].message, /card/)
    assert.match(findings[1].message, /loader/)
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule2(context({ strict: true }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('stays a warning when only R1 is strict', () => {
    const findings = rule2(context({ strict: new Set(['R1']) }))

    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })
})

describe('rule3 (skill pages)', () => {
  test('accepts a plugin skill documented under docs/skills', () => {
    const findings = rule3(context())

    assert.ok(
      !findings.some((finding) => finding.message.includes('audit-log')),
    )
  })

  test('asks for no page for a repo skill', () => {
    const findings = rule3(context())

    assert.ok(!findings.some((finding) => finding.message.includes('commit')))
  })

  test('reports an undocumented skill with its expected page path', () => {
    const findings = rule3(context())

    assert.equal(findings.length, 1)
    assert.equal(findings[0].level, 'warn')
    assert.match(findings[0].message, /format-code/)
    assert.match(findings[0].message, /docs\/skills\/format-code\/page\.md/)
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule3(context({ strict: true }))

    assert.equal(findings[0].level, 'error')
  })

  test('accepts a list of strict rule ids as well as a set', () => {
    const findings = rule3(context({ strict: ['R1', 'R3'] }))

    assert.equal(findings[0].level, 'error')
  })
})

describe('rule4 (snippet tags)', () => {
  test('accepts snippets that resolve against the examples root and the repo', () => {
    const findings = rule4(context())

    assert.ok(
      !findings.some((finding) => finding.file.endsWith('alpha/page.md')),
    )
  })

  test('reports a snippet whose file is missing', () => {
    const findings = rule4(context())

    assert.equal(
      findings.filter((finding) => /missing\.example\.ts/.test(finding.message))
        .length,
      1,
    )
  })

  test('reports a snippet whose region marker is missing', () => {
    const findings = rule4(context())
    const finding = findings.find((item) => /region "nope"/.test(item.message))

    assert.ok(finding)
    assert.equal(finding.rule, 'R4')
    assert.equal(finding.level, 'error')
  })

  test('accepts a region declared with a shell "#" marker', () => {
    const findings = rule4(context())

    assert.ok(!findings.some((finding) => /setup\.sh/.test(finding.message)))
  })

  test('rejects a snippet path that escapes its root', () => {
    const findings = rule4(context())

    assert.equal(
      findings.filter((finding) => /outside/.test(finding.message)).length,
      1,
    )
  })

  test('reports every broken snippet exactly once', () => {
    const findings = rule4(context())

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })
})

describe('rule5 (storybook tags)', () => {
  test('accepts a story id that exists for its project', () => {
    const findings = rule5(context())

    assert.ok(
      !findings.some((finding) => finding.file.endsWith('alpha/page.md')),
    )
  })

  test('reports an unknown story id', () => {
    const findings = rule5(context())

    assert.ok(
      findings.some((finding) =>
        finding.message.includes('components-button--nope'),
      ),
    )
  })

  test('reports a story id that belongs to another project', () => {
    const findings = rule5(context())
    const finding = findings.find((item) =>
      item.message.includes('components-button--playground'),
    )

    assert.ok(finding)
    assert.match(finding.message, /crud-shell-angular/)
  })

  test('reports every broken storybook tag as an error', () => {
    const findings = rule5(context())

    assert.equal(findings.length, 2)
    assert.ok(findings.every((finding) => finding.rule === 'R5'))
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })
})

describe('rule6 (no inline code blocks)', () => {
  test('accepts a non-code fence on a package page', () => {
    const findings = rule6(context())

    assert.ok(
      !findings.some((finding) => finding.file.endsWith('alpha/page.md')),
    )
  })

  test('reports a typescript fence on a component page with its line', () => {
    const findings = rule6(context())
    const finding = findings.find((item) =>
      /components\/button\/page\.md/.test(item.message),
    )

    assert.equal(findings.length, 2)
    assert.ok(finding)
    assert.equal(finding.rule, 'R6')
    assert.equal(finding.level, 'error')
    assert.match(finding.message, /components\/button\/page\.md:8/)
    assert.match(finding.message, /ts/)
  })

  test('ignores pages outside the covered directories', () => {
    const findings = rule6(context())

    assert.ok(!findings.some((finding) => finding.file.includes('guides')))
  })

  test('covers the getting started pages as well', () => {
    assert.deepEqual(NO_HANDWRITTEN_CODE_DIRS, [
      'docs/architecture',
      'docs/components',
      'docs/crud',
      'docs/installation',
      'docs/introduction',
      'docs/packages',
    ])
  })

  test('reports a typescript fence on the architecture page', () => {
    const findings = rule6(context())
    const finding = findings.find((item) =>
      /architecture\/page\.md/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.level, 'error')
    assert.match(finding.message, /:8:/)
  })

  test('accepts a bash fence on the installation page', () => {
    const findings = rule6(context())

    assert.ok(
      !findings.some((finding) => finding.file.includes('installation')),
    )
  })

  test('leaves the root page uncovered', () => {
    const findings = rule6(context())

    assert.ok(!findings.some((finding) => /^page\.md/.test(finding.message)))
  })
})

describe('rule7 (frontmatter)', () => {
  test('accepts a page with a title and a known section', () => {
    const findings = rule7(context())

    assert.ok(
      !findings.some((finding) => finding.file.endsWith('alpha/page.md')),
    )
  })

  test('reports a page whose frontmatter is not valid YAML', () => {
    const findings = rule7(context())
    const finding = findings.find((item) =>
      /broken-frontmatter/.test(item.message),
    )

    assert.ok(finding)
    assert.match(finding.message, /invalid frontmatter/)
  })

  test('reports a missing title, a missing section and an unknown section', () => {
    const findings = rule7(context())

    assert.equal(findings.length, 4)
    assert.ok(findings.every((finding) => finding.rule === 'R7'))
    assert.ok(findings.every((finding) => finding.level === 'error'))
    assert.ok(findings.some((finding) => /no-title/.test(finding.message)))
    assert.ok(findings.some((finding) => /no-section/.test(finding.message)))
    assert.ok(
      findings.some((finding) =>
        /unknown section "Nonsense"/.test(finding.message),
      ),
    )
  })
})

describe('rule8 (package page structure)', () => {
  function messagesFor(page) {
    return rule8(context())
      .filter((finding) => finding.file.endsWith(`${page}/page.md`))
      .map((finding) => finding.message)
  }

  test('accepts a page with the right package, the three headings and a snippet', () => {
    assert.deepEqual(messagesFor('good-pkg'), [])
  })

  test('reports a package value that does not match the directory', () => {
    const messages = messagesFor('bad-pkg')
    const finding = messages.find((message) => /"package"/.test(message))

    assert.ok(finding)
    assert.match(finding, /@smartsoft001\/wrong-name/)
    assert.match(finding, /@smartsoft001\/bad-pkg/)
  })

  test('reports a missing package value with the expected name', () => {
    const messages = messagesFor('no-package-pkg')

    assert.equal(messages.length, 1)
    assert.match(messages[0], /missing frontmatter "package"/)
    assert.match(messages[0], /@smartsoft001\/no-package-pkg/)
  })

  test('reports every structural problem of a bad page exactly once', () => {
    const messages = messagesFor('bad-pkg')

    assert.equal(messages.length, 4)
    assert.equal(
      messages.filter((message) => /missing heading "## API"/.test(message))
        .length,
      1,
    )
    assert.equal(
      messages.filter((message) => /snippet/.test(message)).length,
      1,
    )
    assert.equal(
      messages.filter((message) => /"## Install" section/.test(message)).length,
      1,
    )
  })

  test('does not report headings that the bad page does have', () => {
    const messages = messagesFor('bad-pkg')

    assert.ok(!messages.some((message) => /"## Usage"/.test(message)))
    assert.ok(
      !messages.some((message) => /missing heading "## Install"/.test(message)),
    )
  })

  test('accepts an install section that explains itself in a callout', () => {
    assert.deepEqual(messagesFor('callout-pkg'), [])
  })

  test('leaves the packages index page uncovered', () => {
    const findings = rule8(context())

    assert.ok(
      !findings.some((finding) =>
        /docs\/packages\/page\.md/.test(finding.message),
      ),
    )
  })

  test('reports every finding as an R8 error', () => {
    const findings = rule8(context())

    assert.equal(findings.length, 5)
    assert.ok(findings.every((finding) => finding.rule === 'R8'))
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })
})

describe('rule9 (usage regions in stories)', () => {
  test('accepts a component whose stories declare a usage region', () => {
    const findings = rule9(context())

    assert.ok(!findings.some((finding) => /"button"/.test(finding.message)))
  })

  test('reports a component that has no stories file at all', () => {
    const findings = rule9(context())

    assert.deepEqual(
      findings.map((finding) => finding.level),
      ['warn', 'warn'],
    )
    assert.equal(findings[0].rule, 'R9')
    assert.equal(
      findings[0].message,
      'Component "card" has no Storybook story (expected a *.stories.ts ' +
        'under packages/shared/angular/src/lib/components/card with a ' +
        '"usage" region)',
    )
    assert.match(findings[1].message, /^Component "loader" has no Storybook/)
  })

  test('reports stories that never open a usage region, naming the first file', () => {
    const finding = rule9(regionContext()).find((item) =>
      item.message.includes('"badge"'),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R9')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'Component "badge" has no "usage" region in its stories ' +
        '(packages/shared/angular/src/lib/components/badge/' +
        'badge.component.stories.ts)',
    )
  })

  test('ignores a usage region that is never closed by a #endregion', () => {
    const finding = rule9(regionContext()).find((item) =>
      item.message.includes('"chip"'),
    )

    assert.ok(finding)
    assert.match(finding.message, /has no "usage" region in its stories/)
    assert.match(finding.message, /chip\/chip\.component\.stories\.ts/)
  })

  test('accepts a component when any of its stories files has the region', () => {
    const findings = rule9(regionContext())

    assert.ok(!findings.some((finding) => finding.message.includes('"tag"')))
  })

  test('reports every component without a usage region exactly once', () => {
    const findings = rule9(regionContext())

    assert.equal(findings.length, 2)
    assert.ok(findings.every((finding) => finding.rule === 'R9'))
    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule9(regionContext({ strict: true }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('raises the level to error when only R9 is strict', () => {
    const findings = rule9(regionContext({ strict: new Set(['R9']) }))

    assert.equal(findings.length, 2)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('stays a warning when only R1 is strict', () => {
    const findings = rule9(regionContext({ strict: new Set(['R1']) }))

    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('points at the component directory when no stories file exists', () => {
    const finding = rule9(context()).find((item) =>
      item.message.includes('"card"'),
    )

    assert.ok(finding.file.endsWith(path.join('components', 'card')))
  })

  test('points at the stories file when the region is the missing part', () => {
    const finding = rule9(regionContext()).find((item) =>
      item.message.includes('"badge"'),
    )

    assert.ok(finding.file.endsWith('badge.component.stories.ts'))
  })
})

describe('rule10 (skill references)', () => {
  test('accepts a page whose skill and title match an existing skill', () => {
    const findings = rule10(skillContext())

    assert.ok(!findings.some((finding) => /deploy/.test(finding.message)))
  })

  test('reports a "skill" frontmatter that names no plugin skill', () => {
    const finding = rule10(skillContext()).find((item) =>
      /ghost/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R10')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'docs/skills/ghost/page.md: skill "ghost" has no SKILL.md (expected ' +
        'packages/shared/claude-plugins/src/plugins/*/skills/ghost/' +
        'SKILL.md)',
    )
    assert.ok(finding.file.endsWith(path.join('ghost', 'page.md')))
  })

  test('resolves the skill of a page in whichever plugin ships it', () => {
    const findings = rule10(skillContext())

    assert.ok(
      !findings.some((finding) =>
        /skill "review" has no SKILL\.md/.test(finding.message),
      ),
    )
  })

  test('reports a page title that is not the name of its skill', () => {
    const finding = rule10(skillContext()).find((item) =>
      /review/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(
      finding.message,
      'docs/skills/review/page.md: title "Review" does not match the skill ' +
        'name "review"',
    )
  })

  test('reports a {% skill %} tag whose skill does not exist, with its line', () => {
    const finding = rule10(skillContext()).find((item) =>
      /"nope"/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R10')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'docs/guides/tags/page.md:6: unknown skill "nope" (source "plugin")',
    )
  })

  test('reports a tag whose source is not a known skill source', () => {
    const finding = rule10(skillContext()).find((item) =>
      /wiki/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(
      finding.message,
      'docs/guides/tags/page.md:8: unknown skill "commit" (source "wiki")',
    )
  })

  test('resolves a tag with source="repo" against .claude/skills', () => {
    const findings = rule10(skillContext())

    assert.ok(
      !findings.some((finding) =>
        finding.file.endsWith(path.join('contributing', 'commit', 'page.md')),
      ),
    )
  })

  test('ignores a page that documents no skill', () => {
    const findings = rule10(skillContext())

    assert.ok(
      !findings.some((finding) =>
        /^docs\/skills\/page\.md/.test(finding.message),
      ),
    )
  })

  test('reports every broken reference exactly once', () => {
    const findings = rule10(skillContext())

    assert.equal(findings.length, 4)
    assert.ok(findings.every((finding) => finding.rule === 'R10'))
    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule10(skillContext({ strict: true }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('raises the level to error when only R10 is strict', () => {
    const findings = rule10(skillContext({ strict: new Set(['R10']) }))

    assert.equal(findings.length, 4)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('stays a warning when only R1 is strict', () => {
    const findings = rule10(skillContext({ strict: new Set(['R1']) }))

    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })
})

describe('rule11 (fenced code blocks)', () => {
  test('reports a fence that declares no language, with its line', () => {
    const findings = rule11(fenceContext())

    assert.equal(findings.length, 1)
    assert.equal(findings[0].rule, 'R11')
    assert.equal(findings[0].level, 'error')
    assert.equal(
      findings[0].message,
      'docs/guides/fences/page.md:8: fenced code block has no language ' +
        '(use ```text for plain output)',
    )
    assert.ok(findings[0].file.endsWith(path.join('fences', 'page.md')))
  })

  test('accepts a fence that names its language', () => {
    const findings = rule11(fenceContext())

    assert.ok(!findings.some((finding) => /:14:/.test(finding.message)))
    assert.ok(!findings.some((finding) => /^page\.md/.test(finding.message)))
  })

  test('ignores a bare fence that is the content of another fence', () => {
    const findings = rule11(fenceContext())

    assert.ok(!findings.some((finding) => /:2[0-9]:/.test(finding.message)))
  })

  test('stays an error when no rule is strict', () => {
    const findings = rule11(fenceContext({ strict: new Set() }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('is unaffected by strict mode', () => {
    const findings = rule11(fenceContext({ strict: true }))

    assert.deepEqual(findings, rule11(fenceContext()))
  })
})

describe('rule12 (meta package coverage)', () => {
  test('accepts a package that one meta package aggregates', () => {
    const findings = rule12(metaContext())

    assert.ok(!findings.some((finding) => /"models"/.test(finding.message)))
  })

  test('reports a package that no meta package aggregates', () => {
    const finding = rule12(metaContext()).find((item) =>
      /"ghost"/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R12')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'Package "ghost" belongs to no meta package (add it to one of ' +
        'packages/meta/* or to the exclusions in check-rules.mjs)',
    )
    assert.equal(finding.file, path.join(metaRoot, 'packages'))
  })

  test('reports a package that two meta packages aggregate, naming both', () => {
    const finding = rule12(metaContext()).find((item) =>
      /"utils"/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R12')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'Package "utils" belongs to more than one meta package ' +
        '(angular-stack, core)',
    )
    assert.equal(
      finding.file,
      path.join(metaRoot, 'packages', 'meta', 'angular-stack', 'package.json'),
    )
  })

  test('accepts an excluded package that no meta package aggregates', () => {
    const findings = rule12(metaContext())

    assert.ok(!findings.some((finding) => /"fb"/.test(finding.message)))
  })

  test('reports an excluded package that a meta package aggregates anyway', () => {
    const finding = rule12(metaContext()).find((item) =>
      /"google"/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R12')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'Package "google" is excluded but also listed in meta package "core"',
    )
    assert.equal(
      finding.file,
      path.join(metaRoot, 'packages', 'meta', 'core', 'package.json'),
    )
  })

  test('never asks a meta package to belong to a meta package', () => {
    const findings = rule12(metaContext())

    assert.ok(
      !findings.some((finding) => /"angular-stack"/.test(finding.message)),
    )
    assert.ok(
      !findings.some((finding) => /"core" belongs/.test(finding.message)),
    )
  })

  test('reports every problem exactly once', () => {
    const findings = rule12(metaContext())

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.rule === 'R12'))
    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule12(metaContext({ strict: true }))

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('raises the level to error when only R12 is strict', () => {
    const findings = rule12(metaContext({ strict: new Set(['R12']) }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('stays a warning when only R1 is strict', () => {
    const findings = rule12(metaContext({ strict: new Set(['R1']) }))

    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('gives every excluded package a reason', () => {
    assert.ok(
      Object.values(PACKAGES_OUTSIDE_META).every(
        (reason) => typeof reason === 'string' && reason.length > 0,
      ),
    )
    assert.ok(Object.hasOwn(PACKAGES_OUTSIDE_META, 'claude-plugins'))
  })
})

describe('rule13 (usage tabs)', () => {
  test('accepts a component page whose tabs carry the three titles', () => {
    const findings = rule13(tabsContext())

    assert.ok(!findings.some((finding) => /good/.test(finding.message)))
  })

  test('reports a component page without a tabs block', () => {
    const finding = rule13(tabsContext()).find((item) =>
      /no-tabs/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R13')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'docs/components/no-tabs/page.md: the usage section has no ' +
        '{% tabs %} block',
    )
    assert.ok(finding.file.endsWith(path.join('no-tabs', 'page.md')))
  })

  test('reports a required tab title the block does not carry', () => {
    const finding = rule13(tabsContext()).find((item) =>
      /missing-tab/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R13')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'docs/components/missing-tab/page.md: usage tabs are missing ' +
        '"TypeScript"',
    )
  })

  test('reports a tab title that does not belong in the usage block', () => {
    const finding = rule13(tabsContext()).find((item) =>
      /extra-tab/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R13')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'docs/components/extra-tab/page.md: unexpected usage tab "Preview"',
    )
  })

  test('allows an "Nx generator" tab next to the three required ones', () => {
    const findings = rule13(tabsContext())

    assert.ok(!findings.some((finding) => /generator/.test(finding.message)))
  })

  test('ignores the components section index', () => {
    const findings = rule13(tabsContext())

    assert.ok(
      !findings.some((finding) =>
        /^docs\/components\/page\.md/.test(finding.message),
      ),
    )
  })

  test('ignores a tab title quoted inside a fenced code block', () => {
    const findings = rule13(tabsContext())

    assert.ok(!findings.some((finding) => /quoted/.test(finding.message)))
  })

  test('reports every problem exactly once', () => {
    const findings = rule13(tabsContext())

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.rule === 'R13'))
    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule13(tabsContext({ strict: true }))

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('raises the level to error when only R13 is strict', () => {
    const findings = rule13(tabsContext({ strict: new Set(['R13']) }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('stays a warning when only R1 is strict', () => {
    const findings = rule13(tabsContext({ strict: new Set(['R1']) }))

    assert.ok(findings.every((finding) => finding.level === 'warn'))
  })
})

describe('rule14 (example app paths cited by skills)', () => {
  const plugins = 'packages/shared/claude-plugins/src/plugins'

  test('accepts a cited file that exists, the app root and a directory with or without a trailing slash', () => {
    const findings = rule14(citedContext())

    assert.ok(
      !findings.some((finding) => /skills\/good\//.test(finding.message)),
    )
  })

  test('ignores backticked paths outside docs/examples/app', () => {
    const findings = rule14(citedContext())

    assert.ok(!findings.some((finding) => /nothing\.ts/.test(finding.message)))
  })

  test('reports a cited file that no longer exists, naming the skill file, the line and the path', () => {
    const finding = rule14(citedContext()).find((item) =>
      /moved\.ts/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R14')
    assert.equal(finding.level, 'error')
    assert.equal(
      finding.message,
      `${plugins}/smart-angular/skills/moved/SKILL.md:10: cited path ` +
        '"docs/examples/app/apps/web/src/app/moved.ts" does not exist ' +
        'under docs/examples/app',
    )
    assert.ok(finding.file.endsWith(path.join('moved', 'SKILL.md')))
  })

  test('scans the repository skills as well and strips the trailing slash', () => {
    const finding = rule14(citedContext()).find((item) =>
      /repo-skill/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(
      finding.message,
      '.claude/skills/repo-skill/SKILL.md:8: cited path ' +
        '"docs/examples/app/libs/model" does not exist under docs/examples/app',
    )
  })

  test('scans the skills a package keeps in its own .claude/skills', () => {
    const finding = rule14(citedContext()).find((item) =>
      /angular-patterns/.test(item.message),
    )

    assert.ok(finding)
    assert.equal(
      finding.message,
      'packages/shared/angular/.claude/skills/angular-patterns/SKILL.md:9: ' +
        'cited path "docs/examples/app/apps/web/src/app/gone.ts" does not ' +
        'exist under docs/examples/app',
    )
  })

  test('skips package skills below node_modules and dist', () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'check-r14-'))
    const skill = (dir) => {
      fs.mkdirSync(path.join(repoRoot, dir, 'cites'), { recursive: true })
      fs.writeFileSync(
        path.join(repoRoot, dir, 'cites', 'SKILL.md'),
        '# Cites\n\n`docs/examples/app/missing.ts`\n',
      )
    }

    skill('packages/lib/node_modules/dep/.claude/skills')
    skill('packages/lib/dist/.claude/skills')
    skill('packages/lib/.claude/skills')

    const findings = rule14({
      repoRoot,
      docsAppDir: path.join(repoRoot, 'docs', 'site', 'src', 'app'),
      strict: false,
    })

    assert.deepEqual(
      findings.map((finding) => finding.message.split(':')[0]),
      ['packages/lib/.claude/skills/cites/SKILL.md'],
    )
  })

  test('reports every missing path exactly once', () => {
    const findings = rule14(citedContext())

    assert.equal(findings.length, 3)
    assert.ok(findings.every((finding) => finding.rule === 'R14'))
  })

  test('is an error whether or not the run is strict', () => {
    for (const strict of [false, true, new Set(['R1'])]) {
      const findings = rule14(citedContext({ strict }))

      assert.ok(findings.every((finding) => finding.level === 'error'))
    }
  })

  test('reports nothing for the workspace skills of this repository', () => {
    const repoRoot = path.resolve(here, '..', '..', '..')
    const findings = rule14({
      repoRoot,
      docsAppDir: path.join(repoRoot, 'docs', 'site', 'src', 'app'),
      examplesRoot: path.join(repoRoot, 'docs', 'examples'),
      strict: false,
    })

    assert.deepEqual(findings, [])
  })
})

describe('tags inside a fenced code block', () => {
  test('R4 ignores a quoted {% snippet %} tag and reports the real one', () => {
    const findings = rule4(quotedContext())

    assert.equal(findings.length, 1)
    assert.equal(
      findings[0].message,
      'docs/guides/quoting/page.md:16: snippet file ' +
        '"node/src/quoted.example.ts" does not exist',
    )
  })

  test('R5 ignores a quoted {% storybook %} tag and reports the real one', () => {
    const findings = rule5(quotedContext())

    assert.equal(findings.length, 1)
    assert.equal(
      findings[0].message,
      'docs/guides/quoting/page.md:18: unknown story ' +
        '"components-quoted--playground" for project "angular"',
    )
  })

  test('R10 ignores a quoted {% skill %} tag and reports the real one', () => {
    const findings = rule10(quotedContext())

    assert.equal(findings.length, 1)
    assert.equal(
      findings[0].message,
      'docs/guides/quoting/page.md:20: unknown skill "quoted" ' +
        '(source "plugin")',
    )
  })
})

describe('rule16 (components agent catalogue)', () => {
  const agentContext = () => ({
    repoRoot: agentRoot,
    docsAppDir: path.join(agentRoot, 'docs', 'site', 'src', 'app'),
    strict: false,
  })

  test('accepts a component skill the agent names', () => {
    const findings = rule16(agentContext())

    assert.ok(!findings.some((finding) => /button/.test(finding.message)))
  })

  test('reports a component skill the agent never names, as an error', () => {
    const findings = rule16(agentContext())

    assert.equal(findings.length, 2)
    assert.ok(findings.every((finding) => finding.rule === 'R16'))
    assert.ok(findings.every((finding) => finding.level === 'error'))
    assert.equal(
      findings[0].message,
      'Skill "angular-components-icon" is not named in the angular-components agent ' +
        '(packages/shared/claude-plugins/src/plugins/smart-angular/agents/angular-components.md)',
    )
  })

  test('checks the react-components skills against the agent of smart-react', () => {
    const findings = rule16(agentContext())

    assert.equal(
      findings[1].message,
      'Skill "react-components-icon" is not named in the react-components agent ' +
        '(packages/shared/claude-plugins/src/plugins/smart-react/agents/react-components.md)',
    )
    assert.ok(
      !findings.some((finding) =>
        /react-components-button/.test(finding.message),
      ),
    )
  })

  test('has nothing to check without the agent', () => {
    assert.deepEqual(rule16(context()), [])
  })
})

describe('rule15 (usage examples)', () => {
  test('accepts a component with a usage template and class', () => {
    const findings = rule15(context())

    assert.ok(!findings.some((finding) => /"button"/.test(finding.message)))
  })

  test('reports a component without a usage example, naming both files', () => {
    const finding = rule15(context()).find((item) =>
      item.message.includes('"loader"'),
    )

    assert.equal(finding.rule, 'R15')
    assert.equal(finding.level, 'warn')
    assert.equal(
      finding.message,
      'Component "loader" has no usage example (expected ' +
        'docs/examples/angular/src/components/loader/usage.example.html and ' +
        'docs/examples/angular/src/components/loader/usage.example.ts)',
    )
  })

  test('raises the level to error in strict mode', () => {
    const findings = rule15(context({ strict: new Set(['R15']) }))

    assert.ok(findings.length > 0)
    assert.ok(findings.every((finding) => finding.level === 'error'))
  })
})

describe('rule18 (component parity)', () => {
  const plugins = 'packages/shared/claude-plugins/src/plugins'
  const messages = (ctx) => rule18(ctx).map((finding) => finding.message)

  test('reports a component the React library does not have', () => {
    const finding = rule18(parityContext()).find((item) =>
      item.message.startsWith('React component "drawer"'),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R18')
    assert.equal(finding.level, 'error')
    assert.equal(
      finding.message,
      'React component "drawer" is not in the library (expected a component ' +
        'in packages/shared/react/src/lib/components/drawer, exported from ' +
        'packages/shared/react/src/lib/components/index.ts)',
    )
    assert.equal(
      finding.file,
      path.join(parityRoot, 'packages/shared/react/src/lib/components/drawer'),
    )
  })

  test('reports a component without its React skill', () => {
    const finding = rule18(parityContext()).find((item) =>
      item.message.startsWith('React component "badge"'),
    )

    assert.ok(finding)
    assert.equal(finding.level, 'error')
    assert.equal(
      finding.message,
      'React component "badge" has no skill (expected ' +
        `${plugins}/smart-react/skills/react-components-badge/SKILL.md)`,
    )
    assert.equal(
      finding.file,
      path.join(
        parityRoot,
        `${plugins}/smart-react/skills/react-components-badge/SKILL.md`,
      ),
    )
  })

  test('reports a component without its Angular skill', () => {
    const found = messages(parityContext()).filter((message) =>
      message.includes('"loader"'),
    )

    assert.deepEqual(found, [
      'Angular component "loader" has no skill (expected ' +
        `${plugins}/smart-angular/skills/angular-components-loader/SKILL.md)`,
    ])
  })

  test('reports a React-only component without an exception on the Angular side', () => {
    const found = messages(parityContext()).filter((message) =>
      message.includes('"toast"'),
    )

    assert.deepEqual(found, [
      'Angular component "toast" is not in the library (expected a component ' +
        'in packages/shared/angular/src/lib/components/toast, exported from ' +
        'packages/shared/angular/src/lib/components/index.ts)',
      'Angular component "toast" has no skill (expected ' +
        `${plugins}/smart-angular/skills/angular-components-toast/SKILL.md)`,
    ])
  })

  test('accepts a component both libraries and both plugins have', () => {
    const findings = rule18(parityContext())

    assert.ok(!findings.some((finding) => /"button"/.test(finding.message)))
  })

  test('does not count a directory without a component file as a component', () => {
    const findings = rule18(parityContext())

    assert.ok(!findings.some((finding) => /"presets"/.test(finding.message)))
  })

  test('accepts a React-only component the exceptions allow', () => {
    const exempt = parityContext({
      parity: {
        components: { overlays: { only: 'react', reason: REASON } },
        api: {},
      },
    })

    assert.ok(messages(parityContext()).some((m) => m.includes('"overlays"')))
    assert.ok(!messages(exempt).some((m) => m.includes('"overlays"')))
  })

  test('reports an exception for a component both frameworks or neither have', () => {
    const stale = parityContext({
      parity: {
        components: {
          button: { only: 'react', reason: REASON },
          drawer: { only: 'angular', reason: REASON },
          ghost: { only: 'react', reason: REASON },
        },
        api: {},
      },
    })
    const findings = rule18(stale).filter((finding) =>
      /"(button|drawer|ghost)"/.test(finding.message),
    )

    assert.ok(findings.every((finding) => finding.level === 'error'))
    assert.deepEqual(
      findings.map((finding) => finding.message),
      [
        'Component exception "button" (React only) in ' +
          'docs/site/tools/framework-parity.mjs is stale: Angular has the ' +
          'component or its skill too (remove the entry)',
        'Component exception "drawer" (Angular only) in ' +
          'docs/site/tools/framework-parity.mjs is stale: React has the ' +
          'component or its skill too (remove the entry)',
        'React component "drawer" is not in the library (expected a ' +
          'component in packages/shared/react/src/lib/components/drawer, ' +
          'exported from packages/shared/react/src/lib/components/index.ts)',
        'Component exception "ghost" (React only) in ' +
          'docs/site/tools/framework-parity.mjs is stale: neither framework ' +
          'has the component or its skill (remove the entry)',
      ],
    )
    assert.equal(
      findings[0].file,
      path.join(parityRoot, 'docs/site/tools/framework-parity.mjs'),
    )
  })

  test('reports an exception without a reason or a framework, and ignores it', () => {
    const invalid = parityContext({
      parity: {
        components: {
          overlays: { only: 'vue', reason: REASON },
          toast: { only: 'react', reason: ' ' },
        },
        api: {},
      },
    })
    const found = messages(invalid)

    assert.ok(
      found.includes(
        'Component exception "overlays" in docs/site/tools/framework-parity.mjs ' +
          'names no framework ("only" is "angular" or "react")',
      ),
    )
    assert.ok(
      found.includes(
        'Component exception "toast" in docs/site/tools/framework-parity.mjs ' +
          'has no reason',
      ),
    )
    assert.ok(found.some((m) => m.startsWith('Angular component "toast"')))
  })

  test('reads the exceptions of framework-parity.mjs by default', () => {
    const found = messages(parityContext({ parity: undefined }))

    assert.ok(!found.some((m) => m.includes('"overlays"')))
    assert.ok(found.some((m) => /^Component exception "app" .* stale/.test(m)))
  })

  test('has nothing to compare in a workspace without the React library', () => {
    assert.deepEqual(rule18(context()), [])
  })
})

describe('rule19 (model API parity)', () => {
  const ngModels = 'packages/shared/angular/src/lib/models'
  const reactModels = 'packages/shared/react/src/lib/models'
  const about = (subject, ctx = apiContext()) =>
    rule19(ctx)
      .filter((finding) => finding.message.includes(`"${subject}`))
      .map((finding) => finding.message)

  test('reports a declaration one library exports and the other does not', () => {
    const findings = rule19(apiContext())
    const finding = findings.find((item) =>
      item.message.includes('"SmartPossibility"'),
    )

    assert.ok(finding)
    assert.equal(finding.rule, 'R19')
    assert.equal(finding.level, 'error')
    assert.equal(
      finding.message,
      'Declaration "SmartPossibility" is exported by the React models only ' +
        `(${reactModels}/interfaces.ts:1)`,
    )
    assert.equal(finding.file, path.join(apiRoot, reactModels, 'interfaces.ts'))
    assert.deepEqual(about('InputBaseComponentType'), [
      'Declaration "InputBaseComponentType" is exported by the Angular ' +
        `models only (${ngModels}/forward-types.ts:1)`,
    ])
  })

  test('reports a member one side of an interface declares and the other not', () => {
    assert.deepEqual(about('IButtonOptions.size'), [
      'Member "IButtonOptions.size" is declared in Angular only ' +
        `(${ngModels}/interfaces.ts:3)`,
    ])
  })

  test('matches an Angular member ending in $ with the React member without it', () => {
    assert.deepEqual(about('IButtonOptions.disabled'), [])
  })

  test('reports a member that is optional on one side and required on the other', () => {
    assert.deepEqual(about('IButtonOptions.label'), [
      'Member "IButtonOptions.label" is optional in Angular ' +
        `(${ngModels}/interfaces.ts:2) but required in React ` +
        `(${reactModels}/interfaces.ts:6)`,
    ])
  })

  test('reports a type alias whose literals differ', () => {
    assert.deepEqual(about('SmartModalVariant'), [
      `Type "SmartModalVariant" allows 'fullscreen' in React only ` +
        `(${ngModels}/interfaces.ts:8, ${reactModels}/interfaces.ts:11)`,
    ])
  })

  test('reports an interface member whose literals differ', () => {
    assert.deepEqual(about('IButtonOptions.type'), [
      `Member "IButtonOptions.type" allows 'reset' in React only ` +
        `(${ngModels}/interfaces.ts:5, ${reactModels}/interfaces.ts:8)`,
    ])
  })

  test('reports a member that is a union of literals on one side only', () => {
    assert.deepEqual(about('ITableOptions.density'), [
      'Member "ITableOptions.density" is a union of literals in Angular but ' +
        `not in React (${ngModels}/interfaces.ts:24, ` +
        `${reactModels}/interfaces.ts:27)`,
    ])
  })

  test('reports a declaration that is of another kind on the other side', () => {
    assert.deepEqual(about('ISortState'), [
      'Declaration "ISortState" is an interface in Angular ' +
        `(${ngModels}/interfaces.ts:19) but a type alias in React ` +
        `(${reactModels}/interfaces.ts:22)`,
    ])
  })

  test('reports an enum whose members differ', () => {
    assert.deepEqual(about('SmartColumnType'), [
      'Enum "SmartColumnType" has Number in Angular only and Date in React ' +
        `only (${ngModels}/interfaces.ts:14, ${reactModels}/interfaces.ts:17)`,
    ])
  })

  test('compares the component types both components trees export by name', () => {
    assert.deepEqual(about('IModalActionClick'), [
      'Member "IModalActionClick.close" is declared in React only ' +
        '(packages/shared/react/src/lib/components/modal/modal.types.ts:3)',
    ])
  })

  test('skips spec files and accepts a component type only one side exports', () => {
    assert.deepEqual(about('IModalHarness'), [])
    assert.deepEqual(about('SmartModalProps'), [])
    assert.deepEqual(about('ModalSize'), [])
  })

  test('reports every difference exactly once, as errors', () => {
    for (const strict of [false, true]) {
      const findings = rule19(apiContext({ strict }))

      assert.equal(findings.length, 10)
      assert.ok(findings.every((finding) => finding.rule === 'R19'))
      assert.ok(findings.every((finding) => finding.level === 'error'))
    }
  })

  test('accepts the differences the exceptions allow, by name and by member', () => {
    const exempt = apiContext({
      parity: {
        components: {},
        api: {
          SmartPossibility: { only: 'react', reason: REASON },
          'IButtonOptions.size': { only: 'angular', reason: REASON },
          'IButtonOptions.label': { reason: REASON },
          SmartModalVariant: { reason: REASON },
          ITableOptions: { reason: REASON },
        },
      },
    })

    for (const subject of [
      'SmartPossibility',
      'IButtonOptions.size',
      'IButtonOptions.label',
      'SmartModalVariant',
      'ITableOptions',
    ]) {
      assert.deepEqual(about(subject, exempt), [], subject)
    }
    assert.equal(rule19(exempt).length, 5)
  })

  test('reports an exception that allows nothing any more', () => {
    const stale = apiContext({
      parity: {
        components: {},
        api: {
          IGhost: { only: 'react', reason: REASON },
          'IButtonOptions.ghost$': { reason: REASON },
          IListOptions: { reason: REASON },
          SmartPossibility: { only: 'angular', reason: REASON },
        },
      },
    })
    const parity = 'docs/site/tools/framework-parity.mjs'
    const findings = rule19(stale).filter((finding) =>
      finding.message.startsWith('API exception'),
    )

    assert.deepEqual(
      findings.map((finding) => finding.message),
      [
        `API exception "IButtonOptions.ghost$" in ${parity} is stale: ` +
          'neither library declares it (remove the entry)',
        `API exception "IGhost" (React only) in ${parity} is stale: ` +
          'neither library declares it (remove the entry)',
        `API exception "IListOptions" in ${parity} is stale: the two ` +
          'libraries agree on it (remove the entry)',
        `API exception "SmartPossibility" (Angular only) in ${parity} is ` +
          'stale: only React declares it (remove the entry)',
      ],
    )
    assert.ok(findings.every((finding) => finding.level === 'error'))
    assert.equal(findings[0].file, path.join(apiRoot, parity))
    assert.equal(about('SmartPossibility', stale).length, 2)
  })

  test('reports an exception without a reason or a framework, and ignores it', () => {
    const invalid = apiContext({
      parity: {
        components: {},
        api: {
          SmartPossibility: { only: 'react' },
          SmartModalVariant: { only: 'vue', reason: REASON },
        },
      },
    })

    assert.deepEqual(about('SmartPossibility', invalid), [
      'Declaration "SmartPossibility" is exported by the React models only ' +
        `(${reactModels}/interfaces.ts:1)`,
      'API exception "SmartPossibility" in ' +
        'docs/site/tools/framework-parity.mjs has no reason',
    ])
    assert.deepEqual(about('SmartModalVariant', invalid), [
      `Type "SmartModalVariant" allows 'fullscreen' in React only ` +
        `(${ngModels}/interfaces.ts:8, ${reactModels}/interfaces.ts:11)`,
      'API exception "SmartModalVariant" in ' +
        'docs/site/tools/framework-parity.mjs names no framework ' +
        '("only" is "angular" or "react")',
    ])
  })

  test('reads the exceptions of framework-parity.mjs by default', () => {
    const findings = rule19(apiContext({ parity: undefined }))

    assert.deepEqual(
      about('SmartPossibility', apiContext({ parity: undefined })),
      [],
    )
    assert.deepEqual(
      findings
        .filter((finding) => finding.message.startsWith('API exception'))
        .map((finding) => finding.message.split(' (')[0]),
      [
        'API exception "InputComponentType"',
        'API exception "SmartSubscribable"',
      ],
    )
  })

  test('has nothing to compare in a workspace without the React library', () => {
    assert.deepEqual(rule19(context()), [])
  })
})

describe('framework-parity.mjs', () => {
  const valid = (entry, required) =>
    (required || entry.only !== undefined
      ? ['angular', 'react'].includes(entry.only)
      : true) &&
    typeof entry.reason === 'string' &&
    entry.reason.trim().length > 0

  test('gives every component exception a framework and a reason', () => {
    assert.ok(Object.values(COMPONENT_EXCEPTIONS).every((e) => valid(e, true)))
    assert.deepEqual(Object.keys(COMPONENT_EXCEPTIONS).sort(), [
      'app',
      'overlays',
    ])
  })

  test('gives every API exception a reason', () => {
    assert.ok(Object.values(API_EXCEPTIONS).every((e) => valid(e, false)))
  })
})

describe('the union inventory of both libraries', () => {
  const about = (findings, name) =>
    findings
      .filter((finding) => finding.message.includes(`"${name}"`))
      .map((finding) => finding.message)

  test('rule9 checks the story of a React-only component in React only', () => {
    assert.deepEqual(about(rule9(parityContext()), 'toast'), [
      'React component "toast" has no Storybook story (expected a ' +
        '*.stories.tsx under packages/shared/react/src/lib/components/toast ' +
        'with a "usage" region)',
    ])
  })

  test('rule15 asks a React-only component for its React usage example only', () => {
    assert.deepEqual(about(rule15(parityContext()), 'toast'), [
      'React component "toast" has no usage example (expected ' +
        'docs/examples/react/src/components/toast/usage.example.tsx)',
    ])
  })

  test('keeps the levels of R9 and R15 for a React-only component', () => {
    const strict = parityContext({ strict: new Set(['R9']) })

    assert.ok(rule9(strict).every((finding) => finding.level === 'error'))
    assert.ok(rule15(strict).every((finding) => finding.level === 'warn'))
  })

  test('rule9 and rule15 skip a component the exceptions let one framework ship alone', () => {
    const exempt = parityContext({
      parity: {
        components: { toast: { only: 'react', reason: REASON } },
        api: {},
      },
    })

    assert.deepEqual(about(rule9(exempt), 'toast'), [])
    assert.deepEqual(about(rule15(exempt), 'toast'), [])
    assert.ok(about(rule9(exempt), 'loader').length > 0)
  })
})

describe('runAllRules', () => {
  test('concatenates the findings of every rule, in rule order', () => {
    const findings = runAllRules(context())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      [
        'R1',
        'R2',
        'R3',
        'R4',
        'R5',
        'R6',
        'R7',
        'R8',
        'R9',
        'R12',
        'R13',
        'R15',
      ],
    )
    assert.equal(findings.length, 27)
  })

  test('runs R10 after R9', () => {
    const findings = runAllRules(skillContext())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R10'],
    )
    assert.equal(findings.length, 4)
  })

  test('runs R11 after R10', () => {
    const findings = runAllRules(fenceContext())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R11'],
    )
    assert.equal(findings.length, 1)
  })

  test('runs R12 after R11', () => {
    const findings = runAllRules(metaContext())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R1', 'R12'],
    )
    assert.equal(findings.filter((finding) => finding.rule === 'R12').length, 3)
  })

  test('runs R13 after R12', () => {
    const findings = runAllRules(tabsContext())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R13'],
    )
    assert.equal(findings.length, 3)
  })

  test('runs R14 after R13', () => {
    const findings = runAllRules(citedContext())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R14'],
    )
    assert.equal(findings.length, 3)
  })

  test('runs R18 after R17, as errors without --strict', () => {
    const findings = runAllRules(parityContext())
    const r18 = findings.filter((finding) => finding.rule === 'R18')

    assert.equal(findings.at(-1).rule, 'R18')
    assert.deepEqual(r18, rule18(parityContext()))
    assert.ok(r18.every((finding) => finding.level === 'error'))
  })

  test('runs R19 after R18, as errors without --strict', () => {
    const findings = runAllRules(apiContext())
    const r19 = findings.filter((finding) => finding.rule === 'R19')

    assert.equal(findings.at(-1).rule, 'R19')
    assert.deepEqual(r19, rule19(apiContext()))
    assert.ok(r19.every((finding) => finding.level === 'error'))
  })

  test('turns parity warnings into errors in strict mode', () => {
    const findings = runAllRules(context({ strict: true }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })

  test('keeps the rules outside a partial strict set as warnings', () => {
    const findings = runAllRules(context({ strict: new Set(['R1']) }))
    const levels = (rule) =>
      findings
        .filter((finding) => finding.rule === rule)
        .map((finding) => finding.level)

    assert.deepEqual(levels('R1'), ['error'])
    assert.deepEqual(levels('R2'), ['warn', 'warn'])
    assert.deepEqual(levels('R3'), ['warn'])
    assert.deepEqual(levels('R9'), ['warn', 'warn'])
  })
})

describe('the React library', () => {
  test('storyInventory reads .stories.tsx files as the react project', () => {
    const stories = storyInventory(reactRoot).filter(
      (story) => story.project === 'react',
    )

    assert.deepEqual(
      stories.map((story) => story.id),
      ['components-badge--playground', 'components-chip--playground'],
    )
  })

  test('rule9 reports a React story without a usage region', () => {
    const findings = rule9(reactContext())

    assert.deepEqual(
      findings.map((finding) => finding.message),
      [
        'React component "chip" has no "usage" region in its stories ' +
          '(packages/shared/react/src/lib/components/chip/chip.stories.tsx)',
      ],
    )
  })

  test('rule13 requires the TSX tab on a page with a React variant', () => {
    const findings = rule13(reactContext())

    assert.deepEqual(
      findings.map((finding) => finding.message),
      ['docs/components/chip/page.md: usage tabs are missing "TSX"'],
    )
  })

  test('rule15 reports a React component without its .tsx usage example', () => {
    const findings = rule15(reactContext())

    assert.deepEqual(
      findings.map((finding) => finding.message),
      [
        'React component "chip" has no usage example (expected ' +
          'docs/examples/react/src/components/chip/usage.example.tsx)',
      ],
    )
  })
})
