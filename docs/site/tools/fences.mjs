/**
 * Where the fenced code blocks of a markdown source are.
 *
 * A ``` or ~~~ run opens a block, and only a marker of the same kind without a
 * language closes it again: a ``` inside a ~~~ block is content, not a fence.
 * Everything between the markers is quoted text, so the docs tooling treats a
 * Markdoc tag there as an example instead of an instruction.
 */

const FENCE = /^\s*(`{3,}|~{3,})\s*([\w-]*)/

/**
 * One entry per line of `source`: `null` outside a fenced code block, and
 * inside one either the language of the opening marker (`{ language }`) or an
 * empty object for the lines the block contains.
 */
function scan(source) {
  const lines = source.split(/\r?\n/)
  const entries = lines.map(() => null)
  let fence = null

  lines.forEach((line, index) => {
    const match = line.match(FENCE)

    if (fence) {
      entries[index] = {}

      if (match && match[1].startsWith(fence) && !match[2]) fence = null
      return
    }

    if (!match) return

    fence = match[1]
    entries[index] = { language: match[2] }
  })

  return entries
}

/**
 * One boolean per line of `source`, true when the line belongs to a fenced
 * code block. The opening and the closing marker count as part of the block.
 */
export function fencedLineMask(source) {
  return scan(source).map((entry) => entry !== null)
}

/**
 * Every marker that opens a code block, with its 1-based line number and the
 * language token that follows it.
 */
export function openingFences(source) {
  return scan(source).flatMap((entry, index) =>
    entry?.language === undefined ? [] : [{ line: index + 1, ...entry }],
  )
}

/**
 * A predicate over the offsets of `source`: true when the offset sits on a
 * line that belongs to a fenced code block. The mask is scanned once, so the
 * caller can ask it for every match of a tag pattern.
 */
export function insideFence(source) {
  const mask = fencedLineMask(source)

  return (offset) =>
    mask[source.slice(0, offset).split('\n').length - 1] === true
}
