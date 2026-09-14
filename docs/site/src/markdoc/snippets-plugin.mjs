import * as path from 'node:path'
import * as url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const loader = path.join(__dirname, 'snippet-loader.mjs')

/**
 * Registers the snippet loader for every `page.md`. `enforce: 'pre'` is
 * required: the loader has to run before the Markdoc loader installed by
 * `@markdoc/next.js`, which would otherwise choke on the unknown tag.
 */
export default function withSnippets(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: /page\.md$/,
        enforce: 'pre',
        use: [{ loader }],
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}
