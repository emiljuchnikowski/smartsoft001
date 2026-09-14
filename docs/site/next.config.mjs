import withMarkdoc from '@markdoc/next.js'

import withSearch from './src/markdoc/search.mjs'

/**
 * Served from GitHub Pages under https://emiljuchnikowski.github.io/smartsoft001/,
 * hence the basePath. Static export: no server, trailing slashes so that
 * /docs/x/ resolves to /docs/x/index.html on Pages.
 */
const basePath = '/smartsoft001'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
}

export default withSearch(
  withMarkdoc({ schemaPath: './src/markdoc', nextjsExports: ['revalidate'] })(
    nextConfig,
  ),
)
