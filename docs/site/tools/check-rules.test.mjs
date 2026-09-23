import assert from 'node:assert/strict'
import path from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  componentInventory,
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
  runAllRules,
  skillInventory,
  storyInventory,
} from './check-rules.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.join(here, '__fixtures__', 'check')
const regionRoot = path.join(here, '__fixtures__', 'check-r9')
const skillRoot = path.join(here, '__fixtures__', 'check-r10')
const fenceRoot = path.join(here, '__fixtures__', 'check-r11')
const metaRoot = path.join(here, '__fixtures__', 'check-r12')
const tabsRoot = path.join(here, '__fixtures__', 'check-r13')
const citedRoot = path.join(here, '__fixtures__', 'check-r14')
const quotedRoot = path.join(here, '__fixtures__', 'check-fenced')

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
  test('keeps only skills marked user-invocable and tags their source', () => {
    const skills = skillInventory(fixtureRoot)

    assert.deepEqual(skills, [
      { name: 'audit-log', source: 'plugin' },
      { name: 'commit', source: 'repo' },
      { name: 'format-code', source: 'plugin' },
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

  test('accepts a repo skill documented under docs/contributing', () => {
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
        'packages/shared/claude-plugins/src/plugins/smart/skills/ghost/' +
        'SKILL.md)',
    )
    assert.ok(finding.file.endsWith(path.join('ghost', 'page.md')))
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
  const pluginSkills = 'packages/shared/claude-plugins/src/plugins/smart/skills'

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
      `${pluginSkills}/moved/SKILL.md:10: cited path ` +
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

  test('reports every missing path exactly once', () => {
    const findings = rule14(citedContext())

    assert.equal(findings.length, 2)
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

describe('runAllRules', () => {
  test('concatenates the findings of every rule, in rule order', () => {
    const findings = runAllRules(context())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R12', 'R13'],
    )
    assert.equal(findings.length, 25)
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
    assert.equal(findings.length, 2)
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
