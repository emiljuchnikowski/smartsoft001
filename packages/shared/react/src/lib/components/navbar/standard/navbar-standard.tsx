import { INavbarItem } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNavLink } from '../nav-link';
import { SmartNavbarProps } from '../navbar.types';
import { useNavbar } from '../use-navbar';

/** The default navbar rendering (`<smart-navbar-standard>`). */
export function SmartNavbarStandard(props: SmartNavbarProps) {
  const { options, className } = props;
  const { mobileMenuOpen, toggleMobileMenu, itemClick } = useNavbar(props);
  const items = options?.items ?? [];
  const secondaryItems = options?.secondaryItems ?? [];

  // The primary and the secondary rows differ only by the icon.
  const renderItem = (item: INavbarItem, withIcon: boolean) => {
    const content = (
      <>
        {withIcon && item.iconTpl && (
          <span className="item-icon">{item.iconTpl}</span>
        )}
        {item.label}
      </>
    );

    return (
      <li key={item.id} className="item">
        {item.href ? (
          <SmartNavLink
            href={item.href}
            className={cn('item-link', item.current && 'current')}
          >
            {content}
          </SmartNavLink>
        ) : (
          <button
            type="button"
            className={cn('item-button', item.current && 'current')}
            onClick={() => itemClick(item.id)}
          >
            {content}
          </button>
        )}
      </li>
    );
  };

  return (
    <div className={className}>
      <nav className="navbar">
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Toggle menu</span>
        </button>
        {options?.logoTpl ? (
          <div className="logo">{options.logoTpl}</div>
        ) : options?.logoUrl ? (
          options.logoHref ? (
            <SmartNavLink href={options.logoHref} className="logo">
              <img src={options.logoUrl} alt={options.logoAlt ?? ''} />
            </SmartNavLink>
          ) : (
            <span className="logo">
              <img src={options.logoUrl} alt={options.logoAlt ?? ''} />
            </span>
          )
        ) : null}
        {items.length > 0 && (
          <ul className="items" role="list">
            {items.map((item) => renderItem(item, true))}
          </ul>
        )}
        {options?.searchTpl && (
          <div className="search">{options.searchTpl}</div>
        )}
        {options?.actionTpl && (
          <div className="action">{options.actionTpl}</div>
        )}
        {options?.notificationTpl && (
          <div className="notification">{options.notificationTpl}</div>
        )}
        {options?.userMenuTpl && (
          <div className="user-menu">{options.userMenuTpl}</div>
        )}
      </nav>
      {secondaryItems.length > 0 && (
        <nav className="navbar-secondary">
          <ul className="items" role="list">
            {secondaryItems.map((item) => renderItem(item, false))}
          </ul>
        </nav>
      )}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <ul role="list">
            {items.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <SmartNavLink
                    href={item.href}
                    className={item.current ? 'current' : undefined}
                  >
                    {item.label}
                  </SmartNavLink>
                ) : (
                  <button
                    type="button"
                    className={item.current ? 'current' : undefined}
                    onClick={() => itemClick(item.id)}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
