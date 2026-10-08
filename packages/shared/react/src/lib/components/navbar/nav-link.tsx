import type { AnchorHTMLAttributes, ComponentType } from 'react';

import { useNavigation } from '../../providers/hooks';

export interface SmartNavLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'onClick'
> {
  href: string;
  onClick?: (event: { preventDefault(): void }) => void;
}

/**
 * `true` for paths inside the application; `false` for URLs with a scheme
 * (`https:`, `mailto:`, ...), protocol-relative URLs and in-page `#` anchors.
 */
export function isInternalHref(href: string): boolean {
  return !/^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(href);
}

/**
 * The `<a [href]>` of the navigation components. Internal links render
 * through `useNavigation().linkComponent` when the application set one (e.g.
 * React Router's `Link`), everything else as a plain `<a href>`.
 *
 * Shared by navbar, tabs, vertical-navigation, sidebar-navigation and
 * progress-bars. Attributes beyond `ISmartLinkProps` (`role`, `id`,
 * `aria-selected`, ...) are passed to the link component too, so the ARIA of
 * the Angular markup survives with router links that forward them.
 */
export function SmartNavLink({ href, children, ...rest }: SmartNavLinkProps) {
  const { linkComponent } = useNavigation();

  if (linkComponent && isInternalHref(href)) {
    const Link = linkComponent as ComponentType<SmartNavLinkProps>;

    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
