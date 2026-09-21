#!/usr/bin/env node
/**
 * Fails the docs build when the static export references anything by an
 * absolute path that does not carry the site's base path.
 *
 * The site is served from `https://emiljuchnikowski.github.io/smartsoft001/`,
 * so an `href="/docs/x"` in the exported HTML does not point at this site at
 * all: it points at the user site one level up, which answers 404. Next adds
 * the base path to everything that goes through `next/link` and the router,
 * and to nothing else, so a plain anchor slips through unchanged. Four hundred
 * and sixty of them did, on the live site, until a reader sent one around.
 *
 * Run after `next build`. It reads `out/` next to this file's parent.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const siteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)

/**
 * Every `href` or `src` in `html` whose value is an absolute path outside
 * `basePath`. A value equal to the base path, or under it, is fine; so is a
 * protocol-relative `//host`, a full URL, a fragment or a relative path.
 */
export function unprefixedReferences(html, basePath) {
  const offenders = []
  const prefix = basePath.replace(/\/$/, '')

  for (const match of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    const [, attribute, value] = match

    if (!value.startsWith('/')) continue
    if (value.startsWith('//')) continue
    if (value === prefix || value.startsWith(`${prefix}/`)) continue

    offenders.push({ attribute, value })
  }

  return offenders
}

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name.endsWith('.html')) yield full
  }
}

async function main() {
  const { default: config } = await import(
    path.join(siteRoot, 'next.config.mjs')
  )
  const basePath = config.basePath

  if (!basePath) {
    console.error(
      'next.config.mjs declares no basePath; nothing to check against',
    )
    process.exit(1)
  }

  const out = path.join(siteRoot, 'out')

  if (!fs.existsSync(out)) {
    console.error(`No export at ${out}. Run "next build" first.`)
    process.exit(1)
  }

  const byValue = new Map()
  let pages = 0

  for (const file of htmlFiles(out)) {
    pages += 1

    for (const { attribute, value } of unprefixedReferences(
      fs.readFileSync(file, 'utf8'),
      basePath,
    )) {
      const key = `${attribute}="${value}"`
      const entry = byValue.get(key) ?? {
        count: 0,
        first: path.relative(out, file),
      }

      entry.count += 1
      byValue.set(key, entry)
    }
  }

  if (byValue.size === 0) {
    console.log(
      `check-export: ${pages} pages, every absolute reference carries ${basePath}`,
    )
    return
  }

  const total = [...byValue.values()].reduce((sum, e) => sum + e.count, 0)

  console.error(
    `check-export: ${total} references in the export do not carry the base path ${basePath}, ` +
      `${byValue.size} distinct. They resolve outside this site and 404 on GitHub Pages.\n`,
  )

  for (const [key, { count, first }] of [...byValue].sort(
    (a, b) => b[1].count - a[1].count,
  )) {
    console.error(`  ${String(count).padStart(4)}  ${key}  (first in ${first})`)
  }

  console.error(
    '\nAn internal link in markdown has to render through next/link, which adds the base path. ' +
      'See docs/site/src/markdoc/nodes.js.',
  )
  process.exit(1)
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main()
}
