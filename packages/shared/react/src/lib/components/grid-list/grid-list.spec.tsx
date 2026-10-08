import { render, screen } from '@testing-library/react';

import { SmartGridList } from './grid-list';
import { SmartGridListProps } from './grid-list.types';
import { SmartGridListPreset } from './preset/grid-list-preset';
import {
  getGridListColumnsClasses,
  getGridListGapClasses,
  getGridListGridClasses,
  getGridListMediaClasses,
  getGridListTileClasses,
} from './preset/preset-classes';
import { SmartGridListStandard } from './standard/grid-list-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartGridList', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartGridList />);

      expect(container.querySelector('.grid-list')).toBeInTheDocument();
    });

    it('should pass options and className to the standard implementation', () => {
      const { container } = render(
        <SmartGridList options={{ title: 'Team' }} className="passed-class" />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(container.querySelector('h3.title')).toHaveTextContent('Team');
    });

    it('should render the implementation registered as components["grid-list"]', () => {
      const Custom = ({ options }: SmartGridListProps) => (
        <div data-testid="custom">{options?.title}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'grid-list': Custom }}>
          <SmartGridList options={{ title: 'Injected' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Injected');
      expect(container.querySelector('.grid-list')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render the wrapper', () => {
      const { container } = render(<SmartGridListStandard />);

      expect(container.querySelector('.grid-list')).toBeInTheDocument();
    });

    it('should not render the list when no items are provided', () => {
      const { container } = render(<SmartGridListStandard />);

      expect(container.querySelector('ul[role="list"]')).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(<SmartGridListStandard />);

      expect(
        container.querySelectorAll(
          '.title, .description, .footer, .item, .icon, .image, .badge, .action, .empty',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the outer element', () => {
      const { container } = render(
        <SmartGridListStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the description', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{ title: 'Team', description: 'Active project members.' }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Active project members.',
      );
    });

    it('should render one li.item per item', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [
              { id: '1', title: 'Card A' },
              { id: '2', title: 'Card B' },
              { id: '3', title: 'Card C' },
            ],
          }}
        />,
      );

      expect(
        container.querySelectorAll('ul[role="list"] li.item'),
      ).toHaveLength(3);
    });

    it('should render the item title in span.title when there is no href', () => {
      const { container } = render(
        <SmartGridListStandard options={{ items: [{ title: 'Card A' }] }} />,
      );

      expect(container.querySelector('li.item span.title')).toHaveTextContent(
        'Card A',
      );
    });

    it('should render the item title as a link when href is provided', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{ items: [{ title: 'Card A', href: '/a' }] }}
        />,
      );

      expect(container.querySelector('li.item a.title')).toHaveAttribute(
        'href',
        '/a',
      );
    });

    it('should render the item description in span.description', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{ items: [{ title: 'Card A', description: 'About A' }] }}
        />,
      );

      expect(
        container.querySelector('li.item .body span.description'),
      ).toHaveTextContent('About A');
    });

    it('should render img.image when imageUrl is provided without iconTpl', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [
              {
                title: 'Card A',
                imageUrl: '/img/a.jpg',
                imageAlt: 'Card A image',
              },
            ],
          }}
        />,
      );

      const img = container.querySelector('li.item img.image');

      expect(img).toHaveAttribute('src', '/img/a.jpg');
      expect(img).toHaveAttribute('alt', 'Card A image');
    });

    it('should render iconTpl in span.icon over imageUrl', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [
              {
                title: 'Card A',
                imageUrl: '/img/a.jpg',
                iconTpl: <svg className="custom-icon" />,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.item span.icon svg.custom-icon'),
      ).toBeInTheDocument();
      expect(container.querySelector('li.item img.image')).toBeNull();
    });

    it('should render badgeTpl in span.badge', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [
              {
                title: 'Card A',
                badgeTpl: <span className="custom-badge">New</span>,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.item span.badge span.custom-badge'),
      ).toBeInTheDocument();
    });

    it('should render actionTpl in span.action', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [
              {
                title: 'Card A',
                actionTpl: <button className="action-btn">Open</button>,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.item span.action button.action-btn'),
      ).toBeInTheDocument();
    });

    it('should render emptyTpl when there are no items', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            items: [],
            emptyTpl: <p className="empty-msg">Brak rekordów</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty p.empty-msg')).toBeInTheDocument();
    });

    it('should render footerTpl inside .footer', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{
            footerTpl: <button className="footer-btn">Load more</button>,
          }}
        />,
      );

      expect(
        container.querySelector('.footer button.footer-btn'),
      ).toBeInTheDocument();
    });

    it('should set aria-label on the li when item.ariaLabel is provided', () => {
      const { container } = render(
        <SmartGridListStandard
          options={{ items: [{ title: 'Card A', ariaLabel: 'Open card A' }] }}
        />,
      );

      expect(container.querySelector('li.item')).toHaveAttribute(
        'aria-label',
        'Open card A',
      );
    });
  });
  describe('preset-classes', () => {
    it.each([
      [undefined, ''],
      [1, ''],
      [2, 'smart:sm:grid-cols-2'],
      [3, 'smart:sm:grid-cols-2 smart:lg:grid-cols-3'],
      [4, 'smart:sm:grid-cols-2 smart:lg:grid-cols-4'],
      [5, 'smart:sm:grid-cols-2 smart:lg:grid-cols-5'],
      [6, 'smart:sm:grid-cols-2 smart:lg:grid-cols-6'],
    ] as const)('should map %s columns to "%s"', (columns, expected) => {
      expect(getGridListColumnsClasses(columns)).toBe(expected);
    });

    it.each([
      ['sm', 'smart:gap-3'],
      ['md', 'smart:gap-4'],
      ['lg', 'smart:gap-6'],
      [undefined, 'smart:gap-4'],
    ] as const)('should map the %s gap to "%s"', (gap, expected) => {
      expect(getGridListGapClasses(gap)).toBe(expected);
    });

    it('should combine base grid, columns and gap', () => {
      expect(getGridListGridClasses({ columns: 3, gap: 'lg' })).toBe(
        'smart:grid smart:grid-cols-1 smart:sm:grid-cols-2 smart:lg:grid-cols-3 smart:gap-6',
      );
    });

    it('should keep only base grid and default gap for undefined options', () => {
      expect(getGridListGridClasses(undefined)).toBe(
        'smart:grid smart:grid-cols-1 smart:gap-4',
      );
    });

    it('should lay the horizontal tile as a row', () => {
      const classes = getGridListTileClasses('horizontal');

      expect(classes).toContain('smart:flex smart:items-center');
      expect(classes).not.toContain('smart:flex-col');
    });

    it('should center the logos tile', () => {
      expect(getGridListTileClasses('logos')).toContain('smart:text-center');
    });

    it('should default an undefined layout to cards', () => {
      expect(getGridListTileClasses(undefined)).toBe(
        getGridListTileClasses('cards'),
      );
    });

    it('should contain the logo media', () => {
      expect(getGridListMediaClasses('logos')).toContain(
        'smart:object-contain',
      );
    });
  });

  describe('preset', () => {
    function byRole(container: HTMLElement, role: string) {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render the header title and description above the grid', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{ title: 'Team', description: 'Our people' }}
        />,
      );

      const header = byRole(container, 'header');

      expect(header).toHaveClass('smart:mb-4');
      expect(header).toHaveTextContent('TeamOur people');
    });

    it('should not render the header without title and description', () => {
      const { container } = render(<SmartGridListPreset />);

      expect(byRole(container, 'header')).toBeNull();
    });

    it('should render the grid with responsive column classes', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{ columns: 4, items: [{ title: 'A' }] }}
        />,
      );

      const grid = byRole(container, 'grid');

      expect(grid).toHaveAttribute('role', 'list');
      expect(grid).toHaveClass('smart:grid', 'smart:lg:grid-cols-4');
    });

    it('should render one listitem tile per item', () => {
      render(
        <SmartGridListPreset
          options={{ items: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] }}
        />,
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should render the item title and description', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [{ title: 'Lindsay', description: 'Front-end developer' }],
          }}
        />,
      );

      expect(byRole(container, 'title')).toHaveTextContent('Lindsay');
      expect(byRole(container, 'description')).toHaveTextContent(
        'Front-end developer',
      );
    });

    it('should render the title as a link when href is set', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{ items: [{ title: 'Acme', href: '/acme' }] }}
        />,
      );

      const title = byRole(container, 'title');

      expect(title?.tagName).toBe('A');
      expect(title).toHaveAttribute('href', '/acme');
      expect(title).toHaveClass('smart:hover:text-blue-600');
    });

    it('should render an image item as media', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [{ title: 'Acme', imageUrl: '/logo.svg', imageAlt: 'Acme' }],
          }}
        />,
      );

      const img = byRole(container, 'media')?.querySelector('img');

      expect(img).toHaveAttribute('src', '/logo.svg');
      expect(img).toHaveAttribute('alt', 'Acme');
      expect(img).toHaveClass('smart:size-12');
    });

    it('should render the icon template as media over the image', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [
              {
                title: 'A',
                imageUrl: '/logo.svg',
                iconTpl: <svg data-testid="the-icon" />,
              },
            ],
          }}
        />,
      );

      const media = byRole(container, 'media');

      expect(media).toContainElement(screen.getByTestId('the-icon'));
      expect(media).toHaveClass('smart:rounded-lg');
      expect(media?.querySelector('img')).toBeNull();
    });

    it('should apply the horizontal layout arrangement on the tile', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{ layout: 'horizontal', items: [{ title: 'A' }] }}
        />,
      );

      const tile = byRole(container, 'item');

      expect(tile).toHaveClass('smart:items-center');
      expect(tile).not.toHaveClass('smart:flex-col');
    });

    it('should set aria-label on the tile when ariaLabel is set', () => {
      render(
        <SmartGridListPreset
          options={{ items: [{ title: 'A', ariaLabel: 'Tile A' }] }}
        />,
      );

      expect(screen.getByRole('listitem')).toHaveAttribute(
        'aria-label',
        'Tile A',
      );
    });

    it('should render the badge template beside the title', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [{ title: 'A', badgeTpl: <span data-testid="the-badge" /> }],
          }}
        />,
      );

      expect(byRole(container, 'badge')).toContainElement(
        screen.getByTestId('the-badge'),
      );
    });

    it('should render the action template in the tile footer', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [
              { title: 'A', actionTpl: <button data-testid="the-action" /> },
            ],
          }}
        />,
      );

      expect(byRole(container, 'action')).toContainElement(
        screen.getByTestId('the-action'),
      );
    });

    it('should render a centered default empty state when there are no items', () => {
      const { container } = render(
        <SmartGridListPreset options={{ items: [] }} />,
      );

      const empty = byRole(container, 'empty');

      expect(empty).toHaveClass('smart:text-center');
      expect(empty).toHaveTextContent('No items to display.');
    });

    it('should render the custom empty template when provided', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{ items: [], emptyTpl: <p data-testid="the-empty" /> }}
        />,
      );

      expect(byRole(container, 'empty')).toContainElement(
        screen.getByTestId('the-empty'),
      );
      expect(byRole(container, 'empty')).not.toHaveTextContent(
        'No items to display.',
      );
    });

    it('should render the footer template below the grid', () => {
      const { container } = render(
        <SmartGridListPreset
          options={{
            items: [{ title: 'A' }],
            footerTpl: <a data-testid="the-footer">More</a>,
          }}
        />,
      );

      expect(byRole(container, 'footer')).toContainElement(
        screen.getByTestId('the-footer'),
      );
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartGridListPreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:w-full',
        'my-extra-class',
      );
    });

    it('should render through SmartGridList when registered as "grid-list"', () => {
      const { container } = render(
        <SmartProvider components={{ 'grid-list': SmartGridListPreset }}>
          <SmartGridList
            options={{ items: [{ title: 'A' }] }}
            className="wrap"
          />
        </SmartProvider>,
      );

      expect(container.firstElementChild).toHaveClass('smart:w-full', 'wrap');
      expect(container.querySelector('.grid-list')).toBeNull();
    });
  });
});
