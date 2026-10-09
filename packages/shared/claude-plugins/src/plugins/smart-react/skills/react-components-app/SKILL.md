---
name: react-components-app
description: SmartApp React component API (@smartsoft001/react) — the application shell (IAppOptions with provider, logo, menu items, style), the 'app' registry key and the useApp hook that keeps the menu, document title, favicon and permission classes for a shell of your own.
user-invocable: false
---

# App (`SmartApp`)

`SmartApp` is the application shell. It takes an `IAppOptions` object (the signed-in user through `provider`, a `logo`, the `menu` items and a `style` map) and wraps `children`. The default `SmartAppStandard` renders **only a root element** running `useApp` (document title, menu items on the `MenuService`, CSS variables, permission classes, favicon): it draws no menu, logo or user. An application that wants a visible shell registers its own component under the `app` key, built on `useApp`.

## When to Use This Skill

- Wrapping the routes of a React application in the library's shell
- Putting the menu items on the `MenuService`, keeping the document title in sync with the URL, applying the style settings
- Rendering a navigation menu, the logo, the user name and a logout button (a shell of your own on `useApp`)
- Rendering the end panel (`MenuService.openEnd`) that CRUD filters and the multiselect panel open

## Exports

All from `@smartsoft001/react`.

| Export             | Kind      | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartApp`         | component | The application shell: renders the implementation registered as `components.app` on `SmartProvider`, `SmartAppStandard` by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `SmartAppStandard` | component | The default application shell: only a root element running `useApp` (title, menu items, style, permission classes, favicon) around `children`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `useApp`           | hook      | The logic of an application shell: - puts `options.menu.items` on the `MenuService` and returns its items (none without `options.menu`) and `showMenu` (logged in or `menu.showForAnonymous`, unless the menu service is disabled); - returns `logged`, `username` and `logo`, and `logout()` from `options.provider`; - keeps `selectedPath` on the current URL and the document title on it (`AppService.initTitle()` once, then `updateTitle(url)` for the current URL and after every navigation); - writes `options.style` on the root element (`StyleService`), adds the `auth-permissions-<permission>` classes of a logged user to it and sets `logo` on the `#app-favicon` link. |

## Props and Types

### `SmartAppProps`

| Prop         | Type          | Default  | Description                  |
| ------------ | ------------- | -------- | ---------------------------- |
| `options`    | `IAppOptions` | required | The shell configuration.     |
| `className?` | `string`      | —        | Classes of the root element. |
| `children?`  | `ReactNode`   | —        | The application content.     |

### `IAppOptions`

| Field      | Type                                                   | Default  | Description                                                                           |
| ---------- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `provider` | `IAppProvider`                                         | required | The signed-in user: `logged`, `username`, `logout()`.                                 |
| `logo?`    | `string`                                               | —        | Logo URL; also set as the `href` of the `#app-favicon` link.                          |
| `menu?`    | `{ showForAnonymous?: boolean; items?: IMenuItem[]; }` | —        | The menu: `items`, and `showForAnonymous` to show it before sign-in.                  |
| `style?`   | `IStyle`                                               | —        | Style settings written as CSS custom properties on the root element (`StyleService`). |

### `IAppProvider`

What the app shell needs to know about the signed-in user.

| Field      | Type         | Default  | Description                             |
| ---------- | ------------ | -------- | --------------------------------------- |
| `logged`   | `boolean`    | required | Whether a user is signed in.            |
| `username` | `string`     | required | Shown by a shell that renders the user. |
| `logout`   | `() => void` | required | Called by the shell's logout action.    |

### `IMenuItem`

| Field        | Type                        | Default | Description                                                         |
| ------------ | --------------------------- | ------- | ------------------------------------------------------------------- |
| `mode?`      | `'divider' \| 'default'`    | —       | `'divider'` renders a separator instead of an entry.                |
| `route?`     | `string`                    | —       | The URL the entry navigates to; `selectedPath` is compared with it. |
| `click?`     | `(arg0: IMenuItem) => void` | —       | Called instead of navigating.                                       |
| `caption?`   | `string`                    | —       | Label (a translation key or text).                                  |
| `component?` | `any`                       | —       | A component rendered for the entry.                                 |
| `icon?`      | `string`                    | —       | Icon name for a shell that renders icons.                           |
| `infos?`     | `Array<{ text: string }>`   | —       | Small badges or notes next to the entry.                            |

### Related types

- `IStyle`: `Record<string, string \| undefined>` — Style settings (colour, font, button metrics, breakpoints), keyed by setting name.

## The end menu

CRUD screens open their filters and multiselect panel with `MenuService.openEnd({ component, props })`. `MenuService` only keeps that request in its `endContent` store and `SmartAppStandard` renders no menu, so a shell that wants those panels renders `endContent` itself (as in the custom shell below) and closes it with `useMenuService().closeEnd()`.

## Usage

```tsx
import type { ReactNode } from 'react';

import { IAppOptions, SmartApp } from '@smartsoft001/react';

const options: IAppOptions = {
  provider: {
    logged: true,
    username: 'anna',
    logout: () => window.location.assign('/login'),
  },
  logo: '/logo.svg',
  menu: {
    items: [
      { route: '/notes', caption: 'Notes' },
      { mode: 'divider' },
      { route: '/settings', caption: 'Settings' },
    ],
  },
};

export function Shell({ children }: { children: ReactNode }) {
  return <SmartApp options={options}>{children}</SmartApp>;
}
```

In a real application `provider` is built from the auth state (e.g. `useAuthService().isAuthenticated()`), and memoised.

## Replacing the Implementation

`SmartApp` renders the component registered under the `'app'` key of `SmartProvider`'s `components`, and `SmartAppStandard` when nothing is registered there. Every `SmartApp` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartAppProps`, as shown below, as `components={{ app: MyApp }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useApp` hook

The logic of an application shell:

- puts `options.menu.items` on the `MenuService` and returns its items (none without `options.menu`) and `showMenu` (logged in or `menu.showForAnonymous`, unless the menu service is disabled);
- returns `logged`, `username` and `logo`, and `logout()` from `options.provider`;
- keeps `selectedPath` on the current URL and the document title on it (`AppService.initTitle()` once, then `updateTitle(url)` for the current URL and after every navigation);
- writes `options.style` on the root element (`StyleService`), adds the `auth-permissions-<permission>` classes of a logged user to it and sets `logo` on the `#app-favicon` link. Attach `rootRef` to the shell's root element. `endContent` is what `MenuService.openEnd` asked to show in the end menu.

```ts
function useApp({ options, className }: SmartAppProps);
```

| Returns        | Type                                | Description                                                                                           |
| -------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `rootRef`      | `RefObject<HTMLDivElement \| null>` | Attach to the shell's root element: the style, permission classes and favicon are applied through it. |
| `selectedPath` | `string`                            | The current URL (path + query), updated on every navigation.                                          |
| `showMenu`     | `boolean`                           | `true` when logged in or `menu.showForAnonymous`, unless the `MenuService` is disabled.               |
| `menuItems`    | `IMenuItem[]`                       | The items of the `MenuService` (set from `options.menu.items`).                                       |
| `logged`       | `boolean`                           | `options.provider.logged`.                                                                            |
| `username`     | `string`                            | `options.provider.username`.                                                                          |
| `logo`         | `string \| undefined`               | `options.logo`.                                                                                       |
| `endContent`   | `IMenuEndContent \| null`           | What `MenuService.openEnd` asked the end menu to show (`{ component, props }`), or `null`.            |
| `logout`       | `() => void`                        | Calls `options.provider.logout()`.                                                                    |

```tsx
import type { ReactNode } from 'react';

import {
  SmartAppProps,
  SmartProvider,
  useApp,
  useMenuService,
  useNavigation,
} from '@smartsoft001/react';

export function AppShell(props: SmartAppProps) {
  const {
    rootRef,
    showMenu,
    menuItems,
    selectedPath,
    logged,
    username,
    logo,
    endContent,
    logout,
  } = useApp(props);
  const navigation = useNavigation();
  const menu = useMenuService();
  const End = endContent?.component;

  return (
    <div ref={rootRef} className={props.className}>
      <header className="flex items-center gap-4">
        {logo && <img src={logo} alt="" className="h-8" />}
        {logged && (
          <>
            <span>{username}</span>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </>
        )}
      </header>
      {showMenu && (
        <nav>
          {menuItems.map((item, index) =>
            item.mode === 'divider' ? (
              <hr key={index} />
            ) : (
              <a
                key={item.route ?? index}
                href={item.route}
                aria-current={
                  item.route && selectedPath.startsWith(item.route)
                    ? 'page'
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (item.click) item.click(item);
                  else if (item.route) navigation.navigate(item.route);
                }}
              >
                {item.caption}
              </a>
            ),
          )}
        </nav>
      )}
      <main>{props.children}</main>
      {End && (
        <aside>
          <button type="button" onClick={() => void menu.closeEnd()}>
            Close
          </button>
          <End {...(endContent?.props ?? {})} />
        </aside>
      )}
    </div>
  );
}

const components = { app: AppShell };

export function Root({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

## Styling

- `className` goes on the root element.
- `options.style` is written as CSS custom properties on the root element; a logged user's permissions are added to it as `auth-permissions-<permission>` classes, so CSS can show or hide parts per permission.

## File Locations

Source: `packages/shared/react/src/lib/components/app/` in the smartsoft001 repository.

- `app.tsx`: `SmartApp`
- `app.types.ts`: `SmartAppProps`
- `standard/app-standard.tsx`: `SmartAppStandard`
- `use-app.ts`: `useApp`
