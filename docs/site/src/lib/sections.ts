import { type Node } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'

interface HeadingNode extends Node {
  type: 'heading'
  attributes: {
    level: 1 | 2 | 3 | 4 | 5 | 6
    id?: string
    [key: string]: unknown
  }
}

type H2Node = HeadingNode & {
  attributes: {
    level: 2
  }
}

type H3Node = HeadingNode & {
  attributes: {
    level: 3
  }
}

function isHeadingNode(node: Node): node is HeadingNode {
  return (
    node.type === 'heading' &&
    [1, 2, 3, 4, 5, 6].includes(node.attributes.level) &&
    (typeof node.attributes.id === 'string' ||
      typeof node.attributes.id === 'undefined')
  )
}

function isH2Node(node: Node): node is H2Node {
  return isHeadingNode(node) && node.attributes.level === 2
}

function isH3Node(node: Node): node is H3Node {
  return isHeadingNode(node) && node.attributes.level === 3
}

/**
 * The text of a heading, inline code included, so that
 * "TableComponent (`<smart-table>`)" does not read "TableComponent ()" and
 * "### `PayuService`" is not dropped. The heading node in `markdoc/nodes.js`
 * builds its id from the same text, so the entry and the anchor agree.
 */
function getNodeText(node: Node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (child.type === 'text' || child.type === 'code') {
      text += child.attributes.content
    }
    text += getNodeText(child)
  }
  return text
}

export type Subsection = H3Node['attributes'] & {
  id: string
  title: string
  framework?: string
  children?: undefined
}

export type Section = H2Node['attributes'] & {
  id: string
  title: string
  framework?: string
  children: Array<Subsection>
}

/** The framework a `{% framework name="…" %}` block is written for. */
function frameworkOf(node: Node) {
  return node.type === 'tag' && node.tag === 'framework'
    ? String(node.attributes.name)
    : undefined
}

/**
 * The entries of the table of contents, each heading inside a framework block
 * marked with that framework so the list shows only the reader's variant. The
 * entries are collected into one list, so an `h3` at the top of a framework
 * block becomes a child of the `h2` above the block.
 */
export function collectSections(
  nodes: Array<Node>,
  slugify = slugifyWithCounter(),
  framework?: string,
  sections: Array<Section> = [],
) {
  for (let node of nodes) {
    if (isH2Node(node) || isH3Node(node)) {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        if (isH3Node(node)) {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`',
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            id,
            title,
            framework,
          })
        } else {
          sections.push({
            ...node.attributes,
            id,
            title,
            framework,
            children: [],
          })
        }
      }
    }

    collectSections(
      node.children ?? [],
      slugify,
      frameworkOf(node) ?? framework,
      sections,
    )
  }

  return sections
}
