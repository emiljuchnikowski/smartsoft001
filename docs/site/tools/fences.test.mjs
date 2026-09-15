import assert from 'node:assert/strict'
import { test } from 'node:test'

import { fencedLineMask, insideFence, openingFences } from './fences.mjs'

test('fencedLineMask marks the lines of a fenced block, fences included', () => {
  const source = ['before', '```ts', 'const a = 1', '```', 'after'].join('\n')

  const mask = fencedLineMask(source)

  assert.deepEqual(mask, [false, true, true, true, false])
})

test('fencedLineMask keeps a nested marker inside its outer block', () => {
  const source = ['````markdown', '```', 'nested', '```', '````', 'after'].join(
    '\n',
  )

  const mask = fencedLineMask(source)

  assert.deepEqual(mask, [true, true, true, true, true, false])
})

test('insideFence answers for the offset of a match', () => {
  const source = ['{% a /%}', '```markdown', '{% b /%}', '```'].join('\n')
  const offsetOf = (tag) => source.indexOf(tag)

  const fenced = insideFence(source)

  assert.equal(fenced(offsetOf('{% a /%}')), false)
  assert.equal(fenced(offsetOf('{% b /%}')), true)
})

test('openingFences reports the line and language of every opening marker', () => {
  const source = [
    'text',
    '```',
    'plain',
    '```',
    '',
    '````markdown',
    '```ts',
    '````',
  ].join('\n')

  const openings = openingFences(source)

  assert.deepEqual(openings, [
    { line: 2, language: '' },
    { line: 6, language: 'markdown' },
  ])
})
