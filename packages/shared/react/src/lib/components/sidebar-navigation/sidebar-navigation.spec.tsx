import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

import { SmartSidebarNavigation } from './sidebar-navigation';
import { SmartSidebarNavigationProps } from './sidebar-navigation.types';
import { SmartSidebarNavigationStandard } from './standard/sidebar-navigation-standard';
import { useSidebarNavigation } from './use-sidebar-navigation';
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

describe('@smartsoft001/react: SmartSidebarNavigation', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartSidebarNavigation />);

      expect(
        container.querySelector('nav.sidebar-navigation'),
      ).toBeInTheDocument();
    });

    it('should render the implementation registered as components.sidebar-navigation', () => {
      const Custom = ({ options }: SmartSidebarNavigationProps) => (
        <div data-testid="custom">{options?.items?.length}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'sidebar-navigation': Custom }}>
          <SmartSidebarNavigation options={{ items: [{ id: 'a' }] }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('1');
      expect(
        container.querySelector('nav.sidebar-navigation'),
      ).not.toBeInTheDocument();
    });

    it('should pass onItemClick and onItemToggle to the registered implementation', () => {
      const onItemClick = jest.fn();
      const onItemToggle = jest.fn();
      const Custom = (props: SmartSidebarNavigationProps) => (
        <button
          type="button"
          onClick={() => {
            props.onItemClick?.({ itemId: 'a' });
            props.onItemToggle?.({ itemId: 'a', expanded: true });
          }}
        >
          custom
        </button>
      );
      render(
        <SmartProvider components={{ 'sidebar-navigation': Custom }}>
          <SmartSidebarNavigation
            onItemClick={onItemClick}
            onItemToggle={onItemToggle}
          />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'a' });
      expect(onItemToggle).toHaveBeenCalledWith({
        itemId: 'a',
        expanded: true,
      });
    });
  });

  describe('useSidebarNavigation', () => {
    it('should put options.items in a first group before options.groups', () => {
      const items = [{ id: 'home' }];
      const groups = [{ title: 'Other', items: [{ id: 'x' }] }];

      const { result } = renderHook(() =>
        useSidebarNavigation({ options: { items, groups } }),
      );

      expect(result.current.groups).toEqual([{ items }, ...groups]);
    });

    it('should start from item.expanded', () => {
      const { result } = renderHook(() => useSidebarNavigation({}));

      expect(result.current.isExpanded({ id: 'a', expanded: true })).toBe(true);
      expect(result.current.isExpanded({ id: 'b' })).toBe(false);
    });

    it('should flip the expanded state and report it', () => {
      const onItemToggle = jest.fn();
      const item = { id: 'a', expanded: true };
      const { result } = renderHook(() =>
        useSidebarNavigation({ onItemToggle }),
      );

      act(() => result.current.toggleExpanded(item));

      expect(result.current.isExpanded(item)).toBe(false);
      expect(onItemToggle).toHaveBeenCalledWith({
        itemId: 'a',
        expanded: false,
      });
    });
  });

  describe('standard', () => {
    it('should label the nav with options.ariaLabel', () => {
      render(
        <SmartSidebarNavigationStandard options={{ ariaLabel: 'Main' }} />,
      );

      expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass(
        'sidebar-navigation',
      );
    });

    it('should render an item with an href as a current anchor', () => {
      const { container } = render(
        <SmartSidebarNavigationStandard
          options={{
            items: [
              { id: 'dash', label: 'Dashboard', href: '/dash', current: true },
            ],
          }}
        />,
      );

      const anchor = container.querySelector('li.item a.item-link');

      expect(anchor).toHaveAttribute('href', '/dash');
      expect(anchor).toHaveClass('current');
      expect(anchor).toHaveAttribute('aria-current', 'page');
      expect(anchor).toHaveTextContent('Dashboard');
    });

    it('should render an item without an href as a button and call onItemClick', () => {
      const onItemClick = jest.fn();
      const { container } = render(
        <SmartSidebarNavigationStandard
          options={{ items: [{ id: 'team', label: 'Team' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(
        container.querySelector('button.item-button') as HTMLElement,
      );

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'team' });
    });

    it('should render the badge, the initial and the icon', () => {
      const { container } = render(
        <SmartSidebarNavigationStandard
          options={{
            items: [
              { id: 'a', label: 'A', badge: 12 },
              { id: 'h', label: 'Heroicons', initial: 'H' },
              { id: 'i', label: 'Icon', initial: 'I', iconTpl: <i>icon</i> },
            ],
          }}
        />,
      );

      expect(container.querySelector('span.item-badge')).toHaveTextContent(
        '12',
      );
      expect(container.querySelectorAll('span.item-initial')).toHaveLength(1);
      expect(container.querySelector('span.item-initial')).toHaveTextContent(
        'H',
      );
      expect(container.querySelector('span.item-icon')).toHaveTextContent(
        'icon',
      );
    });

    it('should render the groups with their titles', () => {
      const { container } = render(
        <SmartSidebarNavigationStandard
          options={{
            items: [{ id: 'home', label: 'Home' }],
            groups: [
              {
                id: 'teams',
                title: 'Your teams',
                items: [{ id: 'h', label: 'Heroicons', initial: 'H' }],
              },
            ],
          }}
        />,
      );

      const titles = container.querySelectorAll('.group-title');

      expect(container.querySelectorAll('li.group')).toHaveLength(2);
      expect(titles).toHaveLength(1);
      expect(titles[0]).toHaveTextContent('Your teams');
    });

    it('should render internal links through the navigation linkComponent', () => {
      render(
        <SmartProvider navigation={routerNavigation()}>
          <SmartSidebarNavigationStandard
            options={{
              items: [{ id: 'dash', label: 'Dashboard', href: '/dash' }],
            }}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
        'data-router-link',
      );
    });

    describe('expandable items', () => {
      const teams = {
        id: 'teams',
        label: 'Teams',
        expandable: true,
        children: [
          { id: 'eng', label: 'Engineering', href: '/eng', current: true },
          { id: 'ops', label: 'Ops' },
        ],
      };

      it('should render a collapsed toggle', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard options={{ items: [teams] }} />,
        );

        const toggle = container.querySelector('button.item-toggle');

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(toggle).toHaveAttribute('aria-controls', 'sidebar-sub-teams');
        expect(toggle?.querySelector('.item-chevron')).toHaveAttribute(
          'aria-hidden',
          'true',
        );
        expect(container.querySelector('ul.children')).not.toBeInTheDocument();
      });

      it('should expand the children on toggle and call onItemToggle', () => {
        const onItemToggle = jest.fn();
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ items: [teams] }}
            onItemToggle={onItemToggle}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: /Teams/ }));

        expect(onItemToggle).toHaveBeenCalledWith({
          itemId: 'teams',
          expanded: true,
        });
        expect(container.querySelector('ul.children')).toHaveAttribute(
          'id',
          'sidebar-sub-teams',
        );
        expect(screen.getByRole('button', { name: /Teams/ })).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      });

      it('should render the children as links and buttons', () => {
        const onItemClick = jest.fn();
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ items: [{ ...teams, expanded: true }] }}
            onItemClick={onItemClick}
          />,
        );

        const link = container.querySelector('li.child a.child-link');
        fireEvent.click(
          container.querySelector('button.child-button') as HTMLElement,
        );

        expect(link).toHaveAttribute('href', '/eng');
        expect(link).toHaveClass('current');
        expect(link).toHaveAttribute('aria-current', 'page');
        expect(link?.querySelector('span.child-label')).toHaveTextContent(
          'Engineering',
        );
        expect(onItemClick).toHaveBeenCalledWith({ itemId: 'ops' });
      });

      it('should collapse an item that starts expanded', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ items: [{ ...teams, expanded: true }] }}
          />,
        );

        fireEvent.click(screen.getByRole('button', { name: /Teams/ }));

        expect(container.querySelector('ul.children')).not.toBeInTheDocument();
      });

      it('should not render an empty children list', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{
              items: [{ ...teams, expanded: true, children: [] }],
            }}
          />,
        );

        expect(container.querySelector('ul.children')).not.toBeInTheDocument();
      });
    });

    describe('logo', () => {
      it('should not render the logo block without options.logo', () => {
        const { container } = render(<SmartSidebarNavigationStandard />);

        expect(
          container.querySelector('.sidebar-logo'),
        ).not.toBeInTheDocument();
      });

      it('should render the logo image', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ logo: { url: '/logo.svg', alt: 'Logo' } }}
          />,
        );

        const img = container.querySelector('.sidebar-logo img');

        expect(img).toHaveClass('sidebar-logo-img');
        expect(img).toHaveAttribute('src', '/logo.svg');
        expect(img).toHaveAttribute('alt', 'Logo');
      });

      it('should render both images inside the link when logo.href is set', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{
              logo: { url: '/logo.svg', urlDark: '/dark.svg', href: '/' },
            }}
          />,
        );

        const link = container.querySelector('.sidebar-logo a');
        const images = link?.querySelectorAll('img');

        expect(link).toHaveAttribute('href', '/');
        expect(images).toHaveLength(2);
        expect(images?.[1]).toHaveClass('sidebar-logo-img-dark');
        expect(images?.[1]).toHaveAttribute('src', '/dark.svg');
      });

      it('should render logo.tpl instead of the images', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ logo: { tpl: <b>Brand</b>, url: '/logo.svg' } }}
          />,
        );

        expect(container.querySelector('.sidebar-logo')).toHaveTextContent(
          'Brand',
        );
        expect(container.querySelector('img')).not.toBeInTheDocument();
      });
    });

    describe('profile', () => {
      it('should render the profile footer', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{
              profile: {
                name: 'Tom Cook',
                avatarUrl: '/avatar.jpg',
                avatarAlt: 'Tom',
                href: '/me',
                srOnlyText: 'Your profile',
              },
            }}
          />,
        );

        expect(
          container.querySelector('li.profile a.profile-link'),
        ).toHaveAttribute('href', '/me');
        expect(container.querySelector('.profile-avatar')).toHaveAttribute(
          'src',
          '/avatar.jpg',
        );
        expect(container.querySelector('.profile-name')).toHaveTextContent(
          'Tom Cook',
        );
        expect(container.querySelector('.profile-name')).toHaveAttribute(
          'aria-hidden',
          'true',
        );
        expect(container.querySelector('.sr-only')).toHaveTextContent(
          'Your profile',
        );
      });

      it('should link the profile to # without profile.href', () => {
        const { container } = render(
          <SmartSidebarNavigationStandard
            options={{ profile: { name: 'Tom' } }}
          />,
        );

        expect(container.querySelector('a.profile-link')).toHaveAttribute(
          'href',
          '#',
        );
      });
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartSidebarNavigationStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'sidebar-navigation-wrapper',
        'my-extra-class',
      );
    });
  });
});
