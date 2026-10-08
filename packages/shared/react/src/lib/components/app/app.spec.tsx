import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { SmartApp } from './app';
import { SmartAppProps } from './app.types';
import { SmartAppStandard } from './standard/app-standard';
import { useApp } from './use-app';
import { IAppOptions, IMenuItem } from '../../models';
import { IAppProvider } from '../../providers/interfaces';
import { ISmartNavigation } from '../../providers/navigation';
import { SmartConfig } from '../../providers/smart-context';
import { SmartProvider } from '../../providers/smart-provider';
import { AuthService } from '../../services/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';

function createNavigation(url = '/') {
  const listeners = new Set<(url: string) => void>();
  let current = url;
  const navigation: ISmartNavigation = {
    navigate: jest.fn(),
    back: jest.fn(),
    getCurrentUrl: () => current,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };

  return {
    navigation,
    listeners,
    go(next: string) {
      current = next;
      act(() => {
        for (const listener of [...listeners]) listener(next);
      });
    },
  };
}

function createProvider(overrides: Partial<IAppProvider> = {}): IAppProvider {
  return {
    logged: true,
    username: 'jane',
    logout: jest.fn(),
    ...overrides,
  };
}

function createOptions(overrides: Partial<IAppOptions> = {}): IAppOptions {
  return { provider: createProvider(), ...overrides };
}

const menuItems: IMenuItem[] = [{ route: '/users', caption: 'Users' }];

function setup(
  options: IAppOptions = createOptions(),
  config: SmartConfig = {},
  children?: ReactNode,
) {
  const nav = createNavigation('/');
  const menuService = config.menuService ?? new MenuService();
  const view = render(
    <SmartProvider
      navigation={nav.navigation}
      menuService={menuService}
      {...config}
    >
      <SmartApp options={options} className="app-root">
        {children}
      </SmartApp>
    </SmartProvider>,
  );

  return { ...view, nav, menuService };
}

function renderUseApp(
  options: IAppOptions,
  config: SmartConfig = {},
  url = '/',
) {
  const nav = createNavigation(url);
  const menuService = config.menuService ?? new MenuService();
  const view = renderHook(() => useApp({ options }), {
    wrapper: ({ children }) => (
      <SmartProvider
        navigation={nav.navigation}
        menuService={menuService}
        {...config}
      >
        {children}
      </SmartProvider>
    ),
  });

  return { ...view, nav, menuService };
}

describe('@smartsoft001/react: SmartApp', () => {
  beforeEach(() => {
    document.title = 'Base';
  });

  describe('wrapper', () => {
    it('should render the children', () => {
      setup(createOptions(), {}, <p>content</p>);

      expect(screen.getByText('content')).toBeInTheDocument();
    });

    it('should render the children inside the root element', () => {
      setup(createOptions(), {}, <p>content</p>);

      expect(screen.getByText('content').parentElement).toHaveClass('app-root');
    });

    it('should render the implementation registered as components.app', () => {
      const Custom = ({ children }: SmartAppProps) => (
        <main data-testid="custom">{children}</main>
      );

      setup(createOptions(), { components: { app: Custom } }, 'content');

      expect(screen.getByTestId('custom')).toHaveTextContent('content');
    });
  });

  describe('menu', () => {
    it('should set the menu items of options.menu on the menu service', () => {
      const { menuService } = renderUseApp(
        createOptions({ menu: { items: menuItems } }),
      );

      expect(menuService.menuItems.get()).toBe(menuItems);
    });

    it('should return the menu items of the menu service', () => {
      const { result } = renderUseApp(
        createOptions({ menu: { items: menuItems } }),
      );

      expect(result.current.menuItems).toBe(menuItems);
    });

    it('should return no menu items without options.menu', () => {
      const menuService = new MenuService();
      menuService.setMenuItems(menuItems);

      const { result } = renderUseApp(createOptions(), { menuService });

      expect(result.current.menuItems).toEqual([]);
    });

    it('should show the menu for a logged user', () => {
      const { result } = renderUseApp(createOptions());

      expect(result.current.showMenu).toBe(true);
    });

    it('should hide the menu from an anonymous user', () => {
      const { result } = renderUseApp(
        createOptions({ provider: createProvider({ logged: false }) }),
      );

      expect(result.current.showMenu).toBe(false);
    });

    it('should show the menu to an anonymous user with menu.showForAnonymous', () => {
      const { result } = renderUseApp(
        createOptions({
          provider: createProvider({ logged: false }),
          menu: { showForAnonymous: true },
        }),
      );

      expect(result.current.showMenu).toBe(true);
    });

    it('should hide the menu while the menu service is disabled', () => {
      const { result, menuService } = renderUseApp(createOptions());

      act(() => menuService.disable());

      expect(result.current.showMenu).toBe(false);
    });

    it('should return the end menu content of the menu service', async () => {
      const { result, menuService } = renderUseApp(createOptions());
      const End = () => null;

      await act(() => menuService.openEnd({ component: End }));

      expect(result.current.endContent?.component).toBe(End);
    });
  });

  describe('provider', () => {
    it('should return logged and username of the provider', () => {
      const { result } = renderUseApp(createOptions());

      expect(result.current).toMatchObject({ logged: true, username: 'jane' });
    });

    it('should return the logo', () => {
      const { result } = renderUseApp(createOptions({ logo: '/logo.png' }));

      expect(result.current.logo).toBe('/logo.png');
    });

    it('should call provider.logout on logout', () => {
      const options = createOptions();
      const { result } = renderUseApp(options);

      result.current.logout();

      expect(options.provider.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('navigation', () => {
    it('should start with the current URL as the selected path', () => {
      const { result } = renderUseApp(createOptions(), {}, '/users');

      expect(result.current.selectedPath).toBe('/users');
    });

    it('should update the selected path after a navigation', () => {
      const { result, nav } = renderUseApp(createOptions());

      nav.go('/orders');

      expect(result.current.selectedPath).toBe('/orders');
    });

    it('should set the document title from the current URL', () => {
      renderUseApp(createOptions(), {}, '/users');

      expect(document.title).toBe('Base|users');
    });

    it('should update the document title after a navigation', () => {
      const { nav } = renderUseApp(createOptions());

      nav.go('/orders/1');

      expect(document.title).toBe('Base|orders|1');
    });

    it('should translate the route segments of the title', () => {
      renderUseApp(
        createOptions(),
        { translations: { ROUTES: { users: 'Users' } } },
        '/users',
      );

      expect(document.title).toBe('Base|Users');
    });

    it('should stop listening to the navigation on unmount', () => {
      const { unmount, nav } = renderUseApp(createOptions());

      unmount();

      expect(nav.listeners.size).toBe(0);
    });
  });

  describe('root element', () => {
    it('should write options.style on the root element', () => {
      const { container } = setup(
        createOptions({ style: { 'color-primary': '#ff0000' } }),
      );

      expect(
        (container.firstElementChild as HTMLElement).style.getPropertyValue(
          '--smart-color-primary',
        ),
      ).toBe('#ff0000');
    });

    it('should add the permission classes of a logged user', () => {
      const authService = {
        getPermissions: () => ['admin', 'users'],
      } as unknown as AuthService;

      const { container } = setup(createOptions(), { authService });

      expect(container.firstElementChild).toHaveClass(
        'auth-permissions-admin',
        'auth-permissions-users',
      );
    });

    it('should not add permission classes for an anonymous user', () => {
      const authService = {
        getPermissions: () => ['admin'],
      } as unknown as AuthService;

      const { container } = setup(
        createOptions({ provider: createProvider({ logged: false }) }),
        { authService },
      );

      expect(container.firstElementChild).not.toHaveClass(
        'auth-permissions-admin',
      );
    });

    it('should set the logo as the favicon', () => {
      const favicon = document.createElement('link');
      favicon.id = 'app-favicon';
      document.head.appendChild(favicon);

      setup(createOptions({ logo: '/logo.png' }));

      expect(favicon).toHaveAttribute('href', '/logo.png');
      favicon.remove();
    });

    it('should render the root element with SmartAppStandard', () => {
      const { container } = render(
        <SmartAppStandard options={createOptions()} className="root">
          inner
        </SmartAppStandard>,
      );

      expect(container.firstElementChild).toHaveTextContent('inner');
    });
  });
});
