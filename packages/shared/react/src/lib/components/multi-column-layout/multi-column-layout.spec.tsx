import { render, screen } from '@testing-library/react';

import { SmartMultiColumnLayout } from './multi-column-layout';
import { SmartMultiColumnLayoutProps } from './multi-column-layout.types';
import { SmartMultiColumnLayoutPreset } from './preset/multi-column-layout-preset';
import {
  getMultiColumnLayoutContentContainerClasses,
  getMultiColumnLayoutSecondaryClasses,
} from './preset/preset-classes';
import { SmartMultiColumnLayoutStandard } from './standard/multi-column-layout-standard';
import { SmartProvider } from '../../providers/smart-provider';

describe('@smartsoft001/react: SmartMultiColumnLayout', () => {
  describe('wrapper', () => {
    it('should render the standard implementation by default', () => {
      const { container } = render(<SmartMultiColumnLayout />);

      expect(container.querySelectorAll('aside')).toHaveLength(2);
    });

    it('should pass options, className and children to the standard implementation', () => {
      const { container } = render(
        <SmartMultiColumnLayout
          className="passed-class"
          options={{ headerTpl: <h1>Inbox</h1> }}
        >
          <p>main</p>
        </SmartMultiColumnLayout>,
      );

      expect(container.firstElementChild).toHaveClass('passed-class');
      expect(screen.getByRole('heading', { name: 'Inbox' })).toBeVisible();
      expect(container.querySelector('main')).toHaveTextContent('main');
    });

    it('should render the implementation registered as components.multi-column-layout', () => {
      const Custom = ({ children }: SmartMultiColumnLayoutProps) => (
        <div data-testid="custom">{children}</div>
      );

      const { container } = render(
        <SmartProvider components={{ 'multi-column-layout': Custom }}>
          <SmartMultiColumnLayout>main</SmartMultiColumnLayout>
        </SmartProvider>,
      );

      expect(screen.getByTestId('custom')).toHaveTextContent('main');
      expect(container.querySelector('aside')).toBeNull();
    });
  });

  describe('standard', () => {
    it('should render the nav aside, main and the secondary aside in order', () => {
      const { container } = render(<SmartMultiColumnLayoutStandard />);

      const children = Array.from(
        container.firstElementChild?.children ?? [],
      ).map(
        (child) =>
          `${child.tagName}${child.className ? '.' : ''}${child.className}`,
      );

      expect(children).toEqual(['ASIDE.nav', 'MAIN', 'ASIDE.secondary']);
    });

    it('should not render a header when options.headerTpl is missing', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard options={{ title: 'Inbox' }} />,
      );

      expect(container.querySelector('header')).toBeNull();
    });

    it('should apply className on the wrapper', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard className="my-extra-class" />,
      );

      expect(container.firstElementChild).toHaveClass('my-extra-class');
    });

    it('should render children inside main', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard>
          <p className="content">main</p>
        </SmartMultiColumnLayoutStandard>,
      );

      expect(container.querySelector('main p.content')).toBeInTheDocument();
    });

    it('should render options.navTpl inside the nav aside', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard
          options={{ navTpl: <a className="nav-link">Home</a> }}
        />,
      );

      expect(
        container.querySelector('aside.nav a.nav-link'),
      ).toBeInTheDocument();
    });

    it('should render options.secondaryTpl inside the secondary aside', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard
          options={{ secondaryTpl: <p className="meta">Meta</p> }}
        />,
      );

      expect(
        container.querySelector('aside.secondary p.meta'),
      ).toBeInTheDocument();
    });

    it('should render options.headerTpl inside a header', () => {
      const { container } = render(
        <SmartMultiColumnLayoutStandard
          options={{ headerTpl: <h1 className="page-title">Inbox</h1> }}
        />,
      );

      expect(
        container.querySelector('header h1.page-title'),
      ).toBeInTheDocument();
    });
  });

  describe('preset', () => {
    function zone(container: HTMLElement, role: string): HTMLElement | null {
      return container.querySelector(`[data-role="${role}"]`);
    }

    it('should render the page root with gray surface classes', () => {
      const { container } = render(<SmartMultiColumnLayoutPreset />);

      expect(zone(container, 'root')).toHaveClass(
        'smart:min-h-full',
        'smart:bg-gray-50',
        'smart:dark:bg-gray-900',
      );
    });

    it('should merge className onto the root zone', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset className="my-extra-class" />,
      );

      expect(zone(container, 'root')).toHaveClass(
        'my-extra-class',
        'smart:min-h-full',
      );
    });

    it('should not render the header zone without headerTpl or title', () => {
      const { container } = render(<SmartMultiColumnLayoutPreset />);

      expect(zone(container, 'header')).toBeNull();
    });

    it('should render headerTpl in a header zone', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset
          options={{ headerTpl: <div>Header content</div> }}
        />,
      );

      const header = zone(container, 'header');

      expect(header?.tagName).toBe('HEADER');
      expect(header).toHaveTextContent('Header content');
    });

    it('should render the title as fallback when headerTpl is absent', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset options={{ title: 'Inbox' }} />,
      );

      const title = zone(container, 'title');

      expect(title?.tagName).toBe('H1');
      expect(title).toHaveTextContent('Inbox');
    });

    it('should prefer headerTpl over the title fallback', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset
          options={{ title: 'Inbox', headerTpl: <div>Header content</div> }}
        />,
      );

      expect(zone(container, 'title')).toBeNull();
      expect(zone(container, 'header')).toHaveTextContent('Header content');
    });

    it('should style the header zone like the stacked-layout preset header', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset options={{ title: 'Inbox' }} />,
      );

      expect(zone(container, 'header')).toHaveClass(
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:border-b',
      );
    });

    it('should not render the nav zone without navTpl', () => {
      const { container } = render(<SmartMultiColumnLayoutPreset />);

      expect(zone(container, 'nav')).toBeNull();
    });

    it('should render navTpl inside a styled nav aside', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset
          options={{ navTpl: <a className="nav-link">Home</a> }}
        />,
      );

      const nav = zone(container, 'nav');

      expect(nav?.tagName).toBe('ASIDE');
      expect(nav?.querySelector('a.nav-link')).toBeInTheDocument();
      expect(nav).toHaveClass(
        'smart:w-64',
        'smart:shrink-0',
        'smart:border-e',
        'smart:bg-white',
        'smart:dark:bg-gray-800',
      );
    });

    it('should render children in a gray main content zone', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset>
          <p className="projected">Main content</p>
        </SmartMultiColumnLayoutPreset>,
      );

      const content = zone(container, 'content');

      expect(content?.tagName).toBe('MAIN');
      expect(content).toHaveClass(
        'smart:bg-gray-50',
        'smart:dark:bg-gray-900',
        'smart:py-8',
      );
      expect(content?.querySelector('p.projected')).toHaveTextContent(
        'Main content',
      );
    });

    it('should use a full-width inner container by default', () => {
      const { container } = render(<SmartMultiColumnLayoutPreset />);

      const inner = zone(container, 'content')?.firstElementChild;

      expect(inner).toHaveClass('smart:px-4', 'smart:max-w-none');
      expect(inner).not.toHaveClass('smart:max-w-7xl');
    });

    it('should use a constrained inner container when width is constrained', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset options={{ width: 'constrained' }} />,
      );

      expect(zone(container, 'content')?.firstElementChild).toHaveClass(
        'smart:mx-auto',
        'smart:max-w-7xl',
        'smart:px-4',
      );
    });

    it('should not render the secondary zone without secondaryTpl', () => {
      const { container } = render(<SmartMultiColumnLayoutPreset />);

      expect(zone(container, 'secondary')).toBeNull();
    });

    it('should render secondaryTpl inside a styled secondary aside', () => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset
          options={{ secondaryTpl: <p className="filters">Filters</p> }}
        />,
      );

      const secondary = zone(container, 'secondary');

      expect(secondary?.tagName).toBe('ASIDE');
      expect(secondary?.querySelector('p.filters')).toBeInTheDocument();
      expect(secondary).toHaveClass(
        'smart:border-s',
        'smart:bg-white',
        'smart:dark:bg-gray-800',
        'smart:w-64',
      );
    });

    it.each([
      ['md', 'smart:w-80'],
      ['lg', 'smart:w-96'],
    ] as const)('should apply the %s secondary width', (width, expected) => {
      const { container } = render(
        <SmartMultiColumnLayoutPreset
          options={{ secondaryTpl: <p>Filters</p>, secondaryWidth: width }}
        />,
      );

      expect(zone(container, 'secondary')).toHaveClass(expected);
      expect(zone(container, 'secondary')).not.toHaveClass('smart:w-64');
    });
  });

  describe('preset classes', () => {
    it('should map the content width to a container', () => {
      expect(getMultiColumnLayoutContentContainerClasses('constrained')).toBe(
        'smart:px-4 smart:sm:px-6 smart:lg:px-8 smart:mx-auto smart:max-w-7xl',
      );
      expect(getMultiColumnLayoutContentContainerClasses(undefined)).toBe(
        'smart:px-4 smart:sm:px-6 smart:lg:px-8 smart:max-w-none',
      );
    });

    it('should default an undefined secondaryWidth to sm', () => {
      expect(getMultiColumnLayoutSecondaryClasses(undefined)).toContain(
        'smart:w-64',
      );
    });
  });
});
