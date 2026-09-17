'use client'

import { Children, isValidElement, useId, useRef, useState } from 'react'
import clsx from 'clsx'

/**
 * A single tab of a `{% tabs %}` block.
 *
 * `Tabs` reads the `title` off this element's props and renders the element
 * itself only while it is selected, so this component is a thin wrapper that
 * contributes nothing but its children.
 */
export function Tab({
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return <>{children}</>
}

/**
 * The title a tab is listed under, or `null` for a child that is not a tab at
 * all, such as the whitespace Markdoc leaves between two block tags.
 *
 * Markdoc declares `title` as a required attribute of `{% tab %}`, but a
 * missing one is only a validation error there, not a build failure: the tag
 * still renders, with no title. Dropping such a tab would make the page lose
 * its content without a word, so this throws instead, which fails the build of
 * the page that carries the typo.
 */
function titleOf(child: React.ReactNode): string | null {
  if (!isValidElement<{ title?: unknown }>(child)) {
    return null
  }

  let { title } = child.props

  if (typeof title !== 'string' || title === '') {
    throw new Error('Every {% tab %} of a {% tabs %} block needs a title.')
  }

  return title
}

/**
 * Shows one of several `{% tab %}` children at a time, so that a page can
 * document the same example in HTML, TypeScript and other variants without
 * repeating the surrounding prose.
 *
 * Markdoc hands the tags below this one over as React elements, hence the
 * `props.title` lookup: the tab strip is derived from the children.
 */
export function Tabs({ children }: { children: React.ReactNode }) {
  let id = useId()
  let [selected, setSelected] = useState(0)
  let buttons = useRef<Array<HTMLButtonElement | null>>([])

  let tabs = Children.toArray(children).flatMap((child, index) => {
    let title = titleOf(child)

    return title === null ? [] : [{ key: index, title, child }]
  })

  if (tabs.length === 0) {
    return null
  }

  function select(index: number) {
    setSelected(index)
    buttons.current[index]?.focus()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    let last = tabs.length - 1
    let next = {
      ArrowLeft: selected === 0 ? last : selected - 1,
      ArrowRight: selected === last ? 0 : selected + 1,
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) {
      return
    }

    event.preventDefault()
    select(next)
  }

  let tabId = (index: number) => `${id}-tab-${index}`
  let panelId = (index: number) => `${id}-panel-${index}`

  return (
    <div className="my-8">
      <div
        role="tablist"
        className="not-prose flex flex-wrap gap-x-6 border-b border-slate-200 dark:border-slate-800"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            ref={(node) => {
              buttons.current[index] = node
            }}
            type="button"
            role="tab"
            id={tabId(index)}
            aria-selected={index === selected}
            aria-controls={panelId(index)}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={onKeyDown}
            className={clsx(
              '-mb-px border-b-2 px-1 pb-2.5 font-display text-sm transition-colors focus:outline-hidden focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500',
              index === selected
                ? 'border-sky-500 text-sky-500 dark:border-sky-400 dark:text-sky-400'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200',
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={panelId(selected)}
        aria-labelledby={tabId(selected)}
        tabIndex={0}
        className="focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
      >
        {tabs[selected].child}
      </div>
    </div>
  )
}
