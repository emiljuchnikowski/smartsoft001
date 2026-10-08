import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SmartVerticalNavigationPreset } from './preset/vertical-navigation-preset';
import { SmartVerticalNavigationStandard } from './standard/vertical-navigation-standard';
import { useVerticalNavigation } from './use-vertical-navigation';
import { SmartVerticalNavigation } from './vertical-navigation';
import { SmartVerticalNavigationProps } from './vertical-navigation.types';
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

describe('@smartsoft001/react: SmartVerticalNavigation', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartVerticalNavigation />);

      expect(
        container.querySelector('nav.vertical-navigation'),
      ).toBeInTheDocument();
    });

    it('should render the implementation registered as components.vertical-navigation', () => {
      const Custom = ({ options }: SmartVerticalNavigationProps) => (
        <div data-testid="custom">{options?.items?.length}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'vertical-navigation': Custom }}>
          <SmartVerticalNavigation options={{ items: [{ id: 'a' }] }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('1');
      expect(
        container.querySelector('nav.vertical-navigation'),
      ).not.toBeInTheDocument();
    });

    it('should pass onItemClick to the registered implementation', () => {
      const onItemClick = jest.fn();
      const Custom = (props: SmartVerticalNavigationProps) => (
        <button
          type="button"
          onClick={() => props.onItemClick?.({ itemId: 'a' })}
        >
          custom
        </button>
      );
      render(
        <SmartProvider components={{ 'vertical-navigation': Custom }}>
          <SmartVerticalNavigation onItemClick={onItemClick} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'a' });
    });
  });

  describe('useVerticalNavigation', () => {
    it('should put options.items in a first group before options.groups', () => {
      const items = [{ id: 'home' }];
      const groups = [{ title: 'Other', items: [{ id: 'x' }] }];

      const { result } = renderHook(() =>
        useVerticalNavigation({ options: { items, groups } }),
      );

      expect(result.current.groups).toEqual([{ items }, ...groups]);
    });

    it('should have no groups without items', () => {
      const { result } = renderHook(() =>
        useVerticalNavigation({ options: { items: [], groups: [] } }),
      );

      expect(result.current.groups).toEqual([]);
    });
  });

  describe('standard', () => {
    it('should label the nav with options.ariaLabel', () => {
      render(
        <SmartVerticalNavigationStandard options={{ ariaLabel: 'Main' }} />,
      );

      expect(screen.getByRole('navigation', { name: 'Main' })).toHaveClass(
        'vertical-navigation',
      );
    });

    it('should render an item with an href as a current anchor', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
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
      expect(anchor?.querySelector('span.item-label')).toHaveTextContent(
        'Dashboard',
      );
    });

    it('should render an item without an href as a button', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
          options={{ items: [{ id: 'a', label: 'Item A' }] }}
        />,
      );

      const button = container.querySelector('button.item-button');

      expect(button).toHaveTextContent('Item A');
      expect(button).not.toHaveAttribute('aria-current');
    });

    it('should call onItemClick on a button click', () => {
      const onItemClick = jest.fn();
      render(
        <SmartVerticalNavigationStandard
          options={{ items: [{ id: 'team', label: 'Team' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Team' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'team' });
    });

    it('should render the badge', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
          options={{ items: [{ id: 'a', label: 'A', badge: 12 }] }}
        />,
      );

      expect(container.querySelector('span.item-badge')).toHaveTextContent(
        '12',
      );
    });

    it('should render the initial without an icon', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
          options={{ items: [{ id: 'w', label: 'Website', initial: 'W' }] }}
        />,
      );

      expect(container.querySelector('span.item-initial')).toHaveTextContent(
        'W',
      );
    });

    it('should render the icon instead of the initial', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
          options={{
            items: [{ id: 'w', initial: 'W', iconTpl: <i>icon</i> }],
          }}
        />,
      );

      expect(container.querySelector('span.item-icon')).toHaveTextContent(
        'icon',
      );
      expect(
        container.querySelector('span.item-initial'),
      ).not.toBeInTheDocument();
    });

    it('should render the groups with their titles', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard
          options={{
            groups: [
              { id: 'main', items: [{ id: 'a', label: 'A' }] },
              {
                id: 'projects',
                title: 'Projects',
                items: [{ id: 'p1', label: 'Project 1' }],
              },
            ],
          }}
        />,
      );

      const titles = container.querySelectorAll('.group-title');

      expect(container.querySelectorAll('li.group')).toHaveLength(2);
      expect(titles).toHaveLength(1);
      expect(titles[0]).toHaveTextContent('Projects');
    });

    it('should render internal links through the navigation linkComponent', () => {
      render(
        <SmartProvider navigation={routerNavigation()}>
          <SmartVerticalNavigationStandard
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

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartVerticalNavigationStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const options = {
      items: [
        { id: 'a', label: 'Tab 1', href: '#a' },
        { id: 'b', label: 'Tab 2', href: '#b', current: true },
        { id: 'c', label: 'Tab 3' },
      ],
    };

    it('should render an item per entry', () => {
      render(<SmartVerticalNavigationPreset options={options} />);

      expect(screen.getAllByRole('link')).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Tab 3' })).toBeInTheDocument();
    });

    it('should label the nav Sidebar by default', () => {
      render(<SmartVerticalNavigationPreset options={options} />);

      expect(
        screen.getByRole('navigation', { name: 'Sidebar' }),
      ).toBeInTheDocument();
    });

    it('should apply the active classes to the current item', () => {
      render(<SmartVerticalNavigationPreset options={options} />);

      const active = screen.getByRole('link', { name: 'Tab 2' });

      expect(active).toHaveAttribute('aria-current', 'page');
      expect(active).toHaveClass(
        'smart:border-blue-600',
        'smart:text-blue-600',
        'smart:font-medium',
      );
    });

    it('should apply the inactive classes to the other items', () => {
      render(<SmartVerticalNavigationPreset options={options} />);

      const inactive = screen.getByRole('link', { name: 'Tab 1' });

      expect(inactive).not.toHaveAttribute('aria-current');
      expect(inactive).toHaveClass(
        'smart:border-transparent',
        'smart:text-gray-500',
      );
    });

    it('should call onItemClick when a button item is clicked', () => {
      const onItemClick = jest.fn();
      render(
        <SmartVerticalNavigationPreset
          options={options}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Tab 3' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'c' });
    });

    it('should render the badge, the initial and the icon', () => {
      const { container } = render(
        <SmartVerticalNavigationPreset
          options={{
            items: [
              { id: 'a', label: 'Tab 1', href: '#a', badge: 5 },
              { id: 'b', label: 'Tab 2', initial: 'T' },
              { id: 'c', label: 'Tab 3', iconTpl: <i>icon</i> },
            ],
          }}
        />,
      );

      expect(screen.getByRole('link', { name: 'Tab 1 5' })).toBeInTheDocument();
      expect(
        container.querySelector('.smart\\:size-5.smart\\:rounded-md'),
      ).toHaveTextContent('T');
      expect(
        container.querySelector('.smart\\:shrink-0.smart\\:size-4'),
      ).toHaveTextContent('icon');
    });

    it('should render a nav per group after its title', () => {
      const { container } = render(
        <SmartVerticalNavigationPreset
          options={{
            items: [{ id: 'home', label: 'Home' }],
            groups: [
              { title: 'Section', items: [{ id: 'a', label: 'Tab 1' }] },
            ],
          }}
        />,
      );

      const navs = container.querySelectorAll('nav');

      expect(navs).toHaveLength(2);
      expect(navs[1].previousElementSibling).toHaveTextContent('Section');
      expect(navs[1].previousElementSibling).toHaveClass('smart:uppercase');
    });

    it('should apply className on the container', () => {
      const { container } = render(
        <SmartVerticalNavigationPreset
          options={options}
          className="my-extra-class"
        />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:border-e-2',
        'my-extra-class',
      );
    });
  });
});
