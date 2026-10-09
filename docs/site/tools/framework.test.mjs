import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'

import {
  DEFAULT_FRAMEWORK,
  FRAMEWORK_ATTRIBUTE,
  STORAGE_KEY,
  frameworkScript,
  isFramework,
  resolveFramework,
} from './framework.mjs'

/**
 * Runs the inline script against a stand-in for the browser and returns what
 * it left behind: the attribute on `<html>` and the stored choice.
 */
function runScript({ search = '', stored = null, storageThrows = false }) {
  const storage = new Map(stored === null ? [] : [[STORAGE_KEY, stored]])
  const attributes = new Map()
  const localStorage = {
    getItem(key) {
      if (storageThrows) throw new Error('blocked')
      return storage.has(key) ? storage.get(key) : null
    },
    setItem(key, value) {
      if (storageThrows) throw new Error('blocked')
      storage.set(key, value)
    },
  }
  const context = {
    window: { location: { search }, localStorage },
    document: {
      documentElement: {
        setAttribute: (name, value) => attributes.set(name, value),
      },
    },
  }

  vm.runInNewContext(frameworkScript(), context)

  return {
    attribute: attributes.get(FRAMEWORK_ATTRIBUTE) ?? null,
    stored: storage.get(STORAGE_KEY) ?? null,
  }
}

test('isFramework accepts the documented frameworks only', () => {
  assert.equal(isFramework('angular'), true)
  assert.equal(isFramework('react'), true)
  assert.equal(isFramework('vue'), false)
  assert.equal(isFramework(null), false)
})

test('resolveFramework prefers the URL, then the stored choice, then the default', () => {
  assert.deepEqual(
    resolveFramework({ search: '?framework=react', stored: 'angular' }),
    { framework: 'react', persist: true },
  )
  assert.deepEqual(resolveFramework({ search: '', stored: 'react' }), {
    framework: 'react',
    persist: false,
  })
  assert.deepEqual(resolveFramework(), {
    framework: DEFAULT_FRAMEWORK,
    persist: false,
  })
})

test('resolveFramework ignores an unknown framework in the URL or in storage', () => {
  assert.deepEqual(
    resolveFramework({ search: '?framework=vue', stored: 'svelte' }),
    { framework: DEFAULT_FRAMEWORK, persist: false },
  )
})

test('the inline script applies and remembers the framework of the URL', () => {
  const result = runScript({
    search: '?x=1&framework=react',
    stored: 'angular',
  })

  assert.deepEqual(result, { attribute: 'react', stored: 'react' })
})

test('the inline script applies the stored choice when the URL has none', () => {
  assert.deepEqual(runScript({ stored: 'react' }), {
    attribute: 'react',
    stored: 'react',
  })
})

test('the inline script leaves the attribute unset without a valid choice', () => {
  assert.deepEqual(runScript({ search: '?framework=vue', stored: 'svelte' }), {
    attribute: null,
    stored: 'svelte',
  })
})

test('the inline script still honours the URL when storage throws', () => {
  assert.deepEqual(
    runScript({ search: '?framework=react', storageThrows: true }),
    { attribute: 'react', stored: null },
  )
})

test('the inline script agrees with resolveFramework', () => {
  const cases = [
    { search: '?framework=react', stored: null },
    { search: '?framework=angular', stored: 'react' },
    { search: '', stored: 'react' },
    { search: '?framework=', stored: 'angular' },
    { search: '', stored: null },
  ]

  for (const input of cases) {
    const expected = resolveFramework(input).framework
    const { attribute } = runScript(input)

    assert.equal(
      attribute ?? DEFAULT_FRAMEWORK,
      expected,
      JSON.stringify(input),
    )
  }
})
