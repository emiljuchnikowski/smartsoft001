import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { test } from 'node:test'
import * as url from 'node:url'

import {
  expandStoryTemplates,
  extractTemplate,
  parseStoryTemplateTag,
  resolveConstants,
} from './templates.mjs'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const fixtures = path.join(__dirname, '__fixtures__', 'templates')
const repoRoot = path.join(fixtures, 'repo')

/** `assert.throws` matches a regexp against `String(error)`, so check the message. */
function isTemplateError(...expectedParts) {
  return (error) => {
    assert.ok(error instanceof Error)
    assert.match(error.message, /^\[story-template\] /)
    for (const part of expectedParts) {
      assert.ok(
        error.message.includes(part),
        `expected ${JSON.stringify(error.message)} to mention ${JSON.stringify(part)}`,
      )
    }
    return true
  }
}

function read(name) {
  return fs.readFileSync(path.join(fixtures, `${name}.stories.ts`), 'utf8')
}

test('extractTemplate returns the dedented body of the first template literal', () => {
  const result = extractTemplate(read('plain'))

  assert.deepEqual(result, {
    html: [
      '<div style="padding: 40px;">',
      '  <smart-button-preset [options]="options">',
      '    {{ label }}',
      '  </smart-button-preset>',
      '</div>',
    ].join('\n'),
    unresolved: [],
  })
})

test('extractTemplate returns null when the region is missing', () => {
  const result = extractTemplate(read('plain'), { region: 'absent' })

  assert.equal(result, null)
})

test('extractTemplate returns null when the region has no template literal', () => {
  const result = extractTemplate(read('no-template'))

  assert.equal(result, null)
})

test('resolveConstants reads single- and double-quoted string constants', () => {
  const constants = resolveConstants(read('constant'))

  assert.equal(constants.get('ALT_TEXT'), 'A photo')
  assert.equal(constants.get('CAPTION'), "It's fine")
})

test('extractTemplate substitutes resolvable constants into the html', () => {
  const result = extractTemplate(read('constant'))

  assert.deepEqual(result, {
    html: ['<img src="/photo.jpg" alt="A photo" />', "<p>It's fine</p>"].join(
      '\n',
    ),
    unresolved: [],
  })
})

test('extractTemplate reports an expression it cannot resolve', () => {
  const result = extractTemplate(read('unresolvable'))

  assert.deepEqual(result, {
    html: "<div>${section('a')}</div>",
    unresolved: ["section('a')"],
  })
})

test('resolveConstants reads a value declared on the following line', () => {
  const constants = resolveConstants(read('next-line'))

  assert.match(constants.get('IMAGE_URL'), /^https:\/\/images\.unsplash\.com\//)
})

test('resolveConstants joins an array of strings with the given separator', () => {
  const constants = resolveConstants(read('join'))

  assert.equal(
    constants.get('BOX_CLASS'),
    'smart:rounded-lg smart:border smart:border-gray-300 smart:bg-white',
  )
  assert.equal(constants.get('KEYS'), 'name,role')
})

test('resolveConstants reads a template literal constant as declared', () => {
  const constants = resolveConstants(read('slots'))

  assert.equal(
    constants.get('SLOTS'),
    [
      '',
      '  <ng-template #image>',
      '    <img src="${IMAGE_URL}" alt="" />',
      '  </ng-template>',
      '',
    ].join('\n'),
  )
})

test('extractTemplate inlines a multi-line constant and resolves it in turn', () => {
  const result = extractTemplate(read('slots'))

  assert.deepEqual(result, {
    html: [
      '<ng-template #image>',
      '  <img src="https://example.com/photo.jpg" alt="" />',
      '</ng-template>',
      '<div style="padding: 40px;">',
      '  <smart-section-heading [options]="options" />',
      '</div>',
    ].join('\n'),
    unresolved: [],
  })
})

test('extractTemplate reads across a nested ${} inside an attribute', () => {
  const result = extractTemplate(read('nested'))

  assert.deepEqual(result, {
    html: [
      "<div class=\"${['box', `pad-${SIZE}`].join(' ')}\">",
      '  <smart-x [options]="options"></smart-x>',
      '</div>',
    ].join('\n'),
    unresolved: ["['box', `pad-${SIZE}`].join(' ')"],
  })
})

test('extractTemplate unescapes a backtick and keeps a self-closing tag', () => {
  const result = extractTemplate(read('escaped'))

  assert.deepEqual(result, {
    html: ['<p>Type ` to open a code span</p>', '<smart-x />'].join('\n'),
    unresolved: [],
  })
})

test('extractTemplate flattens the common indentation and keeps blank lines', () => {
  const result = extractTemplate(read('indented'))

  assert.equal(
    result.html,
    [
      '<section>',
      '',
      '  <div>',
      '    <span>x</span>',
      '  </div>',
      '</section>',
    ].join('\n'),
  )
})

test('parseStoryTemplateTag reads the file and the region', () => {
  const attributes = parseStoryTemplateTag(
    '{% story-template file="packages/a/a.component.stories.ts" region="demo" /%}',
  )

  assert.deepEqual(attributes, {
    file: 'packages/a/a.component.stories.ts',
    region: 'demo',
  })
})

test('parseStoryTemplateTag defaults the region to usage', () => {
  const attributes = parseStoryTemplateTag(
    "{% story-template file='packages/a/a.component.stories.ts' /%}",
  )

  assert.equal(attributes.region, 'usage')
})

test('parseStoryTemplateTag throws when the file is missing', () => {
  assert.throws(
    () => parseStoryTemplateTag('{% story-template region="usage" /%}'),
    isTemplateError('has no "file" attribute'),
  )
})

test('expandStoryTemplates replaces the tag with an html code block', () => {
  const source = [
    '## Usage',
    '',
    '{% story-template file="packages/demo/demo.component.stories.ts" /%}',
    '',
    'After.',
  ].join('\n')

  const result = expandStoryTemplates(source, { repoRoot })

  assert.equal(
    result,
    [
      '## Usage',
      '',
      '```html',
      '<smart-demo [options]="options">Save</smart-demo>',
      '```',
      '',
      'After.',
    ].join('\n'),
  )
})

test('expandStoryTemplates leaves a tag inside a fenced code block untouched', () => {
  const source = [
    '```md',
    '{% story-template file="packages/demo/demo.component.stories.ts" /%}',
    '```',
  ].join('\n')

  const result = expandStoryTemplates(source, { repoRoot })

  assert.equal(result, source)
})

test('expandStoryTemplates reports the story as a dependency once', () => {
  const tag =
    '{% story-template file="packages/demo/demo.component.stories.ts" /%}'
  const files = []

  expandStoryTemplates([tag, tag].join('\n\n'), {
    repoRoot,
    onDependency: (file) => files.push(file),
  })

  assert.deepEqual(files, [
    path.join(repoRoot, 'packages/demo/demo.component.stories.ts'),
  ])
})

test('expandStoryTemplates throws when the story does not exist', () => {
  assert.throws(
    () =>
      expandStoryTemplates(
        '{% story-template file="packages/ghost/ghost.component.stories.ts" /%}',
        { repoRoot },
      ),
    isTemplateError(
      'does not exist',
      'packages/ghost/ghost.component.stories.ts',
    ),
  )
})

test('expandStoryTemplates throws for a file outside the repository', () => {
  assert.throws(
    () =>
      expandStoryTemplates('{% story-template file="../outside.ts" /%}', {
        repoRoot,
      }),
    isTemplateError('outside'),
  )
})

test('expandStoryTemplates throws when the region has no template', () => {
  assert.throws(
    () =>
      expandStoryTemplates(
        '{% story-template file="packages/empty/empty.component.stories.ts" /%}',
        { repoRoot },
      ),
    isTemplateError(
      'packages/empty/empty.component.stories.ts',
      'no "usage" region with a template',
    ),
  )
})

test('expandStoryTemplates throws and names an expression it cannot resolve', () => {
  assert.throws(
    () =>
      expandStoryTemplates(
        '{% story-template file="packages/broken/broken.component.stories.ts" /%}',
        { repoRoot },
      ),
    isTemplateError(
      'packages/broken/broken.component.stories.ts',
      "${cell('one')}",
    ),
  )
})
