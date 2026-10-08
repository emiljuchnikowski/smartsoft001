import { fireEvent, render, screen } from '@testing-library/react';

import { SmartBreadcrumbs } from './breadcrumbs';
import { SmartBreadcrumbsProps } from './breadcrumbs.types';
import { SmartBreadcrumbsPreset } from './preset/breadcrumbs-preset';
import { SmartBreadcrumbsStandard } from './standard/breadcrumbs-standard';
import { IBreadcrumbsOptions } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartBreadcrumbs', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      render(
        <SmartBreadcrumbs
          options={{ items: [{ id: 'a', label: 'A', href: '/' }] }}
          className="wrap"
        />,
      );

      expect(screen.getByRole('navigation')).toHaveClass('breadcrumbs', 'wrap');
    });

    it('should render the implementation registered as components.breadcrumbs', () => {
      render(
        <SmartProvider components={{ breadcrumbs: SmartBreadcrumbsPreset }}>
          <SmartBreadcrumbs
            options={{ items: [{ id: 'a', label: 'A' }], layout: 'contained' }}
          />
        </SmartProvider>,
      );

      expect(screen.getByRole('navigation')).toHaveClass('smart:bg-gray-100');
    });

    it('should pass onItemClick to the registered implementation', () => {
      const onItemClick = jest.fn();
      const Custom = ({ onItemClick: click }: SmartBreadcrumbsProps) => (
        <button type="button" onClick={() => click?.({ itemId: 'a' })}>
          custom
        </button>
      );
      render(
        <SmartProvider components={{ breadcrumbs: Custom }}>
          <SmartBreadcrumbs onItemClick={onItemClick} />
        </SmartProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'custom' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'a' });
    });
  });

  describe('standard', () => {
    it('should render the nav with the default aria-label', () => {
      render(<SmartBreadcrumbsStandard />);

      expect(
        screen.getByRole('navigation', { name: 'Breadcrumb' }),
      ).toHaveClass('breadcrumbs');
    });

    it('should use the aria-label from options', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{ items: [], ariaLabel: 'Custom' }}
        />,
      );

      expect(
        screen.getByRole('navigation', { name: 'Custom' }),
      ).toBeInTheDocument();
    });

    it('should render an anchor for an item with href', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{ items: [{ id: 'home', label: 'Home', href: '/' }] }}
        />,
      );

      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toHaveAttribute('href', '/');
      expect(link).toHaveClass('breadcrumbs-link');
    });

    it('should render a button for an item without href', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{ items: [{ id: 'a', label: 'Item A' }] }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Item A' })).toHaveClass(
        'breadcrumbs-button',
      );
    });

    it('should call onItemClick with the item id when a button item is clicked', () => {
      const onItemClick = jest.fn();
      render(
        <SmartBreadcrumbsStandard
          options={{ items: [{ id: 'projects', label: 'Projects' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Projects' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'projects' });
    });

    it('should mark the current item with aria-current="page" and the current class', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{
            items: [
              { id: 'home', label: 'Home', href: '/' },
              { id: 'p', label: 'Project', href: '/p', current: true },
            ],
          }}
        />,
      );

      const current = screen.getByRole('link', { name: 'Project' });
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current).toHaveClass('current');
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
        'aria-current',
      );
    });

    it('should mark a current item without href as the current page button', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{ items: [{ id: 'p', label: 'Project', current: true }] }}
        />,
      );

      const current = screen.getByRole('button', { name: 'Project' });
      expect(current).toHaveAttribute('aria-current', 'page');
      expect(current).toHaveClass('breadcrumbs-button', 'current');
    });

    it('should render a separator between items but not before the first', () => {
      const { container } = render(
        <SmartBreadcrumbsStandard
          options={{
            items: [
              { id: 'home', label: 'Home', href: '/' },
              { id: 'p', label: 'Projects', href: '/p' },
              { id: 'n', label: 'Nero', href: '/p/n' },
            ],
          }}
        />,
      );

      const separators = container.querySelectorAll('.breadcrumbs-separator');
      expect(separators).toHaveLength(2);
      expect(separators[0]).toHaveAttribute('aria-hidden', 'true');
    });

    it('should default data-separator to chevron', () => {
      const { container } = render(
        <SmartBreadcrumbsStandard
          options={{
            items: [
              { id: 'a', label: 'A', href: '/a' },
              { id: 'b', label: 'B', href: '/b' },
            ],
          }}
        />,
      );

      expect(container.querySelector('.breadcrumbs-separator')).toHaveAttribute(
        'data-separator',
        'chevron',
      );
    });

    it('should set data-separator from options.separator', () => {
      const { container } = render(
        <SmartBreadcrumbsStandard
          options={{
            separator: 'slash',
            items: [
              { id: 'a', label: 'A', href: '/a' },
              { id: 'b', label: 'B', href: '/b' },
            ],
          }}
        />,
      );

      expect(container.querySelector('.breadcrumbs-separator')).toHaveAttribute(
        'data-separator',
        'slash',
      );
    });

    it('should render the sr-only label', () => {
      const { container } = render(
        <SmartBreadcrumbsStandard
          options={{ items: [{ id: 'home', href: '/', srOnlyLabel: 'Home' }] }}
        />,
      );

      expect(container.querySelector('.sr-only')).toHaveTextContent('Home');
    });

    it('should render the item icon', () => {
      render(
        <SmartBreadcrumbsStandard
          options={{
            items: [
              {
                id: 'home',
                href: '/',
                iconTpl: <svg data-testid="home-icon" />,
              },
            ],
          }}
        />,
      );

      expect(screen.getByTestId('home-icon').parentElement).toHaveClass(
        'breadcrumbs-icon',
      );
    });

    it('should apply className on the nav', () => {
      render(<SmartBreadcrumbsStandard className="extra" />);

      expect(screen.getByRole('navigation')).toHaveClass(
        'breadcrumbs',
        'extra',
      );
    });
  });

  describe('preset', () => {
    const items: IBreadcrumbsOptions['items'] = [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'center', label: 'App Center', href: '#' },
      { id: 'app', label: 'Application', current: true },
    ];

    function separators(container: HTMLElement) {
      return container.querySelectorAll('ol > li > svg');
    }

    it('should render one list item per crumb', () => {
      render(<SmartBreadcrumbsPreset options={{ items }} />);

      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('should render links for the non-current crumbs with a href', () => {
      render(<SmartBreadcrumbsPreset options={{ items }} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('Home');
    });

    it('should render the current crumb as a span with aria-current', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset options={{ items }} />,
      );

      const current = container.querySelector('[aria-current="page"]');
      expect(current?.tagName).toBe('SPAN');
      expect(current).toHaveTextContent('Application');
      expect(current).toHaveClass('smart:font-semibold');
    });

    it('should default to n - 1 chevron separators', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset options={{ items }} />,
      );

      const found = separators(container);
      expect(found).toHaveLength(2);
      expect(found[0]).toHaveClass('smart:size-4');
      expect(found[0].querySelector('path')).toHaveAttribute(
        'd',
        'm9 18 6-6-6-6',
      );
    });

    it('should render slash separators when options.separator is slash', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset options={{ items, separator: 'slash' }} />,
      );

      const separator = separators(container)[0];
      expect(separator).toHaveClass('smart:size-5');
      expect(separator.querySelector('path')).toHaveAttribute(
        'd',
        'M6 13L10 3',
      );
    });

    it('should render arrow separators when options.separator is arrow', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset options={{ items, separator: 'arrow' }} />,
      );

      const paths = separators(container)[0].querySelectorAll('path');
      expect(paths).toHaveLength(2);
      expect(paths[0]).toHaveAttribute('d', 'M5 12h14');
    });

    it('should derive slash separators from the simple-with-slashes layout', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset
          options={{ items, layout: 'simple-with-slashes' }}
        />,
      );

      expect(separators(container)[0]).toHaveClass('smart:size-5');
    });

    it('should apply the contained layout classes on the nav', () => {
      render(
        <SmartBreadcrumbsPreset options={{ items, layout: 'contained' }} />,
      );

      expect(screen.getByRole('navigation')).toHaveClass(
        'smart:bg-gray-100',
        'smart:rounded-lg',
      );
    });

    it('should render a button for a crumb without href and report its click', () => {
      const onItemClick = jest.fn();
      render(
        <SmartBreadcrumbsPreset
          options={{ items: [{ id: 'first', label: 'First' }] }}
          onItemClick={onItemClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'First' }));

      expect(onItemClick).toHaveBeenCalledWith({ itemId: 'first' });
    });

    it('should render the sr-only label', () => {
      const { container } = render(
        <SmartBreadcrumbsPreset
          options={{ items: [{ id: 'home', href: '/', srOnlyLabel: 'Home' }] }}
        />,
      );

      expect(container.querySelector('.smart\\:sr-only')).toHaveTextContent(
        'Home',
      );
    });

    it('should use the default aria-label', () => {
      render(<SmartBreadcrumbsPreset options={{ items }} />);

      expect(
        screen.getByRole('navigation', { name: 'Breadcrumb' }),
      ).toBeInTheDocument();
    });

    it('should use the provided aria-label', () => {
      render(<SmartBreadcrumbsPreset options={{ items, ariaLabel: 'Path' }} />);

      expect(
        screen.getByRole('navigation', { name: 'Path' }),
      ).toBeInTheDocument();
    });

    it('should apply className on the nav', () => {
      render(
        <SmartBreadcrumbsPreset
          options={{ items }}
          className="my-extra-class"
        />,
      );

      expect(screen.getByRole('navigation')).toHaveClass('my-extra-class');
    });
  });
});
