import assert from 'node:assert/strict'
import * as path from 'node:path'
import { test } from 'node:test'
import * as url from 'node:url'

import {
  expandSnippets,
  extractRegion,
  languageFor,
  resolveSnippetPath,
} from './snippets.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const fixtures = path.join(__dirname, '__fixtures__', 'snippets')
const examplesRoot = path.join(fixtures, 'examples')
const repoRoot = fixtures
const pagePath = '/repo/docs/site/src/app/guide/page.md'

const options = { pagePath, examplesRoot, repoRoot }

/** `assert.throws` matches a regexp against `String(error)`, so check the message. */
function isSnippetError(...expectedParts) {
  return (error) => {
    assert.ok(error instanceof Error)
    assert.match(error.message, /^\[snippet\] /)
    for (const part of expectedParts) {
      assert.ok(
        error.message.includes(part),
        `expected ${JSON.stringify(error.message)} to mention ${JSON.stringify(part)}`,
      )
    }
    return true
  }
}

test('expandSnippets renders a region as a fenced block in the file language', () => {
  const source = '{% snippet file="basic.ts" region="service" /%}'

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    [
      '```ts',
      '@Injectable()',
      'export class DemoService {',
      '  run() {',
      '    return 42',
      '  }',
      '}',
      '```',
    ].join('\n'),
  )
})

test('expandSnippets dedents the region by its common indentation', () => {
  const source = '{% snippet file="indented.ts" region="inner" /%}'

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    [
      '```ts',
      'value = 1',
      '',
      'compute() {',
      '  return this.value',
      '}',
      '```',
    ].join('\n'),
  )
})

test('expandSnippets inlines the whole file with all markers removed when no region is given', () => {
  const source = '{% snippet file="basic.ts" /%}'

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    [
      '```ts',
      "import { Injectable } from '@angular/core'",
      '',
      '@Injectable()',
      'export class DemoService {',
      '  run() {',
      '    return 42',
      '  }',
      '}',
      '',
      'export const other = 1',
      '```',
    ].join('\n'),
  )
})

test('expandSnippets understands HTML comment markers', () => {
  const source = '{% snippet file="widget.html" region="markup" /%}'

  const result = expandSnippets(source, options)

  assert.equal(result, ['```html', '<p>Hello</p>', '```'].join('\n'))
})

test('expandSnippets keeps inner marker lines out of an outer region', () => {
  const source = '{% snippet file="nested.ts" region="outer" /%}'

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    ['```ts', 'const a = 1', 'const b = 2', 'const c = 3', '```'].join('\n'),
  )
})

test('expandSnippets extracts an inner region of a nested pair', () => {
  const source = '{% snippet file="nested.ts" region="inner" /%}'

  const result = expandSnippets(source, options)

  assert.equal(result, ['```ts', 'const b = 2', '```'].join('\n'))
})

test('expandSnippets honours the lang attribute over the extension', () => {
  const source =
    '{% snippet file="basic.ts" region="service" lang="typescript" /%}'

  const result = expandSnippets(source, options)

  assert.match(result, /^```typescript\n/)
})

test('expandSnippets accepts any attribute order, quote style and whitespace', () => {
  const source = "{%   snippet   region='service'    file='basic.ts'   /%}"

  const result = expandSnippets(source, options)

  assert.match(result, /^```ts\n@Injectable\(\)/)
})

test('expandSnippets replaces every tag and leaves the surrounding markdown alone', () => {
  const source = [
    '# Title',
    '',
    '{% snippet file="basic.ts" region="service" /%}',
    '',
    'Some prose.',
    '',
    '{% snippet file="widget.html" region="markup" /%}',
    '',
    'The end.',
  ].join('\n')

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    [
      '# Title',
      '',
      '```ts',
      '@Injectable()',
      'export class DemoService {',
      '  run() {',
      '    return 42',
      '  }',
      '}',
      '```',
      '',
      'Some prose.',
      '',
      '```html',
      '<p>Hello</p>',
      '```',
      '',
      'The end.',
    ].join('\n'),
  )
})

test('expandSnippets leaves other Markdoc tags untouched', () => {
  const source = [
    '{% callout title="Note" %}',
    'Body',
    '{% /callout %}',
    '',
    '{% quick-link title="A" href="/b" /%}',
  ].join('\n')

  const result = expandSnippets(source, options)

  assert.equal(result, source)
})

test('expandSnippets resolves a packages/ path against the repo root', () => {
  const source = [
    '{% snippet file="packages/shared/utils/src/sample.ts" region="hash" /%}',
  ].join('\n')

  const result = expandSnippets(source, options)

  assert.equal(
    result,
    [
      '```ts',
      'export function hash(value: string): string {',
      '  return value',
      '}',
      '```',
    ].join('\n'),
  )
})

test('expandSnippets reports the page, the file and the absolute path when the file is missing', () => {
  const source = '{% snippet file="nope.ts" /%}'

  assert.throws(
    () => expandSnippets(source, options),
    isSnippetError(pagePath, 'nope.ts', path.join(examplesRoot, 'nope.ts')),
  )
})

test('expandSnippets reports the page, the file and the region when the region is missing', () => {
  const source = '{% snippet file="basic.ts" region="ghost" /%}'

  assert.throws(
    () => expandSnippets(source, options),
    isSnippetError(pagePath, 'basic.ts', 'ghost'),
  )
})

test('expandSnippets rejects a path escaping the roots', () => {
  const source = '{% snippet file="../../../../etc/passwd" /%}'

  assert.throws(
    () => expandSnippets(source, options),
    isSnippetError('../../../../etc/passwd'),
  )
})

test('expandSnippets reports every referenced file once to onDependency', () => {
  const dependencies = []
  const source = [
    '{% snippet file="basic.ts" region="service" /%}',
    '{% snippet file="basic.ts" /%}',
    '{% snippet file="widget.html" region="markup" /%}',
  ].join('\n\n')

  expandSnippets(source, {
    ...options,
    onDependency: (file) => dependencies.push(file),
  })

  assert.deepEqual(dependencies, [
    path.join(examplesRoot, 'basic.ts'),
    path.join(examplesRoot, 'widget.html'),
  ])
})

test('resolveSnippetPath resolves against the examples root by default', () => {
  const result = resolveSnippetPath('basic.ts', { examplesRoot, repoRoot })

  assert.equal(result, path.join(examplesRoot, 'basic.ts'))
})

test('resolveSnippetPath resolves a packages/ path against the repo root', () => {
  const result = resolveSnippetPath('packages/shared/utils/src/sample.ts', {
    examplesRoot,
    repoRoot,
  })

  assert.equal(
    result,
    path.join(repoRoot, 'packages/shared/utils/src/sample.ts'),
  )
})

test('resolveSnippetPath throws when the path escapes its root', () => {
  assert.throws(
    () => resolveSnippetPath('../secrets.ts', { examplesRoot, repoRoot }),
    isSnippetError('../secrets.ts'),
  )
  assert.throws(
    () =>
      resolveSnippetPath('packages/../../secrets.ts', {
        examplesRoot,
        repoRoot,
      }),
    isSnippetError('packages/../../secrets.ts'),
  )
  assert.throws(
    () => resolveSnippetPath('/etc/passwd', { examplesRoot, repoRoot }),
    isSnippetError('/etc/passwd'),
  )
})

test('extractRegion trims trailing blank lines', () => {
  const content = ['// #region a', 'const x = 1', '', '', '// #endregion'].join(
    '\n',
  )

  assert.equal(extractRegion(content, 'a'), 'const x = 1')
})

test('extractRegion returns the whole file without markers when no region is given', () => {
  const content = ['// #region a', 'const x = 1', '// #endregion'].join('\n')

  assert.equal(extractRegion(content, undefined), 'const x = 1')
})

test('extractRegion throws when the region is unknown', () => {
  assert.throws(
    () => extractRegion('const x = 1', 'missing'),
    isSnippetError('missing'),
  )
})

test('languageFor prefers the explicit lang', () => {
  assert.equal(languageFor('a.ts', 'diff'), 'diff')
})

test('languageFor maps known extensions', () => {
  assert.equal(languageFor('a.ts'), 'ts')
  assert.equal(languageFor('a.tsx'), 'tsx')
  assert.equal(languageFor('a.js'), 'js')
  assert.equal(languageFor('a.mjs'), 'js')
  assert.equal(languageFor('a.cjs'), 'js')
  assert.equal(languageFor('a.html'), 'html')
  assert.equal(languageFor('a.scss'), 'scss')
  assert.equal(languageFor('a.css'), 'css')
  assert.equal(languageFor('a.json'), 'json')
  assert.equal(languageFor('a.sh'), 'bash')
  assert.equal(languageFor('a.bash'), 'bash')
  assert.equal(languageFor('a.md'), 'md')
  assert.equal(languageFor('a.yml'), 'yaml')
  assert.equal(languageFor('a.yaml'), 'yaml')
})

test('languageFor falls back to text for unknown extensions', () => {
  assert.equal(languageFor('a.weird'), 'text')
  assert.equal(languageFor('Dockerfile'), 'text')
})
