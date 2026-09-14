import assert from 'node:assert/strict'
import path from 'node:path'
import { describe, test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  componentInventory,
  packageInventory,
  rule1,
  rule2,
  rule3,
  rule4,
  rule5,
  rule6,
  rule7,
  runAllRules,
  skillInventory,
  storyInventory,
} from './check-rules.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const fixtureRoot = path.join(here, '__fixtures__', 'check')

function context(overrides = {}) {
  return {
    repoRoot: fixtureRoot,
    docsAppDir: path.join(fixtureRoot, 'docs', 'site', 'src', 'app'),
    examplesRoot: path.join(fixtureRoot, 'docs', 'examples'),
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

    assert.equal(findings.length, 1)
    assert.equal(findings[0].rule, 'R6')
    assert.equal(findings[0].level, 'error')
    assert.match(findings[0].message, /components\/button\/page\.md:8/)
    assert.match(findings[0].message, /ts/)
  })

  test('ignores pages outside the packages and components sections', () => {
    const findings = rule6(context())

    assert.ok(!findings.some((finding) => finding.file.includes('guides')))
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

describe('runAllRules', () => {
  test('concatenates the findings of every rule, in rule order', () => {
    const findings = runAllRules(context())

    assert.deepEqual(
      [...new Set(findings.map((finding) => finding.rule))],
      ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'],
    )
    assert.equal(findings.length, 14)
  })

  test('turns parity warnings into errors in strict mode', () => {
    const findings = runAllRules(context({ strict: true }))

    assert.ok(findings.every((finding) => finding.level === 'error'))
  })
})
