import { useCallback, useEffect, useRef, useState } from 'react';

import { SmartAppProps } from './app.types';
import { IMenuItem } from '../../models';
import {
  useAppService,
  useAuthService,
  useMenuService,
  useNavigation,
  useStyleService,
} from '../../providers/hooks';
import { useStore } from '../../store/store';

const NO_MENU_ITEMS: IMenuItem[] = [];

/**
 * The Angular `AppBaseComponent`, the logic of an application shell:
 *
 * - puts `options.menu.items` on the `MenuService` and returns its items
 *   (none without `options.menu`) and `showMenu` (logged in or
 *   `menu.showForAnonymous`, unless the menu service is disabled);
 * - returns `logged`, `username` and `logo`, and `logout()` from
 *   `options.provider`;
 * - keeps `selectedPath` on the current URL and the document title on it
 *   (`AppService.initTitle()` once, then `updateTitle(url)` for the current
 *   URL and after every navigation);
 * - writes `options.style` on the root element (`StyleService`), adds the
 *   `auth-permissions-<permission>` classes of a logged user to it and sets
 *   `logo` on the `#app-favicon` link.
 *
 * Attach `rootRef` to the shell's root element. `endContent` is what
 * `MenuService.openEnd` asked to show in the end menu (the Angular
 * `endMenuContainer`).
 */
export function useApp({ options, className }: SmartAppProps) {
  const appService = useAppService();
  const authService = useAuthService();
  const menuService = useMenuService();
  const navigation = useNavigation();
  const styleService = useStyleService();

  const rootRef = useRef<HTMLDivElement>(null);
  const titleInitialized = useRef(false);
  const [selectedPath, setSelectedPath] = useState(() =>
    navigation.getCurrentUrl(),
  );

  const serviceMenuItems = useStore(menuService.menuItems);
  const menuDisabled = useStore(menuService.disabled);
  const endContent = useStore(menuService.endContent);

  const logged = options.provider.logged;
  const username = options.provider.username;
  const logo = options.logo;
  const menuItems = options.menu ? serviceMenuItems : NO_MENU_ITEMS;
  const showMenu = menuDisabled
    ? false
    : logged || !!options.menu?.showForAnonymous;

  const items = options.menu?.items;
  useEffect(() => {
    if (items) menuService.setMenuItems(items);
  }, [menuService, items]);

  useEffect(() => {
    if (!titleInitialized.current) {
      appService.initTitle();
      titleInitialized.current = true;
    }

    const onNavigationEnd = (url: string) => {
      setSelectedPath(url);
      styleService.init(rootRef.current);
      appService.updateTitle(url);
    };

    onNavigationEnd(navigation.getCurrentUrl());

    return navigation.subscribe(onNavigationEnd);
  }, [appService, navigation, styleService]);

  const style = options.style;
  useEffect(() => {
    styleService.init(rootRef.current, style);
  }, [styleService, style]);

  useEffect(() => {
    const favicon = document.getElementById('app-favicon');

    if (logo && favicon) favicon.setAttribute('href', logo);
  }, [logo]);

  useEffect(() => {
    const root = rootRef.current;

    if (!logged || !root) return;

    authService.getPermissions().forEach((permission) => {
      root.classList.add('auth-permissions-' + permission);
    });
    // `className` re-adds the classes after React rewrites the attribute.
  }, [authService, logged, className]);

  const logout = useCallback((): void => {
    options.provider.logout();
  }, [options.provider]);

  return {
    rootRef,
    selectedPath,
    showMenu,
    menuItems,
    logged,
    username,
    logo,
    endContent,
    logout,
  };
}
