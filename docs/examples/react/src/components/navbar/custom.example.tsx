// #region usage
import {
  INavbarOptions,
  SmartNavbar,
  SmartNavbarProps,
  SmartProvider,
  useNavbar,
} from '@smartsoft001/react';

/**
 * A custom navbar built on `useNavbar`: the hook keeps the mobile menu state
 * (controlled through `mobileMenuOpen` or kept inside) and reports item clicks
 * through `itemClick(id)`; the implementation owns the markup.
 */
export function CustomNavbar(props: SmartNavbarProps) {
  const { options, className } = props;
  const { mobileMenuOpen, toggleMobileMenu, itemClick } = useNavbar(props);
  const items = options?.items ?? [];

  const classes = [
    'docs-navbar',
    options?.dark && 'docs-navbar--dark',
    options?.menuButtonOnLeft && 'docs-navbar--menu-left',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classes}>
      {options?.logoUrl && (
        <a className="docs-navbar__logo" href={options.logoHref ?? '#'}>
          <img src={options.logoUrl} alt={options.logoAlt ?? ''} />
        </a>
      )}

      <ul className="docs-navbar__items">
        {items.map((item) => (
          <li key={item.id}>
            <a
              className="docs-navbar__item"
              href={item.href ?? '#'}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => itemClick(item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="docs-navbar__toggle"
        aria-label="Toggle navigation"
        aria-expanded={mobileMenuOpen}
        onClick={toggleMobileMenu}
      >
        &#9776;
      </button>

      {mobileMenuOpen && (
        <ul className="docs-navbar__mobile">
          {items.map((item) => (
            <li key={item.id}>
              <a href={item.href ?? '#'}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

// A module constant: a new object on every render would change the context.
const components = { navbar: CustomNavbar };

const options: INavbarOptions = {
  dark: false,
  logoUrl: 'https://avatars.githubusercontent.com/u/10416742?s=200&v=4',
  logoAlt: 'Brand',
  logoHref: '#',
  items: [
    { id: 'landing', label: 'Landing', href: '#', current: true },
    { id: 'account', label: 'Account', href: '#' },
    { id: 'work', label: 'Work', href: '#' },
    { id: 'blog', label: 'Blog', href: '#' },
  ],
};

/**
 * Every `SmartNavbar` below this provider renders `CustomNavbar` instead of
 * the standard rendering.
 */
export function NavbarCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartNavbar options={options} />
    </SmartProvider>
  );
}
// #endregion
