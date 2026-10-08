import { fireEvent, render, screen } from '@testing-library/react';

import { SmartTabsPreset } from './preset/tabs-preset';
import { SmartTabsStandard } from './standard/tabs-standard';
import { SmartTabs } from './tabs';
import { SmartTabsProps } from './tabs.types';
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

describe('@smartsoft001/react: SmartTabs', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartTabs />);

      expect(container.querySelector('nav.tabs-desktop')).toBeInTheDocument();
    });

    it('should render the implementation registered as components.tabs', () => {
      const Custom = ({ selectedId }: SmartTabsProps) => (
        <div data-testid="custom">{selectedId}</div>
      );

      const { container } = render(
        <SmartProvider components={{ tabs: Custom }}>
          <SmartTabs selectedId="b" />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('b');
      expect(
        container.querySelector('nav.tabs-desktop'),
      ).not.toBeInTheDocument();
    });

    it('should pass the callbacks to the registered implementation', () => {
      const onTabChange = jest.fn();
      const onSelectedIdChange = jest.fn();
      const Custom = (props: SmartTabsProps) => (
        <button
          type="button"
          onClick={() => {
            props.onTabChange?.({ tabId: 'b' });
            props.onSelectedIdChange?.('b');
          }}
        >
          custom
        </button>
      );
      render(
        <SmartProvider components={{ tabs: Custom }}>
          <SmartTabs
            onTabChange={onTabChange}
            onSelectedIdChange={onSelectedIdChange}
          />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onTabChange).toHaveBeenCalledWith({ tabId: 'b' });
      expect(onSelectedIdChange).toHaveBeenCalledWith('b');
    });
  });

  describe('standard', () => {
    const items = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];

    it('should label the desktop nav with options.ariaLabel', () => {
      render(<SmartTabsStandard options={{ ariaLabel: 'Sections' }} />);

      expect(screen.getByRole('navigation', { name: 'Sections' })).toHaveClass(
        'tabs-desktop',
      );
    });

    it('should render a tab with an href as an anchor', () => {
      const { container } = render(
        <SmartTabsStandard
          options={{ items: [{ id: 'a', label: 'Account', href: '/account' }] }}
        />,
      );

      expect(container.querySelector('li.tab a.tab-link')).toHaveAttribute(
        'href',
        '/account',
      );
    });

    it('should render a tab without an href as a button', () => {
      const { container } = render(
        <SmartTabsStandard
          options={{ items: [{ id: 'a', label: 'Tab A' }] }}
        />,
      );

      expect(container.querySelector('button.tab-button')).toHaveTextContent(
        'Tab A',
      );
    });

    it('should mark the selected tab with the current class and aria-current', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items }} selectedId="b" />,
      );

      const buttons = container.querySelectorAll('button.tab-button');

      expect(buttons[0]).not.toHaveClass('current');
      expect(buttons[0]).not.toHaveAttribute('aria-current');
      expect(buttons[1]).toHaveClass('current');
      expect(buttons[1]).toHaveAttribute('aria-current', 'page');
    });

    it('should mark the selected link tab as current', () => {
      const { container } = render(
        <SmartTabsStandard
          options={{ items: [{ id: 'a', label: 'A', href: '/a' }] }}
          selectedId="a"
        />,
      );

      expect(container.querySelector('a.tab-link')).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('should render the badge and the icon', () => {
      const { container } = render(
        <SmartTabsStandard
          options={{
            items: [{ id: 'a', label: 'A', badge: 5, iconTpl: <i>icon</i> }],
          }}
        />,
      );

      expect(container.querySelector('span.tab-badge')).toHaveTextContent('5');
      expect(container.querySelector('span.tab-icon')).toHaveTextContent(
        'icon',
      );
    });

    it('should render a zero badge', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items: [{ id: 'a', badge: 0 }] }} />,
      );

      expect(container.querySelector('span.tab-badge')).toHaveTextContent('0');
    });

    it('should render internal tab links through the navigation linkComponent', () => {
      render(
        <SmartProvider navigation={routerNavigation()}>
          <SmartTabsStandard
            options={{
              items: [{ id: 'a', label: 'Account', href: '/account' }],
            }}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
        'data-router-link',
      );
    });

    it('should call onTabChange and onSelectedIdChange on a tab click', () => {
      const onTabChange = jest.fn();
      const onSelectedIdChange = jest.fn();
      const { container } = render(
        <SmartTabsStandard
          options={{ items }}
          onTabChange={onTabChange}
          onSelectedIdChange={onSelectedIdChange}
        />,
      );

      fireEvent.click(container.querySelectorAll('button.tab-button')[1]);

      expect(onTabChange).toHaveBeenCalledWith({ tabId: 'b' });
      expect(onSelectedIdChange).toHaveBeenCalledWith('b');
    });

    it('should select the clicked tab when uncontrolled', () => {
      const { container } = render(<SmartTabsStandard options={{ items }} />);

      fireEvent.click(container.querySelectorAll('button.tab-button')[1]);

      expect(container.querySelectorAll('button.tab-button')[1]).toHaveClass(
        'current',
      );
    });

    it('should start from defaultSelectedId when uncontrolled', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items }} defaultSelectedId="a" />,
      );

      expect(container.querySelectorAll('button.tab-button')[0]).toHaveClass(
        'current',
      );
    });

    it('should keep a controlled selection until the prop changes', () => {
      const { container, rerender } = render(
        <SmartTabsStandard options={{ items }} selectedId="a" />,
      );

      fireEvent.click(container.querySelectorAll('button.tab-button')[1]);

      expect(
        container.querySelectorAll('button.tab-button')[1],
      ).not.toHaveClass('current');

      rerender(<SmartTabsStandard options={{ items }} selectedId="b" />);

      expect(container.querySelectorAll('button.tab-button')[1]).toHaveClass(
        'current',
      );
    });

    it('should render the mobile select with an option per item', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items }} selectedId="b" />,
      );

      const select = container.querySelector(
        '.tabs-mobile select',
      ) as HTMLSelectElement;

      expect(select).toHaveAttribute('aria-label', 'Select a tab');
      expect(select.querySelectorAll('option')).toHaveLength(2);
      expect(select.value).toBe('b');
    });

    it('should fall back to the item id as the option text', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items: [{ id: 'only' }] }} />,
      );

      expect(container.querySelector('option')).toHaveTextContent('only');
    });

    it('should not render the mobile select when showMobileSelect is false', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items, showMobileSelect: false }} />,
      );

      expect(container.querySelector('.tabs-mobile')).not.toBeInTheDocument();
    });

    it('should not render the mobile select without items', () => {
      const { container } = render(
        <SmartTabsStandard options={{ items: [] }} />,
      );

      expect(container.querySelector('.tabs-mobile')).not.toBeInTheDocument();
    });

    it('should change the selection from the mobile select', () => {
      const onTabChange = jest.fn();
      const { container } = render(
        <SmartTabsStandard options={{ items }} onTabChange={onTabChange} />,
      );

      fireEvent.change(container.querySelector('select') as HTMLElement, {
        target: { value: 'b' },
      });

      expect(onTabChange).toHaveBeenCalledWith({ tabId: 'b' });
      expect(container.querySelectorAll('button.tab-button')[1]).toHaveClass(
        'current',
      );
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartTabsStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });

  describe('preset', () => {
    const items = [
      { id: 'a', label: 'Tab A' },
      { id: 'b', label: 'Tab B' },
    ];

    it('should render a horizontal tablist labelled Tabs', () => {
      render(<SmartTabsPreset options={{ items }} />);

      const tablist = screen.getByRole('tablist', { name: 'Tabs' });

      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should render a tab trigger per item', () => {
      render(<SmartTabsPreset options={{ items }} />);

      const tabs = screen.getAllByRole('tab');

      expect(tabs).toHaveLength(2);
      expect(tabs[0]).toHaveTextContent('Tab A');
      expect(tabs[0]).toHaveAttribute('id', 'a-tab');
      expect(tabs[0]).toHaveAttribute('aria-controls', 'a');
    });

    it('should select the first tab by default', () => {
      render(<SmartTabsPreset options={{ items }} />);

      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('should apply the underline active classes to the current tab', () => {
      render(<SmartTabsPreset options={{ items }} />);

      expect(screen.getAllByRole('tab')[0]).toHaveClass(
        'smart:text-blue-600',
        'smart:after:bg-blue-600',
      );
    });

    it('should select a tab on click and call onTabChange', () => {
      const onTabChange = jest.fn();
      render(<SmartTabsPreset options={{ items }} onTabChange={onTabChange} />);

      fireEvent.click(screen.getAllByRole('tab')[1]);

      expect(onTabChange).toHaveBeenCalledWith({ tabId: 'b' });
      expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('should select a link tab on click', () => {
      const onTabChange = jest.fn();
      render(
        <SmartTabsPreset
          options={{ items: [{ id: 'a', label: 'Tab A', href: '#a' }] }}
          onTabChange={onTabChange}
        />,
      );

      fireEvent.click(screen.getByRole('tab'));

      expect(onTabChange).toHaveBeenCalledWith({ tabId: 'a' });
    });

    it('should apply the brand pill classes for pills-with-brand-color', () => {
      render(
        <SmartTabsPreset
          options={{ items, layout: 'pills-with-brand-color' }}
          selectedId="a"
        />,
      );

      expect(screen.getAllByRole('tab')[0]).toHaveClass(
        'smart:bg-blue-600',
        'smart:text-white',
        'smart:rounded-lg',
      );
    });

    it.each([
      ['pills', 'smart:bg-gray-100', 'smart:text-gray-500', 'smart:flex'],
      ['pills-on-gray', 'smart:bg-white', 'smart:bg-transparent', 'smart:p-1'],
      [
        'bar-with-underline',
        'smart:border-b-blue-600',
        'smart:hover:bg-gray-100',
        'smart:rounded-xl',
      ],
      ['simple', 'smart:font-semibold', 'smart:text-gray-500', 'smart:flex'],
      [
        'underline-full-width',
        'smart:after:bg-blue-600',
        'smart:flex-1',
        'smart:flex',
      ],
    ] as const)(
      '%s: should style the active tab, the inactive tab and the nav',
      (layout, activeClass, inactiveClass, navClass) => {
        render(<SmartTabsPreset options={{ items, layout }} />);

        const [active, inactive] = screen.getAllByRole('tab');

        expect(active).toHaveClass(activeClass);
        expect(inactive).toHaveClass(inactiveClass);
        expect(screen.getByRole('tablist')).toHaveClass(navClass);
      },
    );

    it('should tone the badge of an inactive tab gray', () => {
      render(
        <SmartTabsPreset
          options={{
            items: [
              { id: 'a', label: 'Tab A' },
              { id: 'b', label: 'Tab B', badge: 3 },
            ],
          }}
        />,
      );

      expect(screen.getByText('3')).toHaveClass('smart:bg-gray-100');
    });

    it('should render the bordered container only for underline layouts', () => {
      const { container, rerender } = render(
        <SmartTabsPreset options={{ items }} />,
      );

      expect(container.querySelector('nav')?.parentElement).toHaveClass(
        'smart:border-b',
      );

      rerender(<SmartTabsPreset options={{ items, layout: 'pills' }} />);

      expect(container.querySelector('nav')?.parentElement).not.toHaveClass(
        'smart:border-b',
      );
    });

    it('should render a count badge', () => {
      render(
        <SmartTabsPreset
          options={{
            items: [{ id: 'a', label: 'Tab A', badge: '99+' }],
            layout: 'underline-with-badges',
          }}
        />,
      );

      expect(screen.getByRole('tab').querySelector('span')).toHaveTextContent(
        '99+',
      );
    });

    it('should render an anchor when the item has an href', () => {
      render(
        <SmartTabsPreset
          options={{ items: [{ id: 'a', label: 'Tab A', href: '#a' }] }}
        />,
      );

      const tab = screen.getByRole('tab');

      expect(tab.tagName).toBe('A');
      expect(tab).toHaveAttribute('href', '#a');
    });

    it('should keep the tab role on internal links rendered by linkComponent', () => {
      render(
        <SmartProvider navigation={routerNavigation()}>
          <SmartTabsPreset
            options={{ items: [{ id: 'a', label: 'Tab A', href: '/a' }] }}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('tab')).toHaveAttribute('data-router-link');
    });

    it('should hide the desktop tabs below sm when the mobile select shows', () => {
      const { container } = render(<SmartTabsPreset options={{ items }} />);

      expect(container.querySelector('select')).toHaveClass('smart:sm:hidden');
      expect(
        container.querySelector('nav')?.parentElement?.parentElement,
      ).toHaveClass('smart:hidden', 'smart:sm:block');
    });

    it('should change the selection from the mobile select', () => {
      const onSelectedIdChange = jest.fn();
      const { container } = render(
        <SmartTabsPreset
          options={{ items }}
          onSelectedIdChange={onSelectedIdChange}
        />,
      );

      fireEvent.change(container.querySelector('select') as HTMLElement, {
        target: { value: 'b' },
      });

      expect(onSelectedIdChange).toHaveBeenCalledWith('b');
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartTabsPreset options={{ items }} className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });
});
