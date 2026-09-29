import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import yaml from 'js-yaml'

import { fenceNode } from '../../tools/markdoc-fence.mjs'
import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'
import { MarkdocLink } from '@/components/MarkdocLink'

let documentSlugifyMap = new Map()

/** The text of a transformed child: a string, or the strings inside a tag. */
function textOf(child) {
  if (typeof child === 'string') return child
  return (child?.children ?? []).map(textOf).join('')
}

const nodes = {
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(node, config) {
      documentSlugifyMap.set(config, slugifyWithCounter())

      return new Tag(
        this.render,
        {
          frontmatter: yaml.load(node.attributes.frontmatter),
          nodes: node.children,
        },
        node.transformChildren(config),
      )
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node, config) {
      let slugify = documentSlugifyMap.get(config)
      let attributes = node.transformAttributes(config)
      let children = node.transformChildren(config)
      // Inline code counts: an id built from the plain text alone left
      // "### `PayuService`" without one, and the table of contents
      // (lib/sections.ts, same rule) without the entry.
      let text = children.map(textOf).join(' ')
      let id = attributes.id ?? slugify(text)

      return new Tag(
        `h${node.attributes.level}`,
        { ...attributes, id },
        children,
      )
    },
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: fenceNode(Fence),
  link: {
    // A plain anchor does not get the base path; next/link does. Without this
    // every `[text](/docs/x)` on the site pointed one level above it on
    // GitHub Pages. The export check fails the build if one slips through.
    ...defaultNodes.link,
    render: MarkdocLink,
  },
}

export default nodes
