import Markdoc from '@markdoc/markdoc'

const { Tag } = Markdoc

/**
 * The `fence` node of the site.
 *
 * Markdoc parses the body of a code block for tags and variables, so a page
 * that quotes `{% snippet … /%}` to show the syntax would lose the tag: it
 * would be transformed away like any other tag. A code block is quoted text,
 * so this node renders its raw content instead of its parsed children.
 *
 * `render` is the component the block is rendered with.
 */
export function fenceNode(render) {
  return {
    render,
    attributes: {
      content: { type: String, render: false },
      language: { type: String },
    },
    transform(node, config) {
      return new Tag(this.render, node.transformAttributes(config), [
        node.attributes.content,
      ])
    },
  }
}
