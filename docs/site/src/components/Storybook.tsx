'use client'

import { useEffect, useRef, useState } from 'react'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** The shortest frame, so a one-line story does not collapse to nothing. */
const MIN_HEIGHT = 160

/** Room below the lowest element: Storybook's own padding plus a shadow. */
const BOTTOM_GAP = 24

/** Room left above content that had to be pushed down. */
const TOP_GAP = 8

/** A safety cap: no story should need more, and it stops any runaway growth. */
const MAX_HEIGHT = 2000

/**
 * The height a story needs, measured inside the frame. An element in the flow,
 * or positioned absolutely like an open date picker or a tooltip, needs the
 * frame to reach its bottom edge. A fixed element, like an open modal, is
 * placed against the frame's own viewport, so it needs the frame to be as tall
 * as the element itself: measuring its bottom would chase a moving target.
 */
export function storyHeight(doc: Document): number {
  const view = doc.defaultView
  const viewport = view?.innerHeight ?? 0
  let height = 0

  for (const element of Array.from(doc.body.querySelectorAll('*'))) {
    const rect = element.getBoundingClientRect()

    if (!rect.width && !rect.height) continue

    // An element as tall as the frame (h-screen, min-h-full), or one pinned to
    // its bottom edge (a footer in such a layout), follows the frame instead
    // of its content: counting it would grow the frame forever. It fits.
    if (viewport && Math.abs(rect.height - viewport) < 2) continue
    if (viewport && Math.abs(rect.bottom - viewport) < 2) continue

    const fixed = view?.getComputedStyle(element).position === 'fixed'
    const needed = fixed ? rect.height : rect.bottom + (view?.scrollY ?? 0)

    height = Math.max(height, needed)
  }

  return Math.min(
    MAX_HEIGHT,
    Math.max(MIN_HEIGHT, Math.ceil(height + BOTTOM_GAP)),
  )
}

/**
 * How far the story reaches above the frame: a tooltip that opens upwards
 * from an element near the top. The frame only grows downwards, so the story
 * is pushed down by that much instead. Fixed elements are left out, since
 * they are placed against the viewport and the push would not move them.
 */
export function storyTopOverflow(doc: Document): number {
  const view = doc.defaultView
  let top = 0

  for (const element of Array.from(doc.body.querySelectorAll('*'))) {
    const rect = element.getBoundingClientRect()

    if (!rect.width && !rect.height) continue
    if (view?.getComputedStyle(element).position === 'fixed') continue

    top = Math.min(top, rect.top + (view?.scrollY ?? 0))
  }

  return Math.ceil(-top)
}

/**
 * Embeds a single story of a Storybook build published next to the docs
 * (see the `storybook/<project>` folders of the deployed site).
 *
 * The build is served from the same origin, so the frame follows its content:
 * it grows when the story opens a calendar, a tooltip or a modal and shrinks
 * when they close. `height` is only the size before the story has loaded.
 */
export function Storybook({
  project,
  story,
  height = 320,
}: {
  project: string
  story: string
  height?: number
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [frameHeight, setFrameHeight] = useState(height)

  useEffect(() => {
    const iframe = frame.current

    if (!iframe) return

    let resize: ResizeObserver | undefined
    let mutations: MutationObserver | undefined
    let pending = 0

    const measure = () => {
      cancelAnimationFrame(pending)
      pending = requestAnimationFrame(() => {
        const doc = iframe.contentDocument

        if (!doc?.body) return

        const overflow = storyTopOverflow(doc)

        // Only ever add room: taking it away again when the tooltip closes
        // would make the story jump on every hover.
        if (overflow > 0) {
          const current = parseFloat(doc.body.style.paddingTop) || 0

          doc.body.style.paddingTop = `${current + overflow + TOP_GAP}px`
        }

        setFrameHeight(storyHeight(doc))
      })
    }

    const watch = () => {
      const doc = iframe.contentDocument

      // A frame from another origin cannot be read: keep the given height.
      if (!doc?.body) return

      resize?.disconnect()
      mutations?.disconnect()
      resize = new ResizeObserver(measure)
      resize.observe(doc.body)
      mutations = new MutationObserver(measure)
      mutations.observe(doc.body, {
        attributes: true,
        childList: true,
        subtree: true,
      })
      doc.addEventListener('transitionend', measure)
      measure()
    }

    iframe.addEventListener('load', watch)
    watch()

    return () => {
      iframe.removeEventListener('load', watch)
      resize?.disconnect()
      mutations?.disconnect()
      cancelAnimationFrame(pending)
    }
  }, [])

  return (
    <iframe
      ref={frame}
      src={`${base}/storybook/${project}/iframe.html?id=${story}&viewMode=story`}
      title={story}
      loading="lazy"
      height={frameHeight}
      className="w-full rounded-lg border border-slate-200 dark:border-slate-800"
    />
  )
}
