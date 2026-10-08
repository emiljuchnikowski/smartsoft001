import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { SmartPage, getPageVariantKey } from './page';
import { SmartPageVariantProps } from './page.types';
import { SmartPagePreset } from './preset/page-preset';
import { getPagePageClasses } from './preset/preset-classes';
import { PAGE_PRESET_VARIANT_COMPONENTS } from './preset-variants';
import { SmartPageStandard } from './standard/page-standard';
import { getPageButtonOptions, usePage } from './use-page';
import { IPageOptions, SmartPageVariant } from '../../models';
import { ISmartNavigation } from '../../providers/navigation';
import { SmartComponentOverrides } from '../../providers/smart-context';
import { SmartProvider } from '../../providers/smart-provider';

function createNavigation(): ISmartNavigation & { back: jest.Mock } {
  return {
    navigate: jest.fn(),
    back: jest.fn(),
    getCurrentUrl: () => '/',
    subscribe: () => () => undefined,
  };
}

function Injected({ className }: SmartPageVariantProps) {
  return (
    <section data-testid="injected" className={className}>
      injected
    </section>
  );
}

function renderPage(
  ui: ReactNode,
  {
    components,
    navigation = createNavigation(),
    language,
  }: {
    components?: SmartComponentOverrides;
    navigation?: ISmartNavigation;
    language?: string;
  } = {},
) {
  const view = render(
    <SmartProvider
      components={components}
      navigation={navigation}
      language={language}
    >
      {ui}
    </SmartProvider>,
  );

  return { ...view, navigation };
}

function search(text = '') {
  return { text, set: jest.fn() };
}

describe('@smartsoft001/react: SmartPage', () => {
  describe('wrapper', () => {
    it('should render the standard page by default', () => {
      renderPage(<SmartPage options={{ title: 'hello' }} />);

      expect(
        screen.getByRole('heading', { level: 2, name: 'hello' }),
      ).toBeInTheDocument();
    });

    it('should fall back to the standard page when the variant is unknown', () => {
      renderPage(
        <SmartPage
          options={{
            title: 'fallback',
            variant: 'unknown-foo' as SmartPageVariant,
          }}
        />,
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'fallback' }),
      ).toBeInTheDocument();
    });

    it('should render the component registered for the variant', () => {
      renderPage(
        <SmartPage options={{ title: 'variant', variant: 'custom-a' }} />,
        { components: { [getPageVariantKey('custom-a')]: Injected } },
      );

      expect(screen.getByTestId('injected')).toBeInTheDocument();
    });

    it('should not render the standard page when the variant is registered', () => {
      renderPage(
        <SmartPage options={{ title: 'variant', variant: 'custom-a' }} />,
        { components: { [getPageVariantKey('custom-a')]: Injected } },
      );

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should fall back to the standard page when the variant is not registered', () => {
      renderPage(
        <SmartPage options={{ title: 'fallback', variant: 'missing' }} />,
        { components: { [getPageVariantKey('custom-a')]: Injected } },
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'fallback' }),
      ).toBeInTheDocument();
    });

    it('should render the standard page when the variant is omitted', () => {
      renderPage(<SmartPage options={{ title: 'no-variant' }} />, {
        components: { [getPageVariantKey('custom-a')]: Injected },
      });

      expect(
        screen.getByRole('heading', { level: 2, name: 'no-variant' }),
      ).toBeInTheDocument();
    });

    it('should render the component registered as the standard variant', () => {
      renderPage(<SmartPage options={{ title: 'replaced' }} />, {
        components: { [getPageVariantKey('standard')]: Injected },
      });

      expect(screen.getByTestId('injected')).toBeInTheDocument();
    });

    it('should pass className to the variant', () => {
      renderPage(
        <SmartPage
          options={{ title: 'x', variant: 'custom-a' }}
          className="passed-class"
        />,
        { components: { [getPageVariantKey('custom-a')]: Injected } },
      );

      expect(screen.getByTestId('injected')).toHaveClass('passed-class');
    });

    it('should render children in the body', () => {
      renderPage(
        <SmartPage options={{ title: 'hello' }}>
          <p>projected body</p>
        </SmartPage>,
      );

      expect(screen.getByText('projected body')).toBeInTheDocument();
    });

    it('should render options.bodyTpl instead of children when both are given', () => {
      renderPage(
        <SmartPage
          options={{ title: 'with-tpl', bodyTpl: <p>explicit body</p> }}
        >
          <p>projected body</p>
        </SmartPage>,
      );

      expect(screen.queryByText('projected body')).not.toBeInTheDocument();
    });

    it('should render an empty title without options', () => {
      renderPage(<SmartPage options={null} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('');
    });
  });

  describe('getPageVariantKey', () => {
    it('should register the standard variant as the page component', () => {
      expect(getPageVariantKey('standard')).toBe('page');
    });

    it('should prefix other variants with page:', () => {
      expect(getPageVariantKey('preset')).toBe('page:preset');
    });
  });

  describe('PAGE_PRESET_VARIANT_COMPONENTS', () => {
    it('should render the preset when the variant is preset', () => {
      const { container } = renderPage(
        <SmartPage options={{ title: 'wrapped', variant: 'preset' }} />,
        { components: PAGE_PRESET_VARIANT_COMPONENTS },
      );

      expect(container.querySelector('[data-role="page"]')).not.toBeNull();
    });

    it('should wire children into the preset body', () => {
      const { container } = renderPage(
        <SmartPage options={{ title: 'wrapped', variant: 'preset' }}>
          <p id="projected">projected body</p>
        </SmartPage>,
        { components: PAGE_PRESET_VARIANT_COMPONENTS },
      );

      expect(
        container.querySelector('[data-role="body"] #projected'),
      ).toHaveTextContent('projected body');
    });

    it('should keep the standard page for the standard variant', () => {
      const { container } = renderPage(
        <SmartPage options={{ title: 'plain' }} />,
        { components: PAGE_PRESET_VARIANT_COMPONENTS },
      );

      expect(container.querySelector('[data-role="page"]')).toBeNull();
    });
  });

  describe('usePage', () => {
    it('should go back through the navigation on back()', () => {
      const navigation = createNavigation();
      const { result } = renderHook(() => usePage(), {
        wrapper: ({ children }) => (
          <SmartProvider navigation={navigation}>{children}</SmartProvider>
        ),
      });

      result.current.back();

      expect(navigation.back).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPageButtonOptions', () => {
    it('should use the button handler as click', () => {
      const handler = jest.fn();

      const result = getPageButtonOptions({ handler });

      expect(result.click).toBe(handler);
    });

    it('should render secondary md buttons', () => {
      const result = getPageButtonOptions({});

      expect(result).toMatchObject({ variant: 'secondary', size: 'md' });
    });

    it('should return a no-op click when there is no handler', () => {
      const result = getPageButtonOptions({});

      expect(() => result.click()).not.toThrow();
    });
  });

  describe.each([
    ['standard', SmartPageStandard],
    ['preset', SmartPagePreset],
  ])('%s: shared behaviour', (_name, Page) => {
    it('should render the translated title', () => {
      render(
        <SmartProvider translations={{ PAGE: { title: 'Translated' } }}>
          <Page options={{ title: 'PAGE.title' }} />
        </SmartProvider>,
      );

      expect(
        screen.getByRole('heading', { name: 'Translated' }),
      ).toBeInTheDocument();
    });

    it('should not render the heading when hideHeader is true', () => {
      renderPage(<Page options={{ title: 'hidden', hideHeader: true }} />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should go back on the back button click', () => {
      const { navigation, container } = renderPage(
        <Page
          options={{
            title: 'with-back',
            showBackButton: true,
            hideMenuButton: true,
          }}
        />,
      );

      fireEvent.click(container.querySelector('button') as HTMLElement);

      expect(navigation.back).toHaveBeenCalledTimes(1);
    });

    it('should render the search input with the translated placeholder', () => {
      renderPage(<Page options={{ title: 's', search: search() }} />, {
        language: 'eng',
      });

      expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
    });

    it('should call search.set when typing into the input', () => {
      const pageSearch = search();
      renderPage(<Page options={{ title: 's', search: pageSearch }} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'hello' },
      });

      expect(pageSearch.set).toHaveBeenCalledWith('hello');
    });

    it('should display search.text in the input', () => {
      renderPage(
        <Page options={{ title: 's', search: search('current-query') }} />,
      );

      expect(screen.getByRole('textbox')).toHaveValue('current-query');
    });

    it('should render one button per endButton entry', () => {
      renderPage(
        <Page
          options={{
            title: 'with-buttons',
            hideMenuButton: true,
            endButtons: [
              { icon: 'a', text: 'A' },
              { icon: 'b', text: 'B' },
            ],
          }}
        />,
      );

      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should render the translated endButton text', () => {
      render(
        <SmartProvider translations={{ BTN: { add: 'Add item' } }}>
          <Page
            options={{
              title: 'b',
              endButtons: [{ icon: 'a', text: 'BTN.add' }],
            }}
          />
        </SmartProvider>,
      );

      expect(
        screen.getByRole('button', { name: 'Add item' }),
      ).toBeInTheDocument();
    });

    it('should call the endButton handler on click', () => {
      const handler = jest.fn();
      renderPage(
        <Page
          options={{
            title: 'b',
            endButtons: [{ icon: 'a', text: 'Add', handler }],
          }}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Add' }));

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should disable a disabled endButton', () => {
      renderPage(
        <Page
          options={{
            title: 'b',
            endButtons: [{ icon: 'a', text: 'Add', disabled: true }],
          }}
        />,
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    });

    it('should render the endButton number badge', () => {
      renderPage(
        <Page
          options={{
            title: 'b',
            endButtons: [{ icon: 'a', text: 'Inbox', number: 3 }],
          }}
        />,
      );

      expect(screen.getByText('3')).toHaveClass('smart:rounded-full');
    });

    it('should render the body template', () => {
      renderPage(
        <Page options={{ title: 'b', bodyTpl: <p>body-content</p> }} />,
      );

      expect(screen.getByText('body-content')).toBeInTheDocument();
    });

    it('should render without options', () => {
      renderPage(<Page options={null} />);

      expect(screen.getByRole('heading')).toHaveTextContent('');
    });
  });

  describe('standard', () => {
    it('should render the title in an h2', () => {
      renderPage(<SmartPageStandard options={{ title: 'my-title' }} />);

      expect(
        screen.getByRole('heading', { level: 2, name: 'my-title' }),
      ).toBeInTheDocument();
    });

    it('should not render the back button when showBackButton is false', () => {
      renderPage(<SmartPageStandard options={{ title: 'no-back' }} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render the body section without bodyTpl', () => {
      const { container } = renderPage(
        <SmartPageStandard options={{ title: 'no-body' }} />,
      );

      expect(container.lastElementChild).toBeEmptyDOMElement();
    });

    it('should keep the body section when the header is hidden', () => {
      const { container } = renderPage(
        <SmartPageStandard
          options={{ title: 'x', hideHeader: true, bodyTpl: <p>body</p> }}
        />,
      );

      expect(container.firstElementChild).toHaveClass('smart:px-4');
    });
  });

  describe('preset', () => {
    function renderPreset(options: IPageOptions | null, className?: string) {
      return renderPage(
        <SmartPagePreset options={options} className={className} />,
      );
    }

    it('should render the page and header shells', () => {
      const { container } = renderPreset({ title: 'my-title' });

      expect(container.querySelector('[data-role="page"]')).toContainElement(
        container.querySelector('header[data-role="header"]'),
      );
    });

    it('should render the title in an h1', () => {
      const { container } = renderPreset({ title: 'my-title' });

      expect(
        container.querySelector('h1[data-role="title"]'),
      ).toHaveTextContent('my-title');
    });

    it('should keep the page shell when hideHeader is true', () => {
      const { container } = renderPreset({ title: 'h', hideHeader: true });

      expect(container.querySelector('[data-role="page"]')).not.toBeNull();
    });

    it('should skip the header entirely when hideHeader is true', () => {
      const { container } = renderPreset({ title: 'h', hideHeader: true });

      expect(container.querySelector('[data-role="header"]')).toBeNull();
    });

    it('should render the back button when showBackButton is true', () => {
      const { container } = renderPreset({ title: 'b', showBackButton: true });

      expect(
        container.querySelector('button[data-role="back"]'),
      ).not.toBeNull();
    });

    it('should not render the back button when showBackButton is false', () => {
      const { container } = renderPreset({ title: 'b' });

      expect(container.querySelector('button[data-role="back"]')).toBeNull();
    });

    it('should go back on the back button click', () => {
      const { container, navigation } = renderPreset({
        title: 'b',
        showBackButton: true,
      });

      fireEvent.click(
        container.querySelector('button[data-role="back"]') as HTMLElement,
      );

      expect(navigation.back).toHaveBeenCalledTimes(1);
    });

    it('should render a menu button unless hideMenuButton is set', () => {
      const { container } = renderPreset({ title: 'menu' });

      expect(
        container.querySelector('button[data-role="menu-button"]'),
      ).not.toBeNull();
    });

    it('should not render the menu button when hideMenuButton is true', () => {
      const { container } = renderPreset({ title: 'm', hideMenuButton: true });

      expect(
        container.querySelector('button[data-role="menu-button"]'),
      ).toBeNull();
    });

    it('should not render the actions zone without search and endButtons', () => {
      const { container } = renderPreset({ title: 'a' });

      expect(container.querySelector('[data-role="actions"]')).toBeNull();
    });

    it('should append className to the page classes', () => {
      const { container } = renderPreset({ title: 'c' }, 'my-external');

      expect(container.querySelector('[data-role="page"]')).toHaveClass(
        'smart:min-h-full',
        'my-external',
      );
    });

    it.each([
      ['banner', 'bannerTpl', '[data-role="banner"]'],
      ['breadcrumbs', 'breadcrumbsTpl', '[data-role="breadcrumbs"]'],
      ['avatar', 'avatarTpl', '[data-role="avatar"]'],
      ['logo', 'logoTpl', '[data-role="logo"]'],
      ['subtitle', 'subtitleTpl', '[data-role="subtitle"]'],
      ['meta', 'metaTpl', '[data-role="meta"]'],
      ['stats', 'statsTpl', '[data-role="meta"]'],
      ['filters', 'filtersTpl', '[data-role="filters"]'],
      ['sidebar', 'sidebarTpl', 'aside[data-role="sidebar"]'],
      ['body', 'bodyTpl', '[data-role="body"]'],
    ])('should project the %s slot into its zone', (_slot, key, zone) => {
      const { container } = renderPreset({
        title: 'slots',
        [key]: <span id="slot">slot-content</span>,
      });

      expect(container.querySelector(`${zone} #slot`)).toHaveTextContent(
        'slot-content',
      );
    });

    it.each([
      ['banner', 'bannerTpl', '[data-role="banner"]'],
      ['breadcrumbs', 'breadcrumbsTpl', '[data-role="breadcrumbs"]'],
      ['meta', 'metaTpl', '[data-role="meta"]'],
      ['filters', 'filtersTpl', '[data-role="filters"]'],
      ['sidebar', 'sidebarTpl', '[data-role="sidebar"]'],
    ])(
      'should not render the %s zone without its slot',
      (_slot, _key, zone) => {
        const { container } = renderPreset({ title: 'empty' });

        expect(container.querySelector(zone)).toBeNull();
      },
    );

    it('should not render the filters zone when the header is hidden', () => {
      const { container } = renderPreset({
        title: 'f',
        hideHeader: true,
        filtersTpl: <span>filters</span>,
      });

      expect(container.querySelector('[data-role="filters"]')).toBeNull();
    });

    it('should wrap the body in the body card', () => {
      const { container } = renderPreset({
        title: 'b',
        bodyTpl: <p id="body">body</p>,
      });

      expect(container.querySelector('#body')?.parentElement).toHaveClass(
        'smart:rounded-lg',
        'smart:shadow-2xs',
      );
    });
  });

  describe('preset classes', () => {
    it('should trim the page classes without a custom class', () => {
      expect(getPagePageClasses()).toBe(
        'smart:min-h-full smart:bg-gray-50 smart:dark:bg-gray-900',
      );
    });
  });
});
