import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

/**
 * A markdown link `[text](/docs/x)` renders as a plain anchor by default, and
 * a plain anchor knows nothing about the `basePath` the site is served under.
 * On GitHub Pages that turned every internal link into
 * `emiljuchnikowski.github.io/docs/x`, which is a different site and a 404.
 * `next/link` adds the base path the same way the navigation and the search
 * already get it, so internal hrefs go through it and authors keep writing
 * `/docs/...`. External and in-page hrefs stay plain anchors.
 */
export function isInternalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

type MarkdocLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: string
}

export function MarkdocLink({ href, children, ...rest }: MarkdocLinkProps) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
