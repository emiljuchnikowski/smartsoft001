import { fireEvent, render, screen } from '@testing-library/react';

import { SmartEmptyState } from './empty-state';
import { SmartEmptyStateProps } from './empty-state.types';
import { SmartEmptyStatePreset } from './preset/empty-state-preset';
import { getEmptyStateActionClasses } from './preset/preset-classes';
import { SmartEmptyStateStandard } from './standard/empty-state-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartEmptyState', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartEmptyState options={{ title: 'Hello' }} />,
      );

      expect(container.querySelector('.empty-state')).toBeInTheDocument();
    });

    it('should pass options and className to the standard implementation', () => {
      const { container } = render(
        <SmartEmptyState options={{ title: 'Hello' }} className="wrap" />,
      );

      expect(container.firstElementChild).toHaveClass('wrap');
      expect(
        screen.getByRole('heading', { name: 'Hello' }),
      ).toBeInTheDocument();
    });

    it('should render the implementation registered as components["empty-state"]', () => {
      const Custom = ({ options }: SmartEmptyStateProps) => (
        <div data-testid="custom">{options?.title}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'empty-state': Custom }}>
          <SmartEmptyState options={{ title: 'Injected' }} />
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('Injected');
      expect(container.querySelector('.empty-state')).toBeNull();
    });

    it('should forward onActionClick to the registered implementation', () => {
      const Custom = ({ onActionClick }: SmartEmptyStateProps) => (
        <button
          type="button"
          onClick={() => onActionClick?.({ actionId: 'a' })}
        >
          go
        </button>
      );
      const onActionClick = jest.fn();
      render(
        <SmartProvider components={{ 'empty-state': Custom }}>
          <SmartEmptyState onActionClick={onActionClick} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'go' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'a' });
    });

    it('should forward onItemClick to the registered implementation', () => {
      const Custom = ({ onItemClick }: SmartEmptyStateProps) => (
        <button type="button" onClick={() => onItemClick?.({ itemId: 'i' })}>
          go
        </button>
      );
      const onItemClick = jest.fn();
      render(
        <SmartProvider components={{ 'empty-state': Custom }}>
          <SmartEmptyState onItemClick={onItemClick} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'go' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'i' });
    });
  });

  describe('standard', () => {
    it('should always render the wrapper', () => {
      const { container } = render(<SmartEmptyStateStandard />);

      expect(container.querySelector('.empty-state')).toBeInTheDocument();
    });

    it('should render the title when options.title is provided', () => {
      const { container } = render(
        <SmartEmptyStateStandard options={{ title: 'No projects' }} />,
      );

      expect(container.querySelector('h3.title')).toHaveTextContent(
        'No projects',
      );
    });

    it('should render the description when options.description is provided', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{ description: 'Get started by creating a new project.' }}
        />,
      );

      expect(container.querySelector('p.description')).toHaveTextContent(
        'Get started by creating a new project.',
      );
    });

    it('should render the iconTpl inside .icon', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{ iconTpl: <svg data-testid="icon" /> }}
        />,
      );

      expect(
        container.querySelector('.empty-state > .icon [data-testid="icon"]'),
      ).toBeInTheDocument();
    });

    it('should render the formTpl inside .form', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{ formTpl: <form data-testid="form" /> }}
        />,
      );

      expect(
        container.querySelector('.form [data-testid="form"]'),
      ).toBeInTheDocument();
    });

    it('should not render the actions block without actions', () => {
      const { container } = render(
        <SmartEmptyStateStandard options={{ actions: [] }} />,
      );

      expect(container.querySelector('.actions')).toBeNull();
    });

    it('should render action buttons with the variant class', () => {
      render(
        <SmartEmptyStateStandard
          options={{
            actions: [
              { id: 'create', label: 'New Project', variant: 'primary' },
            ],
          }}
        />,
      );

      const button = screen.getByRole('button', { name: 'New Project' });

      expect(button).toHaveClass('action', 'variant-primary');
    });

    it('should default the button action variant to primary', () => {
      render(
        <SmartEmptyStateStandard
          options={{ actions: [{ id: 'create', label: 'Create' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Create' })).toHaveClass(
        'variant-primary',
      );
    });

    it('should render an anchor when action.href is provided', () => {
      render(
        <SmartEmptyStateStandard
          options={{
            actions: [
              {
                id: 'learn',
                label: 'Learn more',
                href: '/learn',
                variant: 'secondary',
              },
            ],
          }}
        />,
      );

      const anchor = screen.getByRole('link', { name: 'Learn more' });

      expect(anchor).toHaveAttribute('href', '/learn');
      expect(anchor).toHaveClass('action', 'variant-secondary');
    });

    it('should default the anchor action variant to link', () => {
      render(
        <SmartEmptyStateStandard
          options={{ actions: [{ id: 'l', label: 'Docs', href: '/docs' }] }}
        />,
      );

      expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
        'variant-link',
      );
    });

    it('should render the action iconTpl inside span.icon', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            actions: [
              { id: 'a', label: 'A', iconTpl: <svg data-testid="a-icon" /> },
            ],
          }}
        />,
      );

      expect(
        container.querySelector(
          'button.action span.icon [data-testid="a-icon"]',
        ),
      ).toBeInTheDocument();
    });

    it('should call onActionClick on button click', () => {
      const onActionClick = jest.fn();
      render(
        <SmartEmptyStateStandard
          options={{ actions: [{ id: 'create', label: 'Create' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'create' });
    });

    it('should render the items list', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            items: [
              { id: 'list', title: 'Create a List', description: 'A list...' },
              {
                id: 'calendar',
                title: 'Create a Calendar',
                description: 'Stay on top...',
              },
            ],
          }}
        />,
      );

      const items = container.querySelectorAll('ul.items[role="list"] li.item');

      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('Create a List');
      expect(items[1]).toHaveTextContent('Create a Calendar');
    });

    it('should render the item description, meta, icon and image', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            items: [
              {
                id: 'a',
                title: 'A',
                description: 'Desc',
                meta: 'Meta',
                iconTpl: <svg data-testid="item-icon" />,
                imageUrl: '/a.png',
              },
            ],
          }}
        />,
      );

      expect(container.querySelector('.item-description')).toHaveTextContent(
        'Desc',
      );
      expect(container.querySelector('.item-meta')).toHaveTextContent('Meta');
      expect(
        container.querySelector('.item-icon [data-testid="item-icon"]'),
      ).toBeInTheDocument();
      expect(container.querySelector('img.item-image')).toHaveAttribute(
        'src',
        '/a.png',
      );
    });

    it('should default the item image alt to an empty string', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{ items: [{ id: 'a', imageUrl: '/a.png' }] }}
        />,
      );

      expect(container.querySelector('img.item-image')).toHaveAttribute(
        'alt',
        '',
      );
    });

    it('should call onItemClick when an item without href is clicked', () => {
      const onItemClick = jest.fn();
      render(
        <SmartEmptyStateStandard
          options={{ items: [{ id: 'list', title: 'Create a List' }] }}
          onItemClick={onItemClick}
        />,
      );
      const button = screen.getByRole('button', { name: 'Create a List' });

      fireEvent.click(button);

      expect(button).toHaveClass('item-button');
      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'list' });
    });

    it('should render an anchor when item.href is provided', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            items: [{ id: 'list', title: 'Create a List', href: '/lists/new' }],
          }}
        />,
      );

      expect(container.querySelector('a.item-link')).toHaveAttribute(
        'href',
        '/lists/new',
      );
    });

    it('should render the itemsTitle when provided', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            itemsTitle: 'Recommended templates',
            items: [{ id: 'a', title: 'A' }],
          }}
        />,
      );

      expect(container.querySelector('h4.items-title')).toHaveTextContent(
        'Recommended templates',
      );
    });

    it('should render the footer link with href when both are provided', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{
            footerLinkLabel: 'Or start from an empty project',
            footerLinkHref: '/projects/new',
          }}
        />,
      );

      const link = container.querySelector('.footer a.footer-link');

      expect(link).toHaveAttribute('href', '/projects/new');
      expect(link).toHaveTextContent('Or start from an empty project');
    });

    it('should render the footer label as a span when there is no href', () => {
      const { container } = render(
        <SmartEmptyStateStandard
          options={{ footerLinkLabel: 'Or start fresh' }}
        />,
      );

      expect(container.querySelector('span.footer-link')).toHaveTextContent(
        'Or start fresh',
      );
    });

    it('should apply className on the outer element', () => {
      const { container } = render(
        <SmartEmptyStateStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });
  });
  describe('preset', () => {
    it('should apply the container preset classes on the root', () => {
      const { container } = render(<SmartEmptyStatePreset />);

      expect(container.firstElementChild).toHaveClass(
        'smart:max-w-sm',
        'smart:flex-col',
      );
    });

    it('should render the title and description', () => {
      render(
        <SmartEmptyStatePreset
          options={{
            title: 'No draft invoices',
            description: 'Draft an invoice and send it to a customer.',
          }}
        />,
      );

      expect(
        screen.getByRole('heading', { level: 3, name: 'No draft invoices' }),
      ).toHaveClass('smart:font-semibold');
      expect(
        screen.getByText('Draft an invoice and send it to a customer.'),
      ).toHaveClass('smart:text-gray-500');
    });

    it('should render the iconTpl inside the icon tile', () => {
      render(
        <SmartEmptyStatePreset
          options={{ iconTpl: <svg data-testid="icon" /> }}
        />,
      );

      expect(screen.getByTestId('icon').parentElement).toHaveClass(
        'smart:size-11',
      );
    });

    it('should render the formTpl', () => {
      render(
        <SmartEmptyStatePreset
          options={{ formTpl: <form data-testid="form" /> }}
        />,
      );

      expect(screen.getByTestId('form').parentElement).toHaveClass(
        'smart:mt-5',
      );
    });

    it('should render a primary action button by default', () => {
      render(
        <SmartEmptyStatePreset
          options={{
            actions: [{ id: 'create', label: 'Create a new invoice' }],
          }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Create a new invoice' }),
      ).toHaveClass('smart:bg-blue-600');
    });

    it('should call onActionClick with the action id', () => {
      const onActionClick = jest.fn();
      render(
        <SmartEmptyStatePreset
          options={{ actions: [{ id: 'create', label: 'Create' }] }}
          onActionClick={onActionClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      expect(onActionClick).toHaveBeenCalledWith({ actionId: 'create' });
    });

    it('should apply the secondary variant classes on the action button', () => {
      render(
        <SmartEmptyStatePreset
          options={{
            actions: [
              { id: 'tpl', label: 'Use a Template', variant: 'secondary' },
            ],
          }}
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Use a Template' }),
      ).toHaveClass('smart:bg-white', 'smart:border-gray-200');
    });

    it('should render an anchor with the link look for actions with an href', () => {
      render(
        <SmartEmptyStatePreset
          options={{ actions: [{ id: 'docs', label: 'Docs', href: '/docs' }] }}
        />,
      );

      const anchor = screen.getByRole('link', { name: 'Docs' });

      expect(anchor).toHaveAttribute('href', '/docs');
      expect(anchor).toHaveClass('smart:text-blue-600');
    });

    it('should render the footer link with a chevron when footerLinkHref is set', () => {
      render(
        <SmartEmptyStatePreset
          options={{ footerLinkLabel: 'Learn more', footerLinkHref: '#' }}
        />,
      );

      const link = screen.getByRole('link', { name: 'Learn more' });

      expect(link).toHaveClass('smart:text-blue-600');
      expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render the footer label as a span without href', () => {
      render(
        <SmartEmptyStatePreset options={{ footerLinkLabel: 'Learn more' }} />,
      );

      const label = screen.getByText('Learn more');

      expect(label.tagName).toBe('SPAN');
      expect(label).toHaveClass('smart:text-blue-600');
    });

    it('should render the items title and call onItemClick on a button item', () => {
      const onItemClick = jest.fn();
      render(
        <SmartEmptyStatePreset
          options={{
            itemsTitle: 'Suggestions',
            items: [{ id: 'a', title: 'First' }],
          }}
          onItemClick={onItemClick}
        />,
      );

      expect(
        screen.getByRole('heading', { level: 4, name: 'Suggestions' }),
      ).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'First' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'a' });
    });

    it('should render an anchor for items with an href', () => {
      render(
        <SmartEmptyStatePreset
          options={{
            items: [
              {
                id: 'a',
                title: 'First',
                description: 'Desc',
                meta: 'Meta',
                href: '/a',
                imageUrl: '/a.png',
              },
            ],
          }}
        />,
      );

      const anchor = screen.getByRole('link');

      expect(anchor).toHaveAttribute('href', '/a');
      expect(anchor).toHaveTextContent('FirstDescMeta');
      expect(anchor.querySelector('img')).toHaveAttribute('alt', '');
    });

    it('should apply className on the root', () => {
      const { container } = render(
        <SmartEmptyStatePreset className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass(
        'my-extra-class',
        'smart:max-w-sm',
      );
    });

    it('should render through SmartEmptyState when registered as "empty-state"', () => {
      render(
        <SmartProvider components={{ 'empty-state': SmartEmptyStatePreset }}>
          <SmartEmptyState options={{ title: 'Empty' }} className="wrap" />
        </SmartProvider>,
      );

      expect(
        screen.getByRole('heading', { name: 'Empty' }).parentElement,
      ).toHaveClass('wrap', 'smart:max-w-sm');
    });
  });

  describe('getEmptyStateActionClasses', () => {
    it('should reuse the footer link look for the link variant', () => {
      expect(getEmptyStateActionClasses('link')).not.toContain('smart:py-2');
    });

    it('should use the ghost classes for the ghost variant', () => {
      expect(getEmptyStateActionClasses('ghost')).toContain(
        'smart:hover:bg-gray-100',
      );
    });
  });
});
