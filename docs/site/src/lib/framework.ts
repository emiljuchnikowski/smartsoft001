import { useSyncExternalStore } from 'react'

import {
  BLOCK_ATTRIBUTE,
  DEFAULT_FRAMEWORK,
  FRAMEWORK_ATTRIBUTE,
  QUERY_PARAM,
  STORAGE_KEY,
  isFramework,
} from '../../tools/framework.mjs'

export type Framework = 'angular' | 'react'

/** The framework the page shows now, as the `<head>` script or a switch set it. */
export function getFramework(): Framework {
  let value = document.documentElement.getAttribute(FRAMEWORK_ATTRIBUTE)

  return isFramework(value) ? (value as Framework) : DEFAULT_FRAMEWORK
}

/**
 * Shows `framework` on this page and on every page after it. A `?framework=`
 * in the address follows along, so a copied link opens what the reader sees.
 */
export function setFramework(framework: Framework) {
  document.documentElement.setAttribute(FRAMEWORK_ATTRIBUTE, framework)

  try {
    window.localStorage.setItem(STORAGE_KEY, framework)
  } catch {
    // Storage can be blocked; the choice then holds for this page only.
  }

  let url = new URL(window.location.href)

  if (url.searchParams.has(QUERY_PARAM)) {
    url.searchParams.set(QUERY_PARAM, framework)
    window.history.replaceState(window.history.state, '', url)
  }
}

function subscribe(onChange: () => void) {
  let observer = new MutationObserver(onChange)

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [FRAMEWORK_ATTRIBUTE],
  })

  return () => observer.disconnect()
}

/**
 * The current framework, re-rendering when any switch on the page changes it.
 * The server render and the first client render use the default, so the
 * markup hydrates cleanly; the stored choice follows right after.
 */
export function useFramework(): Framework {
  return useSyncExternalStore(subscribe, getFramework, () => DEFAULT_FRAMEWORK)
}

/**
 * A link to a heading of the other framework (a search result, a link from a
 * package page) would land on a hidden block: switch to that framework and
 * scroll to the heading instead.
 */
export function revealHashTarget() {
  let id = decodeURIComponent(window.location.hash.slice(1))

  if (!id) return

  let target = document.getElementById(id)
  let framework = target
    ?.closest(`[${BLOCK_ATTRIBUTE}]`)
    ?.getAttribute(BLOCK_ATTRIBUTE)

  if (!target || !isFramework(framework) || framework === getFramework()) {
    return
  }

  setFramework(framework as Framework)
  target.scrollIntoView()
}
