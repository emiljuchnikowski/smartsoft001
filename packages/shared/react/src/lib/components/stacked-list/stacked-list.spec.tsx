import { render, screen } from '@testing-library/react';

import { SmartStackedListPreset } from './preset/stacked-list-preset';
import { SmartStackedList } from './stacked-list';
import { SmartStackedListProps } from './stacked-list.types';
import { SmartStackedListStandard } from './standard/stacked-list-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartStackedList', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartStackedList />);

      expect(container.querySelector('.stacked-list')).toBeInTheDocument();
    });

    it('should pass options and className to the standard implementation', () => {
      const { container } = render(
        <SmartStackedList
          options={{ title: 'Team members' }}
          className="passed-class"
        />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(container.querySelector('h3.title')).toHaveTextContent(
        'Team members',
      );
    });

    it('should render the implementation registered as components["stacked-list"]', () => {
      const Custom = ({ options }: SmartStackedListProps) => (
        <div data-testid="custom">{options?.title}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'stacked-list': Custom }}>
          <SmartStackedList options={{ title: 'Injected' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Injected');
      expect(container.querySelector('.stacked-list')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should always render the wrapper', () => {
      const { container } = render(<SmartStackedListStandard />);

      expect(container.querySelector('.stacked-list')).toBeInTheDocument();
    });

    it('should not render the list when no items are provided', () => {
      const { container } = render(<SmartStackedListStandard />);

      expect(container.querySelector('ul[role="list"]')).toBeNull();
    });

    it('should not render any optional slot when none are provided', () => {
      const { container } = render(<SmartStackedListStandard />);

      expect(
        container.querySelectorAll(
          '.title, .description, .footer, .item, .action, .badge, .icon, .empty',
        ),
      ).toHaveLength(0);
    });

    it('should apply className on the outer element', () => {
      const { container } = render(
        <SmartStackedListStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render the description', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            title: 'Team members',
            description: 'Active project members.',
          }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Active project members.',
      );
    });

    it('should not render h3.title without options.title', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{ description: 'Only description' }}
        />,
      );

      expect(container.querySelector('h3.title')).toBeNull();
    });

    it('should render one li.item per item', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [
              { id: '1', title: 'Lindsay Walton' },
              { id: '2', title: 'Courtney Henry' },
              { id: '3', title: 'Tom Cook' },
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
        <SmartStackedListStandard
          options={{ items: [{ title: 'Lindsay Walton' }] }}
        />,
      );

      expect(container.querySelector('li.item span.title')).toHaveTextContent(
        'Lindsay Walton',
      );
    });

    it('should render the item title as a link when href is provided', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [{ title: 'Lindsay Walton', href: '/team/lindsay' }],
          }}
        />,
      );

      const link = container.querySelector('li.item a.title');

      expect(link).toHaveAttribute('href', '/team/lindsay');
      expect(link).toHaveTextContent('Lindsay Walton');
    });

    it('should render the item description and meta', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [
              {
                title: 'Lindsay Walton',
                description: 'Front-end Developer',
                meta: 'Joined 2026-01-12',
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('li.item .description')).toHaveTextContent(
        'Front-end Developer',
      );
      expect(container.querySelector('li.item .meta')).toHaveTextContent(
        'Joined 2026-01-12',
      );
    });

    it('should render img.avatar when avatarUrl is provided without iconTpl', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [{ title: 'Lindsay Walton', avatarUrl: '/img/lindsay.jpg' }],
          }}
        />,
      );

      const img = container.querySelector('li.item img.avatar');

      expect(img).toHaveAttribute('src', '/img/lindsay.jpg');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should render iconTpl in span.icon over avatarUrl', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [
              {
                title: 'Lindsay Walton',
                avatarUrl: '/img/lindsay.jpg',
                iconTpl: <svg className="custom-icon" />,
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li.item span.icon svg.custom-icon'),
      ).toBeInTheDocument();
      expect(container.querySelector('li.item img.avatar')).toBeNull();
    });

    it('should render badgeTpl in span.badge', () => {
      const { container } = render(
        <SmartStackedListStandard
          options={{
            items: [
              {
                title: 'Lindsay Walton',
                badgeTpl: <span className="custom-badge">Active</span>,
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
        <SmartStackedListStandard
          options={{
            items: [
              {
                title: 'Lindsay Walton',
                actionTpl: <button className="action-btn">View</button>,
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
        <SmartStackedListStandard
          options={{
            items: [],
            emptyTpl: <p className="empty-msg">No members yet</p>,
          }}
        />,
      );

      expect(container.querySelector('.empty p.empty-msg')).toBeInTheDocument();
    });

    it('should render footerTpl inside .footer', () => {
      const { container } = render(
        <SmartStackedListStandard
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
        <SmartStackedListStandard
          options={{
            items: [
              { title: 'Lindsay Walton', ariaLabel: 'Team member: Lindsay' },
            ],
          }}
        />,
      );

      expect(container.querySelector('li.item')).toHaveAttribute(
        'aria-label',
        'Team member: Lindsay',
      );
    });
  });
  describe('preset', () => {
    it('should render the title and description with dark-mode classes', () => {
      render(
        <SmartStackedListPreset
          options={{ title: 'Team members', description: 'People with access' }}
        />,
      );

      const title = screen.getByRole('heading', { name: 'Team members' });
      const description = screen.getByText('People with access');

      expect(title).toHaveClass('smart:text-gray-900', 'smart:dark:text-white');
      expect(description).toHaveClass('smart:dark:text-gray-400');
      expect(title.parentElement).toHaveClass('smart:mb-4');
    });

    it('should not render the list when there are no items', () => {
      render(<SmartStackedListPreset options={{ title: 'Team members' }} />);

      expect(screen.queryByRole('list')).toBeNull();
    });

    it('should render one row per item with title, description and meta', () => {
      render(
        <SmartStackedListPreset
          options={{
            items: [
              {
                id: '1',
                title: 'Lindsay Walton',
                description: 'lindsay@example.com',
                meta: 'Joined 2026',
              },
              { id: '2', title: 'Courtney Henry' },
            ],
          }}
        />,
      );

      const rows = screen.getAllByRole('listitem');

      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent(
        'Lindsay Waltonlindsay@example.comJoined 2026',
      );
    });

    it('should render the title as a link when href is set', () => {
      render(
        <SmartStackedListPreset
          options={{ items: [{ title: 'Report.pdf', href: '/files/report' }] }}
        />,
      );

      const link = screen.getByRole('link', { name: 'Report.pdf' });

      expect(link).toHaveAttribute('href', '/files/report');
      expect(link).toHaveClass(
        'smart:dark:text-white',
        'smart:hover:underline',
      );
    });

    it('should render a rounded avatar when avatarUrl is set', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{ items: [{ title: 'Lindsay', avatarUrl: '/a.png' }] }}
        />,
      );

      const img = container.querySelector('li img');

      expect(img).toHaveAttribute('src', '/a.png');
      expect(img).toHaveClass('smart:rounded-full', 'smart:dark:bg-gray-800');
    });

    it('should set aria-label on the row when ariaLabel is set', () => {
      render(
        <SmartStackedListPreset
          options={{
            items: [{ title: 'Lindsay', ariaLabel: 'Member Lindsay' }],
          }}
        />,
      );

      expect(screen.getByRole('listitem')).toHaveAttribute(
        'aria-label',
        'Member Lindsay',
      );
    });

    it('should draw dividers between rows when withDividers is true', () => {
      render(
        <SmartStackedListPreset
          options={{
            withDividers: true,
            items: [{ title: 'A' }, { title: 'B' }],
          }}
        />,
      );

      expect(screen.getByRole('list')).toHaveClass(
        'smart:divide-y',
        'smart:divide-gray-100',
        'smart:dark:divide-white/10',
      );
    });

    it('should not draw dividers when withDividers is not set', () => {
      render(
        <SmartStackedListPreset
          options={{ items: [{ title: 'A' }, { title: 'B' }] }}
        />,
      );

      expect(screen.getByRole('list')).not.toHaveClass('smart:divide-y');
    });

    it('should render the list as an edge-to-edge card on mobile when fullWidthOnMobile is true', () => {
      render(
        <SmartStackedListPreset
          options={{ fullWidthOnMobile: true, items: [{ title: 'A' }] }}
        />,
      );

      expect(screen.getByRole('list')).toHaveClass(
        'smart:-mx-4',
        'smart:sm:mx-0',
        'smart:sm:rounded-xl',
        'smart:dark:bg-gray-900',
      );
      expect(screen.getByRole('listitem')).toHaveClass(
        'smart:px-4',
        'smart:sm:px-6',
      );
    });

    it('should render a plain list without card padding when fullWidthOnMobile is not set', () => {
      render(<SmartStackedListPreset options={{ items: [{ title: 'A' }] }} />);

      expect(screen.getByRole('list')).not.toHaveClass('smart:-mx-4');
      expect(screen.getByRole('listitem')).not.toHaveClass('smart:px-4');
    });

    it('should render iconTpl in a rounded tile, taking precedence over avatarUrl', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{
            items: [
              {
                title: 'A',
                iconTpl: <svg className="custom-icon" />,
                avatarUrl: '/a.png',
              },
            ],
          }}
        />,
      );

      expect(
        container.querySelector('li svg.custom-icon')?.parentElement,
      ).toHaveClass('smart:rounded-full', 'smart:size-12');
      expect(container.querySelector('li img')).toBeNull();
    });

    it('should render badgeTpl and actionTpl in the trailing group', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{
            items: [
              {
                title: 'A',
                badgeTpl: <span className="custom-badge">Active</span>,
                actionTpl: <button className="custom-action">Remove</button>,
              },
            ],
          }}
        />,
      );

      const badge = container.querySelector('li .custom-badge');

      expect(badge?.parentElement).toHaveClass(
        'smart:shrink-0',
        'smart:gap-x-4',
      );
      expect(badge?.parentElement).toContainElement(
        container.querySelector('li .custom-action') as HTMLElement,
      );
    });

    it('should not render the trailing group without badge and action', () => {
      const { container } = render(
        <SmartStackedListPreset options={{ items: [{ title: 'A' }] }} />,
      );

      expect(container.querySelector('li')?.children).toHaveLength(1);
    });

    it('should render emptyTpl when there are no items', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{
            items: [],
            emptyTpl: <p className="custom-empty">No members</p>,
          }}
        />,
      );

      expect(
        container.querySelector('.custom-empty')?.parentElement,
      ).toHaveClass('smart:dark:text-gray-400', 'smart:border-dashed');
    });

    it('should not render emptyTpl when there are items', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{
            items: [{ title: 'A' }],
            emptyTpl: <p className="custom-empty">No members</p>,
          }}
        />,
      );

      expect(container.querySelector('.custom-empty')).toBeNull();
    });

    it('should render footerTpl under the list', () => {
      const { container } = render(
        <SmartStackedListPreset
          options={{
            items: [{ title: 'A' }],
            footerTpl: <a className="custom-footer">Load more</a>,
          }}
        />,
      );

      expect(
        container.querySelector('.custom-footer')?.parentElement,
      ).toHaveClass('smart:mt-4');
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartStackedListPreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'smart:w-full',
        'my-extra-class',
      );
    });

    it('should render through SmartStackedList and forward the className when registered as "stacked-list"', () => {
      const { container } = render(
        <SmartProvider components={{ 'stacked-list': SmartStackedListPreset }}>
          <SmartStackedList
            options={{
              title: 'Team members',
              items: [{ title: 'Lindsay Walton' }],
            }}
            className="wrapper-class"
          />
        </SmartProvider>,
      );

      expect(container.firstElementChild).toHaveClass('wrapper-class');
      expect(container).toHaveTextContent('Lindsay Walton');
      expect(container.querySelector('.stacked-list')).toBeNull();
    });
  });
});
