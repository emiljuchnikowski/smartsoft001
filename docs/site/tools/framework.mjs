/**
 * The frameworks the frontend pages are written for, and how a page picks the
 * one it shows. Pages that document both wrap each variant in a
 * `{% framework name="…" %}` block; the reader picks one with the switch under
 * the page title, and the choice holds on every page until it is changed.
 *
 * The choice lives in the `data-framework` attribute of `<html>`, which the
 * stylesheet reads to hide the blocks of the other framework. Setting it from
 * an inline script in `<head>`, before the first paint, is what keeps a React
 * reader from seeing the Angular variant flash on every page load of the
 * static export. Without the attribute (no JavaScript, first visit) the
 * stylesheet shows the default framework.
 */

export const FRAMEWORKS = ['angular', 'react']

export const DEFAULT_FRAMEWORK = 'angular'

export const FRAMEWORK_LABELS = { angular: 'Angular', react: 'React' }

/** Where the choice is remembered between visits. */
export const STORAGE_KEY = 'smartsoft-docs-framework'

/** `?framework=react` opens a page, and every page after it, on React. */
export const QUERY_PARAM = 'framework'

export const FRAMEWORK_ATTRIBUTE = 'data-framework'

/** The attribute of a `{% framework %}` block, read by the stylesheet. */
export const BLOCK_ATTRIBUTE = 'data-framework-only'

export function isFramework(value) {
  return FRAMEWORKS.includes(value)
}

/**
 * The framework a page opens with: the one its URL asks for, then the one the
 * reader picked before, then the default. `persist` says whether the URL
 * brought a choice that should be remembered.
 */
export function resolveFramework({ search = '', stored = null } = {}) {
  const requested = new URLSearchParams(search).get(QUERY_PARAM)

  if (isFramework(requested)) return { framework: requested, persist: true }
  if (isFramework(stored)) return { framework: stored, persist: false }

  return { framework: DEFAULT_FRAMEWORK, persist: false }
}

/**
 * The inline `<head>` script. It cannot import anything, so it repeats the
 * rules of `resolveFramework` in plain ES5; the tests run it against the same
 * cases. Storage may throw (private mode, blocked cookies): the URL and the
 * default still apply then.
 */
export function frameworkScript() {
  return `(function () {
  var allowed = ${JSON.stringify(FRAMEWORKS)};
  var key = ${JSON.stringify(STORAGE_KEY)};
  var chosen = null;
  try {
    var match = /[?&]${QUERY_PARAM}=([^&#]*)/.exec(window.location.search);
    var requested = match ? decodeURIComponent(match[1]) : null;
    if (allowed.indexOf(requested) !== -1) {
      chosen = requested;
      try { window.localStorage.setItem(key, requested); } catch (e) {}
    }
  } catch (e) {}
  if (!chosen) {
    try {
      var stored = window.localStorage.getItem(key);
      if (allowed.indexOf(stored) !== -1) chosen = stored;
    } catch (e) {}
  }
  if (chosen) {
    document.documentElement.setAttribute(${JSON.stringify(FRAMEWORK_ATTRIBUTE)}, chosen);
  }
})();`
}
