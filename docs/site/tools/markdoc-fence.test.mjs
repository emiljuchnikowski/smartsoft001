import Markdoc from '@markdoc/markdoc'

import assert from 'node:assert/strict'
import { test } from 'node:test'

import { fenceNode } from './markdoc-fence.mjs'

const config = { nodes: { fence: fenceNode('Fence') } }

/** The first block of `source`, transformed with the site's fence node. */
function render(source) {
  return Markdoc.transform(Markdoc.parse(source), config).children[0]
}

test('fenceNode renders the code of a block with its language', () => {
  const block = render(['```ts', 'const answer = 42', '```'].join('\n'))

  assert.equal(block.name, 'Fence')
  assert.deepEqual(block.attributes, { language: 'ts' })
  assert.deepEqual(block.children, ['const answer = 42\n'])
})

test('fenceNode keeps a Markdoc tag inside a block verbatim', () => {
  const block = render(
    ['```markdown', '{% snippet file="a.ts" region="usage" /%}', '```'].join(
      '\n',
    ),
  )

  assert.deepEqual(block.children, [
    '{% snippet file="a.ts" region="usage" /%}\n',
  ])
})
