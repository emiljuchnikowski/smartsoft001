import { render, screen } from '@testing-library/react';

import { SmartSidebarLayoutPreset } from './preset/sidebar-layout-preset';
import { SmartSidebarLayout } from './sidebar-layout';
import { SmartSidebarLayoutProps } from './sidebar-layout.types';
import { SmartSidebarLayoutStandard } from './standard/sidebar-layout-standard';
import { SmartProvider } from '../../providers/smart-provider';

function childTags(element: Element | null): string[] {
  return Array.from(element?.children ?? []).map((child) => child.tagName);
}

describe('@smartsoft001/react: SmartSidebarLayout', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(
        <SmartSidebarLayout>
          <p>main</p>
        </SmartSidebarLayout>,
      );

      expect(container.querySelector('aside')).toBeInTheDocument();
    });

    it('should pass options and className to the standard implementation', () => {
      const { container } = render(
        <SmartSidebarLayout
          className="passed-class"
          options={{ headerTpl: <h1>Dashboard</h1> }}
        />,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    it('should render the implementation registered as components.sidebar-layout', () => {
      const Custom = ({ children }: SmartSidebarLayoutProps) => (
        <div data-testid="custom">{children}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'sidebar-layout': Custom }}>
          <SmartSidebarLayout>main</SmartSidebarLayout>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('main');
      expect(container.querySelector('aside')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should render an aside and a main region', () => {
      const { container } = render(<SmartSidebarLayoutStandard />);

      expect(container.querySelector('aside')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should not render a header when options.headerTpl is missing', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard options={{ title: 'Dashboard' }} />,
      );

      expect(container.querySelector('header')).toBeNull();
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should place the aside before main by default', () => {
      const { container } = render(<SmartSidebarLayoutStandard />);

      expect(childTags(container.firstElementChild)).toEqual(['ASIDE', 'MAIN']);
    });

    it('should place the aside after main when sidebarPosition is right', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard options={{ sidebarPosition: 'right' }} />,
      );

      expect(childTags(container.firstElementChild)).toEqual(['MAIN', 'ASIDE']);
    });

    it('should render children inside main', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard>
          <p className="content">main</p>
        </SmartSidebarLayoutStandard>,
      );

      expect(container.querySelector('main p.content')).toHaveTextContent(
        'main',
      );
    });

    it('should render options.sidebarTpl inside the aside', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard
          options={{ sidebarTpl: <a className="nav-link">Home</a> }}
        />,
      );

      expect(container.querySelector('aside a.nav-link')).toHaveTextContent(
        'Home',
      );
    });

    it('should render options.headerTpl inside a header', () => {
      const { container } = render(
        <SmartSidebarLayoutStandard
          options={{ headerTpl: <h1 className="page-title">Dashboard</h1> }}
        />,
      );

      expect(container.querySelector('header h1.page-title')).toHaveTextContent(
        'Dashboard',
      );
    });
  });

  describe('preset', () => {
    function zone(container: HTMLElement, role: string): HTMLElement | null {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render the page root zone with gray surface classes', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      expect(zone(container, 'root')).toHaveClass(
        'smart:min-h-full',
        'smart:bg-gray-50',
        'smart:dark:bg-gray-900',
      );
    });

    it('should render the sidebar zone as a white aside', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      const sidebar = zone(container, 'sidebar');

      expect(sidebar?.tagName).toBe('ASIDE');
      expect(sidebar).toHaveClass(
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:shrink-0',
      );
    });

    it('should render the content zone as a gray main', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      const content = zone(container, 'content');

      expect(content?.tagName).toBe('MAIN');
      expect(content).toHaveClass('smart:bg-gray-50', 'smart:dark:bg-gray-900');
    });

    it('should render children inside the content zone', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset>
          <p className="projected">Main content</p>
        </SmartSidebarLayoutPreset>,
      );

      expect(
        zone(container, 'content')?.querySelector('p.projected'),
      ).toHaveTextContent('Main content');
    });

    it('should render options.sidebarTpl inside the sidebar zone', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset
          options={{ sidebarTpl: <a className="nav-link">Home</a> }}
        />,
      );

      expect(
        zone(container, 'sidebar')?.querySelector('a.nav-link'),
      ).toBeInTheDocument();
    });

    it('should not render the header zone without headerTpl or title', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      expect(zone(container, 'header')).toBeNull();
    });

    it('should render headerTpl in the header zone', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset
          options={{ headerTpl: <div>Header content</div> }}
        />,
      );

      expect(zone(container, 'header')).toHaveTextContent('Header content');
    });

    it('should render the title as fallback when headerTpl is absent', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset options={{ title: 'Dashboard' }} />,
      );

      const title = zone(container, 'title');

      expect(title).toHaveTextContent('Dashboard');
      expect(title).toHaveClass(
        'smart:text-2xl',
        'smart:font-semibold',
        'smart:dark:text-white',
      );
    });

    it('should prefer headerTpl over the title fallback', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset
          options={{ title: 'Dashboard', headerTpl: <div>Header content</div> }}
        />,
      );

      expect(zone(container, 'title')).toBeNull();
      expect(zone(container, 'header')).toHaveTextContent('Header content');
    });

    it('should style the header zone like the stacked-layout preset header', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset options={{ title: 'Dashboard' }} />,
      );

      expect(zone(container, 'header')).toHaveClass(
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:border-b',
      );
    });

    it('should use an end border and no reversed row for the default left sidebar', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      expect(zone(container, 'row')).toHaveClass('smart:flex');
      expect(zone(container, 'row')).not.toHaveClass('smart:flex-row-reverse');
      expect(zone(container, 'sidebar')).toHaveClass('smart:border-e');
      expect(zone(container, 'sidebar')).not.toHaveClass('smart:border-s');
    });

    it('should reverse the row and use a start border for a right sidebar', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset options={{ sidebarPosition: 'right' }} />,
      );

      expect(zone(container, 'row')).toHaveClass('smart:flex-row-reverse');
      expect(zone(container, 'sidebar')).toHaveClass('smart:border-s');
      expect(zone(container, 'sidebar')).not.toHaveClass('smart:border-e');
    });

    it('should use the full sidebar width by default', () => {
      const { container } = render(<SmartSidebarLayoutPreset />);

      expect(zone(container, 'sidebar')).toHaveClass('smart:w-64');
    });

    it('should narrow the sidebar when condensed', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset options={{ condensed: true }} />,
      );

      expect(zone(container, 'sidebar')).toHaveClass('smart:w-16');
      expect(zone(container, 'sidebar')).not.toHaveClass('smart:w-64');
    });

    it('should merge className onto the root zone', () => {
      const { container } = render(
        <SmartSidebarLayoutPreset className="my-extra-class" />,
      );

      expect(zone(container, 'root')).toHaveClass(
        'my-extra-class',
        'smart:min-h-full',
      );
    });
  });
});
