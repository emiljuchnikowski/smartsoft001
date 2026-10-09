import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { test } from 'node:test'
import * as url from 'node:url'

import {
  expandSkillTags,
  parseSkillTag,
  readSkillMeta,
  renderSkillHeader,
  repoSkillDirs,
} from './skills.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const fixtures = path.join(__dirname, '__fixtures__', 'skills')
const repoRoot = path.join(fixtures, 'repo')
const plugins = path.join(
  repoRoot,
  'packages',
  'shared',
  'claude-plugins',
  'src',
  'plugins',
)
const pluginSkills = path.join(plugins, 'smart-core', 'skills')

/** `assert.throws` matches a regexp against `String(error)`, so check the message. */
function isSkillError(...expectedParts) {
  return (error) => {
    assert.ok(error instanceof Error)
    assert.match(error.message, /^\[skill\] /)
    for (const part of expectedParts) {
      assert.ok(
        error.message.includes(part),
        `expected ${JSON.stringify(error.message)} to mention ${JSON.stringify(part)}`,
      )
    }
    return true
  }
}

test('readSkillMeta reads a plugin skill with comma separated allowed tools', () => {
  const meta = readSkillMeta({ repoRoot, name: 'audit-log', source: 'plugin' })

  assert.deepEqual(meta, {
    name: 'audit-log',
    source: 'plugin',
    plugin: 'smart-core',
    description: 'Query and analyze Claude Code audit logs',
    userInvocable: true,
    allowedTools: ['Bash', 'Read', 'Grep', 'Glob'],
    file: path.join(pluginSkills, 'audit-log', 'SKILL.md'),
    relativePath:
      'packages/shared/claude-plugins/src/plugins/smart-core/skills/audit-log/SKILL.md',
  })
})

test('readSkillMeta reads a repo skill with a YAML list of allowed tools', () => {
  const meta = readSkillMeta({ repoRoot, name: 'plan', source: 'repo' })

  assert.deepEqual(meta, {
    name: 'plan',
    source: 'repo',
    plugin: null,
    description: 'Create an implementation plan | save it to Linear',
    userInvocable: false,
    allowedTools: ['Bash', 'Read', 'Write'],
    file: path.join(repoRoot, '.claude', 'skills', 'plan', 'SKILL.md'),
    relativePath: '.claude/skills/plan/SKILL.md',
  })
})

test('readSkillMeta finds a repo skill kept in the .claude/skills of a package', () => {
  const meta = readSkillMeta({
    repoRoot,
    name: 'react-patterns',
    source: 'repo',
  })

  assert.equal(meta.plugin, null)
  assert.equal(
    meta.relativePath,
    'packages/shared/react/.claude/skills/react-patterns/SKILL.md',
  )
})

test('repoSkillDirs lists the root skills first, then every package that has some', () => {
  assert.deepEqual(repoSkillDirs(repoRoot), [
    '.claude/skills',
    'packages/shared/react/.claude/skills',
  ])
})

test('readSkillMeta finds a plugin skill in whichever plugin ships it', () => {
  const meta = readSkillMeta({ repoRoot, name: 'scaffold-nx-workspace' })

  assert.equal(meta.plugin, 'smart-angular')
  assert.equal(
    meta.file,
    path.join(
      plugins,
      'smart-angular',
      'skills',
      'scaffold-nx-workspace',
      'SKILL.md',
    ),
  )
})

test('readSkillMeta defaults to no allowed tools and not user invocable', () => {
  const meta = readSkillMeta({ repoRoot, name: 'bare', source: 'plugin' })

  assert.deepEqual(meta.allowedTools, [])
  assert.equal(meta.userInvocable, false)
})

test('readSkillMeta defaults the source to the plugin skills', () => {
  const meta = readSkillMeta({ repoRoot, name: 'audit-log' })

  assert.equal(meta.source, 'plugin')
})

test('readSkillMeta throws when the SKILL.md does not exist', () => {
  assert.throws(
    () => readSkillMeta({ repoRoot, name: 'ghost', source: 'plugin' }),
    isSkillError(
      '"ghost"',
      'does not exist',
      'packages/shared/claude-plugins/src/plugins/*/skills/ghost/SKILL.md',
    ),
  )
})

test('readSkillMeta throws when the frontmatter has no description', () => {
  assert.throws(
    () => readSkillMeta({ repoRoot, name: 'nameless', source: 'plugin' }),
    isSkillError('"nameless"', '"description"'),
  )
})

test('readSkillMeta throws for an unknown source', () => {
  assert.throws(
    () => readSkillMeta({ repoRoot, name: 'audit-log', source: 'elsewhere' }),
    isSkillError('unknown source "elsewhere"', '"plugin"', '"repo"'),
  )
})

test('parseSkillTag reads the name and defaults the source to plugin', () => {
  const attributes = parseSkillTag('{% skill name="audit-log" /%}')

  assert.deepEqual(attributes, { name: 'audit-log', source: 'plugin' })
})

test('parseSkillTag accepts any attribute order and single quotes', () => {
  const attributes = parseSkillTag("{% skill source='repo' name='plan' /%}")

  assert.deepEqual(attributes, { name: 'plan', source: 'repo' })
})

test('parseSkillTag throws when the name is missing', () => {
  assert.throws(
    () => parseSkillTag('{% skill source="repo" /%}'),
    isSkillError('has no "name" attribute'),
  )
})

test('parseSkillTag throws for an unknown source', () => {
  assert.throws(
    () => parseSkillTag('{% skill name="plan" source="elsewhere" /%}'),
    isSkillError('unknown source "elsewhere"'),
  )
})

test('renderSkillHeader renders a plugin skill', () => {
  const meta = readSkillMeta({ repoRoot, name: 'audit-log', source: 'plugin' })

  const result = renderSkillHeader(meta)

  assert.equal(
    result,
    [
      '{% callout title="/smart-core:audit-log" %}',
      'Query and analyze Claude Code audit logs',
      '{% /callout %}',
      '',
      '| Invocation | Allowed tools | Source |',
      '| --- | --- | --- |',
      '| `/smart-core:audit-log` | `Bash`, `Read`, `Grep`, `Glob` | ' +
        '[`SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/' +
        'packages/shared/claude-plugins/src/plugins/smart-core/skills/audit-log/SKILL.md) |',
    ].join('\n'),
  )
})

test('renderSkillHeader prefixes a skill with the plugin that ships it', () => {
  const meta = readSkillMeta({ repoRoot, name: 'scaffold-nx-workspace' })

  const result = renderSkillHeader(meta)

  assert.ok(
    result.includes(
      '{% callout title="/smart-angular:scaffold-nx-workspace" %}',
    ),
  )
  assert.ok(
    result.includes(
      '| `/smart-angular:scaffold-nx-workspace` | `Bash` | ' +
        '[`SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/' +
        'packages/shared/claude-plugins/src/plugins/smart-angular/skills/' +
        'scaffold-nx-workspace/SKILL.md) |',
    ),
  )
})

test('renderSkillHeader renders a repo skill without a plugin prefix', () => {
  const meta = readSkillMeta({ repoRoot, name: 'plan', source: 'repo' })

  const result = renderSkillHeader(meta)

  assert.equal(
    result,
    [
      '{% callout title="/plan" %}',
      'Create an implementation plan \\| save it to Linear',
      '{% /callout %}',
      '',
      '| Invocation | Allowed tools | Source |',
      '| --- | --- | --- |',
      '| `/plan` | `Bash`, `Read`, `Write` | ' +
        '[`SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/' +
        '.claude/skills/plan/SKILL.md) |',
    ].join('\n'),
  )
})

test('renderSkillHeader links a package skill where it lives', () => {
  const meta = readSkillMeta({
    repoRoot,
    name: 'react-patterns',
    source: 'repo',
  })

  const result = renderSkillHeader(meta)

  assert.ok(
    result.includes(
      '| `/react-patterns` | `Read` | ' +
        '[`SKILL.md`](https://github.com/emiljuchnikowski/smartsoft001/blob/main/' +
        'packages/shared/react/.claude/skills/react-patterns/SKILL.md) |',
    ),
  )
})

test('renderSkillHeader prints an em dash when the skill allows no tools', () => {
  const meta = readSkillMeta({ repoRoot, name: 'bare', source: 'plugin' })

  const result = renderSkillHeader(meta)

  assert.match(result, /\| `\/smart-core:bare` \| — \| /)
})

test('expandSkillTags replaces the tag lines and leaves the page untouched', () => {
  const source = fs.readFileSync(path.join(fixtures, 'page.md'), 'utf8')

  const result = expandSkillTags(source, { repoRoot })

  const expected = source
    .replace(
      '{% skill name="audit-log" /%}',
      renderSkillHeader(readSkillMeta({ repoRoot, name: 'audit-log' })),
    )
    .replace(
      '{% skill source="repo" name="plan" /%}',
      renderSkillHeader(
        readSkillMeta({ repoRoot, name: 'plan', source: 'repo' }),
      ),
    )
  assert.equal(result, expected)
})

test('expandSkillTags keeps a tag that is not alone on its line', () => {
  const source = 'const notATag = \'{% skill name="audit-log" /%}\'\n'

  const result = expandSkillTags(source, { repoRoot })

  assert.equal(result, source)
})

test('expandSkillTags reports every SKILL.md as a dependency', () => {
  const source = fs.readFileSync(path.join(fixtures, 'page.md'), 'utf8')
  const dependencies = []

  expandSkillTags(source, {
    repoRoot,
    onDependency: (f) => dependencies.push(f),
  })

  assert.deepEqual(dependencies, [
    path.join(pluginSkills, 'audit-log', 'SKILL.md'),
    path.join(repoRoot, '.claude', 'skills', 'plan', 'SKILL.md'),
  ])
})

test('expandSkillTags throws for an unknown skill', () => {
  assert.throws(
    () => expandSkillTags('{% skill name="ghost" /%}\n', { repoRoot }),
    isSkillError('"ghost"', 'does not exist'),
  )
})

test('expandSkillTags leaves a tag inside a fenced code block untouched', () => {
  const source = [
    '```markdown',
    '{% skill name="audit-log" /%}',
    '```',
    '',
    '{% skill name="audit-log" /%}',
  ].join('\n')

  const result = expandSkillTags(source, { repoRoot })

  assert.equal(result.split('\n')[1], '{% skill name="audit-log" /%}')
  assert.ok(result.includes('{% callout title="/smart-core:audit-log" %}'))
})

test('expandSkillTags does not resolve a quoted tag that names a missing skill', () => {
  const source = ['~~~markdown', '{% skill name="gone" /%}', '~~~'].join('\n')

  const result = expandSkillTags(source, { repoRoot })

  assert.equal(result, source)
})
