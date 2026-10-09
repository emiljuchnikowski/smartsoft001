import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { htmlFiles, unprefixedReferences } from './check-export.mjs'

const BASE = '/smartsoft001'

test('an absolute href without the base path is an offender', () => {
  const html = '<a href="/docs/components/calendar">Calendar</a>'

  assert.deepEqual(unprefixedReferences(html, BASE), [
    { attribute: 'href', value: '/docs/components/calendar' },
  ])
})

test('a root href without the base path is an offender too', () => {
  const html = '<a href="/">Home</a>'

  assert.deepEqual(unprefixedReferences(html, BASE), [
    { attribute: 'href', value: '/' },
  ])
})

test('an href under the base path is fine, and so is the base path itself', () => {
  const html =
    '<a href="/smartsoft001/docs/x/">x</a><a href="/smartsoft001">root</a>'

  assert.deepEqual(unprefixedReferences(html, BASE), [])
})

test('a path that merely starts with the base path string is not under it', () => {
  const html = '<a href="/smartsoft001-old/docs/">old</a>'

  assert.deepEqual(unprefixedReferences(html, BASE), [
    { attribute: 'href', value: '/smartsoft001-old/docs/' },
  ])
})

test('full urls, protocol-relative urls, fragments and relative paths are ignored', () => {
  const html = [
    '<a href="https://github.com/x">gh</a>',
    '<a href="//cdn.example/x.js">cdn</a>',
    '<a href="#install">anchor</a>',
    '<a href="../sibling/">rel</a>',
    '<a href="mailto:a@b.c">mail</a>',
  ].join('')

  assert.deepEqual(unprefixedReferences(html, BASE), [])
})

test('src attributes are checked the same way as href', () => {
  const html =
    '<img src="/images/a.png"><script src="/smartsoft001/_next/x.js"></script>'

  assert.deepEqual(unprefixedReferences(html, BASE), [
    { attribute: 'src', value: '/images/a.png' },
  ])
})

test('a trailing slash on the base path does not change the answer', () => {
  const html = '<a href="/smartsoft001/docs/">ok</a><a href="/docs/">bad</a>'

  assert.deepEqual(unprefixedReferences(html, `${BASE}/`), [
    { attribute: 'href', value: '/docs/' },
  ])
})

test('the builds copied next to the export are not pages of it', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'check-export-'))
  const write = (relative) => {
    fs.mkdirSync(path.dirname(path.join(out, relative)), { recursive: true })
    fs.writeFileSync(path.join(out, relative), '<html></html>')
  }

  try {
    write('index.html')
    write('docs/example-app/index.html')
    write('demo/index.html')
    write('demo-react/index.html')
    write('storybook/react/iframe.html')

    assert.deepEqual(
      [...htmlFiles(out)].map((file) => path.relative(out, file)).sort(),
      ['docs/example-app/index.html', 'index.html'],
    )
  } finally {
    fs.rmSync(out, { recursive: true, force: true })
  }
})

test('a page of the export whose path merely contains a demo name is checked', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'check-export-'))

  try {
    fs.mkdirSync(path.join(out, 'docs', 'demo'), { recursive: true })
    fs.writeFileSync(
      path.join(out, 'docs', 'demo', 'index.html'),
      '<html></html>',
    )

    assert.deepEqual(
      [...htmlFiles(out)].map((file) => path.relative(out, file)),
      [path.join('docs', 'demo', 'index.html')],
    )
  } finally {
    fs.rmSync(out, { recursive: true, force: true })
  }
})
