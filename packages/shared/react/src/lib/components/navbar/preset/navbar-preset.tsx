import { INavbarItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../nav-link';
import { SmartNavbarProps } from '../navbar.types';
import { useNavbar } from '../use-navbar';
import {
  getNavbarBrandClasses,
  getNavbarCollapseClasses,
  getNavbarHeaderClasses,
  getNavbarItemClasses,
  getNavbarSecondaryNavClasses,
  getNavbarToggleClasses,
  NAVBAR_BRAND_ROW,
  NAVBAR_LINKS_CONTAINER,
  NAVBAR_NAV_CONTAINER,
  NAVBAR_SECONDARY_CONTAINER,
} from './preset-classes';

/**
 * Styled navbar variation (preset). Register it as `components.navbar` on
 * `SmartProvider` to restyle every `<SmartNavbar>`, or render it directly.
 *
 * The Preline collapsible navbar: a brand/logo slot, a responsive primary link
 * row (with the optional search / action / notification / user-menu slots),
 * an optional secondary link row and a mobile menu toggle. The collapse is
 * driven by the `mobileMenuOpen` state alone (no Preline JS). `options.dark`
 * switches to the solid dark colour variant.
 */
export function SmartNavbarPreset(props: SmartNavbarProps) {
  const { options, className } = props;
  const { mobileMenuOpen, toggleMobileMenu, itemClick } = useNavbar(props);

  const dark = Boolean(options?.dark);
  const items = options?.items ?? [];
  const secondaryItems = options?.secondaryItems ?? [];
  const brandClasses = getNavbarBrandClasses(dark);
  const toggleWrapperClasses = options?.menuButtonOnLeft
    ? 'smart:sm:hidden smart:order-first'
    : 'smart:sm:hidden';

  const renderItem = (item: INavbarItem, withIcon: boolean) => {
    const content = (
      <>
        {withIcon && item.iconTpl && (
          <span className="smart:shrink-0">{item.iconTpl}</span>
        )}
        {item.label}
      </>
    );

    return item.href ? (
      <SmartNavLink
        key={item.id}
        href={item.href}
        className={getNavbarItemClasses(dark, !!item.current)}
        aria-current={item.current ? 'page' : undefined}
      >
        {content}
      </SmartNavLink>
    ) : (
      <button
        key={item.id}
        type="button"
        className={getNavbarItemClasses(dark, !!item.current)}
        aria-current={item.current ? 'page' : undefined}
        onClick={() => itemClick(item.id)}
      >
        {content}
      </button>
    );
  };

  return (
    <header className={cn(getNavbarHeaderClasses(dark), className)}>
      <nav className={NAVBAR_NAV_CONTAINER}>
        <div className={NAVBAR_BRAND_ROW}>
          {options?.logoTpl ? (
            options.logoHref ? (
              <SmartNavLink
                href={options.logoHref}
                className={brandClasses}
                aria-label="Brand"
              >
                {options.logoTpl}
              </SmartNavLink>
            ) : (
              <span className={brandClasses} aria-label="Brand">
                {options.logoTpl}
              </span>
            )
          ) : options?.logoUrl ? (
            options.logoHref ? (
              <SmartNavLink
                href={options.logoHref}
                className={brandClasses}
                aria-label="Brand"
              >
                <img
                  className="smart:w-10 smart:h-auto"
                  src={options.logoUrl}
                  alt={options.logoAlt ?? ''}
                />
              </SmartNavLink>
            ) : (
              <span className={brandClasses} aria-label="Brand">
                <img
                  className="smart:w-10 smart:h-auto"
                  src={options.logoUrl}
                  alt={options.logoAlt ?? ''}
                />
              </span>
            )
          ) : null}

          <div className={toggleWrapperClasses}>
            <button
              type="button"
              className={getNavbarToggleClasses(dark)}
              aria-expanded={mobileMenuOpen}
              aria-controls="smart-navbar-collapse"
              aria-label="Toggle navigation"
              onClick={toggleMobileMenu}
            >
              {!mobileMenuOpen ? (
                <svg
                  className="smart:shrink-0 smart:size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              ) : (
                <svg
                  className="smart:shrink-0 smart:size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              )}
              <span className="smart:sr-only">Toggle navigation</span>
            </button>
          </div>
        </div>

        <div
          id="smart-navbar-collapse"
          className={getNavbarCollapseClasses(mobileMenuOpen)}
          role="region"
          aria-label="Main menu"
        >
          <div className={NAVBAR_LINKS_CONTAINER}>
            {items.map((item) => renderItem(item, true))}

            {options?.searchTpl && (
              <div className="smart:sm:ms-2">{options.searchTpl}</div>
            )}
            {options?.actionTpl && <div>{options.actionTpl}</div>}
            {options?.notificationTpl && <div>{options.notificationTpl}</div>}
            {options?.userMenuTpl && <div>{options.userMenuTpl}</div>}
          </div>
        </div>
      </nav>

      {secondaryItems.length > 0 && (
        <nav
          className={getNavbarSecondaryNavClasses(dark)}
          aria-label="Secondary"
        >
          <div className={NAVBAR_SECONDARY_CONTAINER}>
            {secondaryItems.map((item) => renderItem(item, false))}
          </div>
        </nav>
      )}
    </header>
  );
}
