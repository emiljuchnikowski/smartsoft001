import { fireEvent, render, screen } from '@testing-library/react';

import { SmartNavbar } from './navbar';
import { SmartNavbarProps } from './navbar.types';
import { SmartNavbarPreset } from './preset/navbar-preset';
import { SmartNavbarStandard } from './standard/navbar-standard';
import {
  createHistoryNavigation,
  ISmartLinkProps,
  ISmartNavigation,
} from '../../providers/navigation';
import { SmartProvider } from '../../providers/smart-provider';

function routerNavigation(): ISmartNavigation {
  return {
    ...createHistoryNavigation(),
    linkComponent: ({ children, ...props }: ISmartLinkProps) => (
      <a data-router-link="" {...props}>
        {children}
      </a>
    ),
  };
}

describe('@smartsoft001/react: SmartNavbar', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartNavbar />);

      expect(container.querySelector('nav.navbar')).toBeInTheDocument();
    });

    it('should render the implementation registered as components.navbar', () => {
      const Custom = ({ options }: SmartNavbarProps) => (
        <div data-testid="custom">{options?.logoAlt}</div>
      );

      const { container } = render(
        <SmartProvider components={{ navbar: Custom }}>
          <SmartNavbar options={{ logoAlt: 'Acme' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Acme');
      expect(container.querySelector('nav.navbar')).not.toBeInTheDocument();
    });

    it('should pass the callbacks to the registered implementation', () => {
      const onItemClick = jest.fn();
      const onMobileMenuOpenChange = jest.fn();
      const Custom = (props: SmartNavbarProps) => (
        <button
          type="button"
          onClick={() => {
            props.onItemClick?.({ itemId: 'home' });
            props.onMobileMenuOpenChange?.(true);
          }}
        >
          custom
        </button>
      );
      render(
        <SmartProvider components={{ navbar: Custom }}>
          <SmartNavbar
            onItemClick={onItemClick}
            onMobileMenuOpenChange={onMobileMenuOpenChange}
          />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'home' });
      expect(onMobileMenuOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('standard', () => {
    it('should render the mobile menu toggle button', () => {
      render(<SmartNavbarStandard />);

      const toggle = screen.getByRole('button', { name: 'Toggle menu' });

      expect(toggle).toHaveClass('mobile-menu-toggle');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('should render the logo image', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{ logoUrl: '/logo.svg', logoAlt: 'Acme' }}
        />,
      );

      const img = container.querySelector('span.logo img');

      expect(img).toHaveAttribute('src', '/logo.svg');
      expect(img).toHaveAttribute('alt', 'Acme');
    });

    it('should wrap the logo in an anchor when logoHref is set', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{ logoUrl: '/logo.svg', logoHref: '/' }}
        />,
      );

      expect(container.querySelector('a.logo')).toHaveAttribute('href', '/');
    });

    it('should render logoTpl instead of the logo image', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{ logoTpl: <b>Brand</b>, logoUrl: '/logo.svg' }}
        />,
      );

      expect(container.querySelector('div.logo')).toHaveTextContent('Brand');
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should render items with an href as anchors', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{
            items: [
              { id: 'home', label: 'Home', href: '/', current: true },
              { id: 'team', label: 'Team', href: '/team' },
            ],
          }}
        />,
      );

      const anchors = container.querySelectorAll('ul.items a.item-link');

      expect(anchors).toHaveLength(2);
      expect(anchors[0]).toHaveClass('current');
      expect(anchors[0]).toHaveTextContent('Home');
      expect(anchors[1]).not.toHaveClass('current');
      expect(anchors[1]).toHaveAttribute('href', '/team');
    });

    it('should render items without an href as buttons', () => {
      render(
        <SmartNavbarStandard
          options={{ items: [{ id: 'menu', label: 'Menu' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Menu' })).toHaveClass(
        'item-button',
      );
    });

    it('should render the item icon', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{
            items: [{ id: 'menu', label: 'Menu', iconTpl: <i>icon</i> }],
          }}
        />,
      );

      expect(container.querySelector('.item-icon')).toHaveTextContent('icon');
    });

    it('should call onItemClick with the item id', () => {
      const onItemClick = jest.fn();
      render(
        <SmartNavbarStandard
          options={{ items: [{ id: 'menu', label: 'Menu' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Menu' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'menu' });
    });

    it('should render internal links through the navigation linkComponent', () => {
      render(
        <SmartProvider navigation={routerNavigation()}>
          <SmartNavbarStandard
            options={{
              items: [
                { id: 'team', label: 'Team', href: '/team' },
                { id: 'ext', label: 'Docs', href: 'https://example.com' },
              ],
            }}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute(
        'data-router-link',
      );
      expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute(
        'data-router-link',
      );
    });

    it('should not render the mobile menu by default', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{ items: [{ id: 'home', label: 'Home' }] }}
        />,
      );

      expect(container.querySelector('.mobile-menu')).not.toBeInTheDocument();
    });

    it('should open the mobile menu on toggle click when uncontrolled', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{ items: [{ id: 'home', label: 'Home', href: '/' }] }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));

      expect(container.querySelector('.mobile-menu')).toHaveTextContent('Home');
      expect(
        screen.getByRole('button', { name: 'Toggle menu' }),
      ).toHaveAttribute('aria-expanded', 'true');
    });

    it('should start open with defaultMobileMenuOpen', () => {
      const { container } = render(
        <SmartNavbarStandard
          defaultMobileMenuOpen
          options={{ items: [{ id: 'home', label: 'Home' }] }}
        />,
      );

      expect(container.querySelector('.mobile-menu')).toBeInTheDocument();
    });

    it('should call onMobileMenuOpenChange with the toggled state', () => {
      const onMobileMenuOpenChange = jest.fn();
      render(
        <SmartNavbarStandard
          mobileMenuOpen={false}
          onMobileMenuOpenChange={onMobileMenuOpenChange}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));

      expect(onMobileMenuOpenChange).toHaveBeenCalledWith(true);
    });

    it('should keep a controlled mobile menu closed until the prop changes', () => {
      const { container } = render(
        <SmartNavbarStandard
          mobileMenuOpen={false}
          options={{ items: [{ id: 'home', label: 'Home' }] }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Toggle menu' }));

      expect(container.querySelector('.mobile-menu')).not.toBeInTheDocument();
    });

    it('should render the mobile menu items with the current class', () => {
      const { container } = render(
        <SmartNavbarStandard
          mobileMenuOpen
          options={{
            items: [
              { id: 'home', label: 'Home', href: '/', current: true },
              { id: 'menu', label: 'Menu' },
            ],
          }}
        />,
      );

      const menu = container.querySelector('.mobile-menu') as HTMLElement;

      expect(menu.querySelector('a')).toHaveClass('current');
      expect(menu.querySelector('button')).not.toHaveClass('current');
    });

    it('should call onItemClick from a mobile menu button', () => {
      const onItemClick = jest.fn();
      const { container } = render(
        <SmartNavbarStandard
          mobileMenuOpen
          options={{ items: [{ id: 'menu', label: 'Menu' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(
        container.querySelector('.mobile-menu button') as HTMLElement,
      );

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'menu' });
    });

    it('should render the secondary navigation', () => {
      const { container } = render(
        <SmartNavbarStandard
          options={{
            secondaryItems: [
              { id: 'docs', label: 'Docs', href: '/docs' },
              { id: 'help', label: 'Help', current: true },
            ],
          }}
        />,
      );

      const secondary = container.querySelector('nav.navbar-secondary');

      expect(secondary?.querySelector('a.item-link')).toHaveTextContent('Docs');
      expect(secondary?.querySelector('button.item-button')).toHaveClass(
        'current',
      );
    });

    it('should call onItemClick from a secondary item button', () => {
      const onItemClick = jest.fn();
      render(
        <SmartNavbarStandard
          options={{ secondaryItems: [{ id: 'help', label: 'Help' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Help' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'help' });
    });

    it.each([
      ['searchTpl', 'search'],
      ['actionTpl', 'action'],
      ['notificationTpl', 'notification'],
      ['userMenuTpl', 'user-menu'],
    ])('should render %s in div.%s', (key, cssClass) => {
      const { container } = render(
        <SmartNavbarStandard options={{ [key]: <span>slot</span> }} />,
      );

      expect(
        container.querySelector(`nav.navbar > div.${cssClass}`),
      ).toHaveTextContent('slot');
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartNavbarStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const collapse = (container: HTMLElement) =>
      container.querySelector('#smart-navbar-collapse') as HTMLElement;

    it('should render anchor items with their label and href', () => {
      const { container } = render(
        <SmartNavbarPreset
          options={{ items: [{ id: 'home', label: 'Home', href: '/home' }] }}
        />,
      );

      const link = collapse(container).querySelector('a');

      expect(link).toHaveAttribute('href', '/home');
      expect(link).toHaveTextContent('Home');
    });

    it('should mark the current item as active', () => {
      const { container } = render(
        <SmartNavbarPreset
          options={{
            items: [
              { id: 'home', label: 'Home', href: '/home', current: true },
            ],
          }}
        />,
      );

      const link = collapse(container).querySelector('a');

      expect(link).toHaveClass('smart:text-blue-600', 'smart:font-medium');
      expect(link).toHaveAttribute('aria-current', 'page');
    });

    it('should render a button for items without an href and call onItemClick', () => {
      const onItemClick = jest.fn();
      const { container } = render(
        <SmartNavbarPreset
          options={{ items: [{ id: 'action', label: 'Action' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(
        collapse(container).querySelector('button') as HTMLElement,
      );

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'action' });
    });

    it('should hide the collapse area by default and reveal it when toggled', () => {
      const { container } = render(<SmartNavbarPreset />);

      expect(collapse(container)).toHaveClass('smart:hidden');

      fireEvent.click(
        screen.getByRole('button', { name: 'Toggle navigation' }),
      );

      expect(collapse(container)).not.toHaveClass('smart:hidden');
    });

    it('should swap the hamburger icon for the close icon when open', () => {
      render(<SmartNavbarPreset mobileMenuOpen />);

      const toggle = screen.getByRole('button', { name: 'Toggle navigation' });

      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(toggle.querySelectorAll('svg line')).toHaveLength(0);
      expect(toggle.querySelectorAll('svg path')).toHaveLength(2);
    });

    it('should call onMobileMenuOpenChange from the toggle', () => {
      const onMobileMenuOpenChange = jest.fn();
      render(
        <SmartNavbarPreset
          mobileMenuOpen
          onMobileMenuOpenChange={onMobileMenuOpenChange}
        />,
      );

      fireEvent.click(
        screen.getByRole('button', { name: 'Toggle navigation' }),
      );

      expect(onMobileMenuOpenChange).toHaveBeenCalledWith(false);
    });

    it('should put the toggle first when menuButtonOnLeft is set', () => {
      render(<SmartNavbarPreset options={{ menuButtonOnLeft: true }} />);

      expect(
        screen.getByRole('button', { name: 'Toggle navigation' }).parentElement,
      ).toHaveClass('smart:sm:hidden', 'smart:order-first');
    });

    it('should render an image logo wrapped in an anchor when logoHref is set', () => {
      const { container } = render(
        <SmartNavbarPreset
          options={{ logoUrl: '/logo.png', logoAlt: 'Acme', logoHref: '/' }}
        />,
      );

      const brand = container.querySelector('a[aria-label="Brand"]');

      expect(brand).toHaveAttribute('href', '/');
      expect(brand?.querySelector('img')).toHaveAttribute('src', '/logo.png');
      expect(brand?.querySelector('img')).toHaveAttribute('alt', 'Acme');
    });

    it('should render logoTpl in a span without logoHref', () => {
      const { container } = render(
        <SmartNavbarPreset options={{ logoTpl: <b>Brand tpl</b> }} />,
      );

      expect(
        container.querySelector('span[aria-label="Brand"]'),
      ).toHaveTextContent('Brand tpl');
    });

    it('should apply the dark color variant to the header and nav items', () => {
      const { container } = render(
        <SmartNavbarPreset
          options={{
            dark: true,
            items: [{ id: 'home', label: 'Home', href: '/home' }],
          }}
        />,
      );

      expect(container.querySelector('header')).toHaveClass(
        'smart:bg-gray-900',
      );
      expect(collapse(container).querySelector('a')).toHaveClass(
        'smart:text-white/70',
      );
    });

    it('should render the slot templates inside the collapse area', () => {
      const { container } = render(
        <SmartNavbarPreset
          options={{
            searchTpl: <span>search</span>,
            actionTpl: <span>action</span>,
            notificationTpl: <span>notification</span>,
            userMenuTpl: <span>user</span>,
          }}
        />,
      );

      expect(collapse(container)).toHaveTextContent(
        'searchactionnotificationuser',
      );
    });

    it('should render a secondary navigation row', () => {
      render(
        <SmartNavbarPreset
          options={{
            secondaryItems: [{ id: 'docs', label: 'Docs', href: '/docs' }],
          }}
        />,
      );

      expect(
        screen.getByRole('navigation', { name: 'Secondary' }),
      ).toHaveTextContent('Docs');
    });

    it('should apply className on the header', () => {
      const { container } = render(
        <SmartNavbarPreset className="my-extra-class" />,
      );

      expect(container.querySelector('header')).toHaveClass('my-extra-class');
    });
  });
});
