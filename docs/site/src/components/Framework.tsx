'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import {
  type Framework,
  revealHashTarget,
  setFramework,
  useFramework,
} from '@/lib/framework'
import { BLOCK_ATTRIBUTE, FRAMEWORK_LABELS } from '../../tools/framework.mjs'

/**
 * The content of a `{% framework name="…" %}` block. Both variants are in the
 * page; the stylesheet hides the one the reader did not pick, so the switch
 * needs no re-render and the static export carries both for search engines.
 */
export function FrameworkBlock({
  name,
  children,
}: {
  name: Framework
  children: React.ReactNode
}) {
  return <div {...{ [BLOCK_ATTRIBUTE]: name }}>{children}</div>
}

/**
 * The Angular | React switch under the title of a page that documents both.
 * Every switch shares one state: the `data-framework` attribute of `<html>`.
 */
export function FrameworkSwitch({
  frameworks,
}: {
  frameworks: Array<Framework>
}) {
  let current = useFramework()

  return (
    <div
      role="group"
      aria-label="Framework"
      className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
    >
      {frameworks.map((framework) => (
        <button
          key={framework}
          type="button"
          aria-pressed={framework === current}
          onClick={() => setFramework(framework)}
          className={clsx(
            'rounded-md px-3 py-1 font-display text-sm transition-colors focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
            framework === current
              ? 'bg-white text-sky-600 shadow-sm dark:bg-slate-700 dark:text-sky-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
          )}
        >
          {FRAMEWORK_LABELS[framework]}
        </button>
      ))}
    </div>
  )
}

/** Switches to the framework of the heading the address points at. */
export function FrameworkHashTarget() {
  let pathname = usePathname()

  useEffect(() => {
    revealHashTarget()
    window.addEventListener('hashchange', revealHashTarget)

    return () => window.removeEventListener('hashchange', revealHashTarget)
  }, [pathname])

  return null
}
