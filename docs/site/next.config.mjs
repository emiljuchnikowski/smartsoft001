import withMarkdoc from '@markdoc/next.js'

import withSearch from './src/markdoc/search.mjs'
import withSnippets from './src/markdoc/snippets-plugin.mjs'

/**
 * Served from GitHub Pages at the root of its own domain,
 * https://framework.smartflow.biz.pl/, so there is no basePath. Static
 * export: no server, trailing slashes so that /docs/x/ resolves to
 * /docs/x/index.html on Pages.
 */
const basePath = ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
}

export default withSnippets(
  withSearch(
    withMarkdoc({ schemaPath: './src/markdoc', nextjsExports: ['revalidate'] })(
      nextConfig,
    ),
  ),
)
