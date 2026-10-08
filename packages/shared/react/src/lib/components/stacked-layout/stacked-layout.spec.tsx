import { render, screen } from '@testing-library/react';

import { SmartStackedLayoutPreset } from './preset/stacked-layout-preset';
import { SmartStackedLayout } from './stacked-layout';
import { SmartStackedLayoutProps } from './stacked-layout.types';
import { SmartStackedLayoutStandard } from './standard/stacked-layout-standard';
import { SmartStackedLayoutContainerWidth } from '../../models';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartStackedLayout', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartStackedLayout />);

      expect(container.querySelector('header nav')).toBeInTheDocument();
    });

    it('should pass options, className and children to the standard implementation', () => {
      const { container } = render(
        <SmartStackedLayout
          className="passed-class"
          options={{ title: 'Dashboard' }}
        >
          <p>main</p>
        </SmartStackedLayout>,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      expect(container.querySelector('main')).toHaveTextContent('main');
    });

    it('should render the implementation registered as components.stacked-layout', () => {
      const Custom = ({ children }: SmartStackedLayoutProps) => (
        <div data-testid="custom">{children}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'stacked-layout': Custom }}>
          <SmartStackedLayout>main</SmartStackedLayout>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('main');
      expect(container.querySelector('header')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should render a header with a nav and a main region', () => {
      const { container } = render(<SmartStackedLayoutStandard />);

      expect(container.querySelector('header nav')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('should render only the nav header without headerTpl or title', () => {
      const { container } = render(<SmartStackedLayoutStandard />);

      expect(container.querySelectorAll('header')).toHaveLength(1);
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartStackedLayoutStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should expose data-container-width="xl" by default', () => {
      const { container } = render(<SmartStackedLayoutStandard />);

      expect(container.firstElementChild).toHaveAttribute(
        'data-container-width',
        'xl',
      );
    });

    it('should expose options.containerWidth as data-container-width', () => {
      const { container } = render(
        <SmartStackedLayoutStandard options={{ containerWidth: 'sm' }} />,
      );

      expect(container.firstElementChild).toHaveAttribute(
        'data-container-width',
        'sm',
      );
    });

    it('should render options.title as an h1 in its own header', () => {
      const { container } = render(
        <SmartStackedLayoutStandard options={{ title: 'Dashboard' }} />,
      );

      expect(container.querySelectorAll('header')).toHaveLength(2);
      expect(
        container.querySelector('header > h1[data-role="title"]'),
      ).toHaveTextContent('Dashboard');
    });

    it('should not render an h1 without options.title', () => {
      const { container } = render(<SmartStackedLayoutStandard />);

      expect(container.querySelector('h1')).toBeNull();
    });

    it('should render children inside main', () => {
      const { container } = render(
        <SmartStackedLayoutStandard>
          <p className="content">main</p>
        </SmartStackedLayoutStandard>,
      );

      expect(container.querySelector('main p.content')).toBeInTheDocument();
    });

    it('should render options.navTpl inside the nav', () => {
      const { container } = render(
        <SmartStackedLayoutStandard
          options={{ navTpl: <a className="nav-link">Home</a> }}
        />,
      );

      expect(container.querySelector('nav a.nav-link')).toBeInTheDocument();
    });

    it('should render options.headerTpl in a second header', () => {
      const { container } = render(
        <SmartStackedLayoutStandard
          options={{ headerTpl: <h1 className="page-title">Dashboard</h1> }}
        />,
      );

      expect(container.querySelectorAll('header')).toHaveLength(2);
      expect(container.querySelector('h1.page-title')).toBeInTheDocument();
    });

    it('should prefer options.headerTpl over options.title', () => {
      const { container } = render(
        <SmartStackedLayoutStandard
          options={{
            headerTpl: <h1 className="page-title">Dashboard</h1>,
            title: 'Ignored',
          }}
        />,
      );

      expect(container.querySelectorAll('header')).toHaveLength(2);
      expect(container.querySelector('[data-role="title"]')).toBeNull();
      expect(container).not.toHaveTextContent('Ignored');
    });
  });

  describe('preset', () => {
    function zone(container: HTMLElement, role: string): HTMLElement | null {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render the page root zone with gray surface classes', () => {
      const { container } = render(<SmartStackedLayoutPreset />);

      expect(zone(container, 'root')).toHaveClass(
        'smart:min-h-full',
        'smart:bg-gray-50',
        'smart:dark:bg-gray-900',
      );
    });

    it('should render the header zone container', () => {
      const { container } = render(<SmartStackedLayoutPreset />);

      expect(zone(container, 'header')).toHaveClass('smart:py-4');
    });

    it('should render the content zone container', () => {
      const { container } = render(<SmartStackedLayoutPreset />);

      expect(zone(container, 'content')).toHaveClass('smart:py-8');
    });

    it('should wrap children in a bordered content card', () => {
      const { container } = render(
        <SmartStackedLayoutPreset>
          <p className="projected">Main content</p>
        </SmartStackedLayoutPreset>,
      );

      const card = zone(container, 'content')?.querySelector('div');

      expect(card).toHaveClass(
        'smart:rounded-lg',
        'smart:border',
        'smart:bg-white',
        'smart:dark:bg-gray-800',
      );
      expect(card?.querySelector('p.projected')).toHaveTextContent(
        'Main content',
      );
    });

    it('should not render the nav without navTpl', () => {
      const { container } = render(<SmartStackedLayoutPreset />);

      expect(zone(container, 'nav')).toBeNull();
    });

    it('should render navTpl inside the nav', () => {
      const { container } = render(
        <SmartStackedLayoutPreset
          options={{ navTpl: <div>Nav content</div> }}
        />,
      );

      expect(zone(container, 'nav')).toHaveTextContent('Nav content');
    });

    it('should render headerTpl in the header zone', () => {
      const { container } = render(
        <SmartStackedLayoutPreset
          options={{ headerTpl: <div>Header content</div> }}
        />,
      );

      expect(zone(container, 'header')).toHaveTextContent('Header content');
    });

    it('should render the title as fallback when headerTpl is absent', () => {
      const { container } = render(
        <SmartStackedLayoutPreset options={{ title: 'Dashboard' }} />,
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
        <SmartStackedLayoutPreset
          options={{ title: 'Dashboard', headerTpl: <div>Header content</div> }}
        />,
      );

      expect(zone(container, 'title')).toBeNull();
      expect(zone(container, 'header')).toHaveTextContent('Header content');
    });

    it.each<[SmartStackedLayoutContainerWidth, string]>([
      ['sm', 'smart:max-w-3xl'],
      ['md', 'smart:max-w-5xl'],
      ['lg', 'smart:max-w-6xl'],
      ['xl', 'smart:max-w-7xl'],
      ['full', 'smart:max-w-none'],
    ])('should map containerWidth "%s" to %s', (width, expected) => {
      const { container } = render(
        <SmartStackedLayoutPreset options={{ containerWidth: width }} />,
      );

      expect(zone(container, 'header')).toHaveClass(expected);
      expect(zone(container, 'content')).toHaveClass(expected);
    });

    it('should default to max-w-7xl when containerWidth is unset', () => {
      const { container } = render(<SmartStackedLayoutPreset />);

      expect(zone(container, 'header')).toHaveClass('smart:max-w-7xl');
      expect(zone(container, 'content')).toHaveClass('smart:max-w-7xl');
    });

    it('should merge className onto the root zone', () => {
      const { container } = render(
        <SmartStackedLayoutPreset className="my-extra-class" />,
      );

      expect(zone(container, 'root')).toHaveClass(
        'my-extra-class',
        'smart:min-h-full',
      );
    });
  });
});
