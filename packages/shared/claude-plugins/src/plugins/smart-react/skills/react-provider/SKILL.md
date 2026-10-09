---
name: react-provider
description: SmartProvider of @smartsoft001/react, the root every React component reads — the components registry (every registry key), SMART_PRESET_COMPONENTS and the per-area preset maps, translations (language, translations, translate, useTranslate), the navigation adapter for a router (createHistoryNavigation, linkComponent), the services and their hooks (auth, HTTP, files, toasts, alerts, modals, menu, app), the model providers, styles.css and dark mode, and the shared option types.
user-invocable: false
---

# SmartProvider (`@smartsoft001/react`)

`SmartProvider` is the root of an application built with `@smartsoft001/react`. It supplies, to every component below it: the translations, a router-agnostic navigation adapter, the services (auth, storage, HTTP, files, toasts, alerts, modals, menu, app title), the **component registry** that swaps implementations, and the model providers. It also renders the hosts of toasts, alerts and modals after its children. Without a provider the components still work, against a default configuration created on first use.

## When to Use This Skill

- Setting up a React application: install, stylesheet, dark mode, the provider at the root
- Restyling the application with the presets (`SMART_PRESET_COMPONENTS`) or registering implementations of your own (`components`, `inputFieldComponents`, `detailFieldComponents`, `listModeComponents`)
- Looking up the registry key of a component
- Connecting a router (React Router, Next.js, ...) through `navigation` and `linkComponent`
- Translating the library (Polish by default, English with `language="eng"`), adding `MODEL.<field>` labels, or plugging in i18next
- Using the services from a component (`useAuthService`, `useHttpClient`, `useToastService`, ...)
- Supplying labels, options or validators of model fields from code (the model providers)

## Install and set up

```bash
npm install @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
```

- React 19, `reflect-metadata` and the three `@smartsoft001` packages are peer dependencies. Import `reflect-metadata` once before any `@Model` class is evaluated, and enable `experimentalDecorators` / `emitDecoratorMetadata` in the TypeScript config for the model decorators.
- Import the compiled stylesheet once: `import '@smartsoft001/react/styles.css';`. Every utility in it carries the `smart:` prefix, so it does not clash with the application's own Tailwind (your own markup uses your own classes, not `smart:` ones).
- Dark mode is class-based: a `dark` class on `<html>` (or any ancestor) switches every component to its `smart:dark:` variants.

```tsx
import 'reflect-metadata';
import '@smartsoft001/react/styles.css';

import type { ReactNode } from 'react';

import {
  createHistoryNavigation,
  SMART_PRESET_COMPONENTS,
  SmartProvider,
} from '@smartsoft001/react';

// Created once: the adapter listens to the browser history.
const navigation = createHistoryNavigation();

const translations = {
  MODEL: { title: 'Title', body: 'Body' },
  ROUTES: { notes: 'Notes' },
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      language="eng"
      translations={translations}
      navigation={navigation}
      fileServiceConfig={{ apiUrl: '/api' }}
      {...SMART_PRESET_COMPONENTS}
    >
      {children}
    </SmartProvider>
  );
}
```

The provider creates its services **once** and keeps them for its lifetime. Pass stable objects (module constants or memoised values) for `components`, `translations`, `navigation` and the providers, or the context changes on every render.

## `SmartProvider` props

| Prop                                                                                                         | Type                                                | Default                            | What it does                                                                                                               |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `language`                                                                                                   | `string`                                            | `'pl'`                             | `'pl'` or `'eng'`, the languages the library ships text for.                                                               |
| `translations`                                                                                               | `SmartTranslations`                                 | —                                  | The application's dictionary, deep-merged over the library's.                                                              |
| `translate`                                                                                                  | `SmartTranslateFn`                                  | —                                  | Replaces the dictionary lookup entirely (e.g. i18next's `t`); `language` and `translations` are then ignored.              |
| `navigation`                                                                                                 | `ISmartNavigation`                                  | `createHistoryNavigation()`        | How components navigate and render internal links.                                                                         |
| `components`                                                                                                 | `SmartComponentOverrides`                           | `{}`                               | Implementations by registry key (see below).                                                                               |
| `inputFieldComponents`                                                                                       | `Partial<Record<FieldTypeDef, ComponentType<any>>>` | `{}`                               | Form field components by `FieldType` (`react-components-input`).                                                           |
| `detailFieldComponents`                                                                                      | `Partial<Record<FieldTypeDef, ComponentType<any>>>` | `{}`                               | Detail field components by `FieldType` (`react-components-detail`).                                                        |
| `listModeComponents`                                                                                         | `Partial<Record<ListMode, ComponentType<any>>>`     | `{}`                               | List components by `ListMode` (`react-components-list`).                                                                   |
| `overlays`                                                                                                   | `ReactNode`                                         | `<SmartOverlays />`                | Rendered after `children`: the toast, alert and modal hosts. `null` to render them yourself (`react-components-overlays`). |
| `fileServiceConfig`                                                                                          | `IFileServiceConfig` (`{ apiUrl }`)                 | —                                  | Creates the `FileService` (attachments under `<apiUrl>/attachments`); enables the upload fields.                           |
| `fileService`                                                                                                | `FileService`                                       | —                                  | A file service of your own (wins over `fileServiceConfig`).                                                                |
| `http`                                                                                                       | `SmartHttpClient`                                   | a client with the auth interceptor | The HTTP client the services and CRUD features use.                                                                        |
| `authInterceptor`                                                                                            | `boolean`                                           | `true`                             | Adds the bearer token to the default HTTP client's requests.                                                               |
| `storageService`, `authService`, `toastService`, `alertService`, `modalService`, `menuService`, `appService` | the service classes                                 | created by the provider            | Services of your own (e.g. subclasses).                                                                                    |
| `modelLabelProvider`                                                                                         | `IModelLabelProvider \| null`                       | `null`                             | Field labels from code.                                                                                                    |
| `modelPossibilitiesProvider`                                                                                 | `IModelPossibilitiesProvider \| null`               | `null`                             | Options of `enum` / `radio` / `check` / `strings` fields from code.                                                        |
| `modelValidatorsProvider`                                                                                    | `IModelValidatorsProvider \| null`                  | `null`                             | Validators of model fields from code (`react-forms`).                                                                      |
| `modelExportProvider`, `modelImportProvider`, `appProvider`                                                  | provider interfaces                                 | `null`                             | Held in the context (`useSmart()`) for components of your own; no library component reads them.                            |
| `children`                                                                                                   | `ReactNode`                                         | —                                  | The application.                                                                                                           |

## The components registry

A wrapper component (`SmartButton`, `SmartCard`, ...) renders `useSmartComponent(key, Standard)`: the component registered under its key on `SmartProvider`, else its standard implementation. A registered component receives the same props as the standard one, so it can be a preset, a component of your own built on the wrapper's `use<Name>` hook, or a wrapper around the standard one.

```tsx
import type { ReactNode } from 'react';

import {
  SmartButtonProps,
  SmartButtonStandard,
  SmartCardPreset,
  SmartProvider,
} from '@smartsoft001/react';

function TrackedButton(props: SmartButtonProps) {
  return (
    <SmartButtonStandard
      {...props}
      options={{
        ...props.options,
        click: () => {
          console.info('button clicked');
          props.options.click();
        },
      }}
    />
  );
}

// The preset card, and the standard button wrapped with tracking.
const components = { card: SmartCardPreset, button: TrackedButton };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

### Registry keys

| Key                                | Wrapper                                                         | Standard                                                 | Preset                          | Skill                                  |
| ---------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------- | -------------------------------------- |
| `action-panel`                     | `SmartActionPanel`                                              | `SmartActionPanelStandard`                               | `SmartActionPanelPreset`        | `react-components-action-panel`        |
| `alert`                            | `SmartAlert` (and `AlertService` dialogs)                       | `SmartAlertStandard`                                     | —                               | `react-components-alert`               |
| `app`                              | `SmartApp`                                                      | `SmartAppStandard`                                       | —                               | `react-components-app`                 |
| `avatar`                           | `SmartAvatar`                                                   | `SmartAvatarStandard`                                    | `SmartAvatarPreset`             | `react-components-avatar`              |
| `badge`                            | `SmartBadge`                                                    | `SmartBadgeStandard`                                     | `SmartBadgePreset`              | `react-components-badge`               |
| `breadcrumbs`                      | `SmartBreadcrumbs`                                              | `SmartBreadcrumbsStandard`                               | `SmartBreadcrumbsPreset`        | `react-components-breadcrumbs`         |
| `button`                           | `SmartButton` (also `SmartExport`, `SmartImport`, page buttons) | `SmartButtonStandard`                                    | `SmartButtonPreset`             | `react-components-button`              |
| `button-group`                     | `SmartButtonGroup`                                              | `SmartButtonGroupStandard`                               | `SmartButtonGroupPreset`        | `react-components-button-group`        |
| `calendar`                         | `SmartCalendar`                                                 | `SmartCalendarStandard`                                  | `SmartCalendarPreset`           | `react-components-calendar`            |
| `card`                             | `SmartCard`                                                     | `SmartCardStandard`                                      | `SmartCardPreset`               | `react-components-card`                |
| `card-heading`                     | `SmartCardHeading`                                              | `SmartCardHeadingStandard`                               | `SmartCardHeadingPreset`        | `react-components-card-heading`        |
| `command-palette`                  | `SmartCommandPalette`                                           | `SmartCommandPaletteStandard`                            | `SmartCommandPalettePreset`     | `react-components-command-palette`     |
| `container`                        | `SmartContainer`                                                | `SmartContainerStandard`                                 | `SmartContainerPreset`          | `react-components-container`           |
| `description-list`                 | `SmartDescriptionList`                                          | `SmartDescriptionListStandard`                           | `SmartDescriptionListPreset`    | `react-components-description-list`    |
| `details`                          | `SmartDetails`                                                  | `SmartDetailsStandard`                                   | —                               | `react-components-details`             |
| `divider`                          | `SmartDivider`                                                  | `SmartDividerStandard`                                   | `SmartDividerPreset`            | `react-components-divider`             |
| `drawer`                           | `SmartDrawer`                                                   | `SmartDrawerStandard`                                    | `SmartDrawerPreset`             | `react-components-drawer`              |
| `dropdown`                         | `SmartDropdown`                                                 | `SmartDropdownStandard`                                  | `SmartDropdownPreset`           | `react-components-dropdown`            |
| `empty-state`                      | `SmartEmptyState`                                               | `SmartEmptyStateStandard`                                | `SmartEmptyStatePreset`         | `react-components-empty-state`         |
| `feed`                             | `SmartFeed`                                                     | `SmartFeedStandard`                                      | `SmartFeedPreset`               | `react-components-feed`                |
| `form`                             | `SmartForm` (the body)                                          | `SmartFormStandard`                                      | `SmartFormPreset`               | `react-components-form`                |
| `grid-list`                        | `SmartGridList`                                                 | `SmartGridListStandard`                                  | `SmartGridListPreset`           | `react-components-grid-list`           |
| `info`                             | `SmartInfo`                                                     | `SmartInfoStandard`                                      | `SmartInfoPreset`               | `react-components-info`                |
| `input-error`                      | the messages of `SmartInput`                                    | `SmartInputError`                                        | `SmartInputErrorPreset`         | `react-components-input`               |
| `list`                             | `SmartList` (every mode)                                        | per `listModeComponents`                                 | —                               | `react-components-list`                |
| `list-container`                   | `SmartListContainer`                                            | `SmartListContainerStandard`                             | —                               | `react-components-list-container`      |
| `loader`                           | `SmartLoader`                                                   | `SmartLoaderStandard`                                    | `SmartLoaderPreset`             | `react-components-loader`              |
| `media-object`                     | `SmartMediaObject`                                              | `SmartMediaObjectStandard`                               | `SmartMediaObjectPreset`        | `react-components-media-object`        |
| `modal`                            | `SmartModal` (and `ModalService` modals)                        | `SmartModalStandard`                                     | `SmartModalPreset`              | `react-components-modal`               |
| `multi-column-layout`              | `SmartMultiColumnLayout`                                        | `SmartMultiColumnLayoutStandard`                         | `SmartMultiColumnLayoutPreset`  | `react-components-multi-column-layout` |
| `navbar`                           | `SmartNavbar`                                                   | `SmartNavbarStandard`                                    | `SmartNavbarPreset`             | `react-components-navbar`              |
| `notification`                     | `SmartNotification` (and `ToastService` toasts)                 | `SmartNotificationStandard`                              | `SmartNotificationPreset`       | `react-components-notification`        |
| `page`, `page:<variant>`           | `SmartPage`                                                     | `SmartPageStandard`                                      | `SmartPagePreset`               | `react-components-page`                |
| `page-heading`                     | `SmartPageHeading`                                              | `SmartPageHeadingStandard`                               | `SmartPageHeadingPreset`        | `react-components-page-heading`        |
| `paging`                           | `SmartPaging`                                                   | `SmartPagingStandard`                                    | `SmartPagingPreset`             | `react-components-paging`              |
| `password-strength`                | `SmartPasswordStrength`                                         | `SmartPasswordStrengthStandard`                          | —                               | `react-components-password-strength`   |
| `progress-bars`                    | `SmartProgressBars`                                             | `SmartProgressBarsStandard`                              | `SmartProgressBarsPreset`       | `react-components-progress-bars`       |
| `searchbar`                        | `SmartSearchbar`                                                | `SmartSearchbarStandard`                                 | —                               | `react-components-searchbar`           |
| `section-heading`                  | `SmartSectionHeading`                                           | `SmartSectionHeadingStandard`                            | `SmartSectionHeadingPreset`     | `react-components-section-heading`     |
| `select-menu`                      | `SmartSelectMenu`                                               | `SmartSelectMenuStandard`                                | —                               | `react-components-select-menu`         |
| `sidebar-layout`                   | `SmartSidebarLayout`                                            | `SmartSidebarLayoutStandard`                             | `SmartSidebarLayoutPreset`      | `react-components-sidebar-layout`      |
| `sidebar-navigation`               | `SmartSidebarNavigation`                                        | `SmartSidebarNavigationStandard`                         | —                               | `react-components-sidebar-navigation`  |
| `sign-in-form`                     | `SmartSignInForm`                                               | `SmartSignInFormStandard`                                | `SmartSignInFormPreset`         | `react-components-sign-in-form`        |
| `stacked-layout`                   | `SmartStackedLayout`                                            | `SmartStackedLayoutStandard`                             | `SmartStackedLayoutPreset`      | `react-components-stacked-layout`      |
| `stacked-list`                     | `SmartStackedList`                                              | `SmartStackedListStandard`                               | `SmartStackedListPreset`        | `react-components-stacked-list`        |
| `stats`                            | `SmartStats`                                                    | `SmartStatsStandard`                                     | `SmartStatsPreset`              | `react-components-stats`               |
| `table`                            | `SmartTable`                                                    | `SmartTableStandard`                                     | `SmartTablePreset`              | `react-components-table`               |
| `tabs`                             | `SmartTabs`                                                     | `SmartTabsStandard`                                      | `SmartTabsPreset`               | `react-components-tabs`                |
| `textarea`                         | `SmartTextarea`                                                 | `SmartTextareaStandard`                                  | `SmartTextareaPreset`           | `react-components-textarea`            |
| `toggle`                           | `SmartToggle`                                                   | `SmartToggleStandard`                                    | `SmartTogglePreset`             | `react-components-toggle`              |
| `vertical-navigation`              | `SmartVerticalNavigation`                                       | `SmartVerticalNavigationStandard`                        | `SmartVerticalNavigationPreset` | `react-components-vertical-navigation` |
| `crud-list-page`, `crud-item-page` | the bodies of the CRUD pages                                    | `SmartCrudListPageStandard`, `SmartCrudItemPageStandard` | —                               | `smart-crud-react`                     |

Components without a registry key: `SmartAccordion` (render `SmartAccordionPreset` directly), `SmartDateEdit` and `SmartDateRange` (a `variant` prop), `SmartIcon` (a `template` prop), `SmartExport` / `SmartImport` (they render `SmartButton`), `SmartDetail` / `SmartInput` (field maps) and the overlay hosts.

`DynamicComponentType` is the union of the built-in keys; `SmartComponentKey` also accepts any other string (the page variants, keys of your own).

## Presets

`SMART_PRESET_COMPONENTS` is every preset the library ships, in the shape of `SmartProvider`'s props, so one spread restyles a whole application:

```tsx
<SmartProvider {...SMART_PRESET_COMPONENTS}>{children}</SmartProvider>
```

| Member                  | Registers                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `components`            | The `<Name>Preset` of every key in the table above that has one (including `page` and `page:preset`, and `input-error`). |
| `inputFieldComponents`  | `INPUT_PRESET_FIELD_COMPONENTS`, the preset field component of every `FieldType`.                                        |
| `detailFieldComponents` | `DETAIL_PRESET_FIELD_COMPONENTS`, the preset detail component of the field types that have one.                          |
| `listModeComponents`    | `LIST_PRESET_MODE_COMPONENTS`, the preset desktop, mobile and masonry-grid lists.                                        |

Pick single entries to register only some presets, and spread to combine them with components of your own: `components={{ ...SMART_PRESET_COMPONENTS.components, card: MyCard }}`. `PAGE_PRESET_VARIANT_COMPONENTS` registers only the `'page:preset'` page variant. Without any registration the standard implementations render; several of them (avatar, badge, container, list container, ...) are deliberately unstyled markup with `data-*` attributes and class hooks.

## Translations

- `language`: `'pl'` (default) or `'eng'`; the library's dictionaries are `SMART_DEFAULT_TRANSLATIONS.pl` / `.eng` (`TRANSLATE_DATA_PL`, `TRANSLATE_DATA_ENG`).
- `translations`: deep-merged over the library's dictionary (`mergeTranslations`). Keys are looked up flat first, then as a path (`'MODEL.name'`); `{{name}}` placeholders are filled from params.
- `translate`: replaces the lookup (e.g. `i18next.t`). It must return the key itself for a missing translation, as the default does: label helpers rely on that.
- `useTranslate()` returns the current function: `t('cancel')`, `t('MODEL.title')`.

Keys the library reads: the top-level words (`cancel`, `confirm`, `search`, `save`, `noResults`, `details`, ...), `MODEL.<field>` (field labels), `ROUTES.<segment>` (document title parts, see `react-components-app`), `OBJECT.confirmDelete`, `INPUT.ERRORS.*` (validation messages), `INPUT.PASSWORD-STRENGTH.*`, `CALENDAR.*`, `APP.*` and `ERRORS.*`.

A field label is the `modelLabelProvider`'s answer, else the translation of `MODEL.<key>` (`useModelLabel(instance, key, type)`).

## Navigation

The library does not depend on a router. Components navigate through an `ISmartNavigation` adapter: `navigate(url, { replace? })`, `back()`, `getCurrentUrl()` (path + query), `subscribe(listener)` and an optional `linkComponent` that renders internal links (navbar, tabs, vertical and sidebar navigation, progress steps). `createHistoryNavigation()` drives `window.history` and is the default. `useNavigation()` returns the adapter.

An adapter for React Router v6+:

```tsx
import { useEffect, useMemo, useRef } from 'react';
import type { ComponentType, ReactNode } from 'react';

import {
  ISmartLinkProps,
  ISmartNavigation,
  SmartProvider,
} from '@smartsoft001/react';

// The router's hooks and Link, passed in so the adapter does not import a router here.
interface RouterBindings {
  navigate: (to: string | number, options?: { replace?: boolean }) => void;
  location: { pathname: string; search: string };
  Link: ComponentType<Omit<ISmartLinkProps, 'href'> & { to: string }>;
}

export function RouterSmartProvider({
  router,
  children,
}: {
  router: RouterBindings;
  children: ReactNode;
}) {
  const listeners = useRef(new Set<(url: string) => void>());
  const url = router.location.pathname + router.location.search;
  const urlRef = useRef(url);
  urlRef.current = url;

  useEffect(() => {
    for (const listener of [...listeners.current]) listener(url);
  }, [url]);

  const { navigate, Link } = router;

  const navigation = useMemo<ISmartNavigation>(
    () => ({
      navigate: (to, options) => navigate(to, { replace: options?.replace }),
      back: () => navigate(-1),
      getCurrentUrl: () => urlRef.current,
      subscribe: (listener) => {
        listeners.current.add(listener);
        return () => listeners.current.delete(listener);
      },
      linkComponent: ({ href, ...rest }: ISmartLinkProps) => (
        <Link to={href} {...rest} />
      ),
    }),
    [navigate, Link],
  );

  return <SmartProvider navigation={navigation}>{children}</SmartProvider>;
}
```

With React Router, `router.navigate` is `useNavigate()`, `router.location` is `useLocation()` and `router.Link` wraps `Link`. Keep the adapter stable (memoised on stable inputs): a new object changes the context.

## Services and hooks

| Hook                               | Returns               | Use it for                                                                                                                                                                                                                          |
| ---------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useSmart()`                       | `SmartContextValue`   | The whole context (every service, provider and registry).                                                                                                                                                                           |
| `useTranslate()`                   | `SmartTranslateFn`    | Translating keys.                                                                                                                                                                                                                   |
| `useNavigation()`                  | `ISmartNavigation`    | Navigating, reading the URL.                                                                                                                                                                                                        |
| `useSmartComponent(key, fallback)` | `ComponentType`       | Resolving a registry key in a wrapper of your own.                                                                                                                                                                                  |
| `useAuthService()`                 | `AuthService`         | The JWT in storage (`AUTH_TOKEN`): `isAuthenticated()`, `expectPermissions(perms)`, `getPermissions()`, `getTokenPayload()`, `getAccessToken()`, `setToken(token)`, `removeToken()`. An expired token is removed when read.         |
| `useHttpClient()`                  | `SmartHttpClient`     | `get`, `post`, `put`, `patch`, `delete`, `request` over `fetch`, with interceptors (`addInterceptor`); non-2xx responses throw `SmartHttpError` (`status`, `body`). `createAuthInterceptor(getToken)` adds `Authorization: Bearer`. |
| `useFileService()`                 | `FileService \| null` | `upload(file, onProgress)`, `download(id)`, `delete(id)`, `getUrl(id)` under `<apiUrl>/attachments`; `null` without `fileServiceConfig`. `useFileUrl(file)` gives an attachment's URL.                                              |
| `useToastService()`                | `ToastService`        | `info({ message, title?, duration?, buttons? })`, `error(...)` (`react-components-overlays`).                                                                                                                                       |
| `useAlertService()`                | `AlertService`        | `show(options)` resolving with the chosen button (`react-components-alert`).                                                                                                                                                        |
| `useModalService()`                | `ModalService`        | `show({ component, props })` and `dismiss(data)` (`react-components-modal`).                                                                                                                                                        |
| `useMenuService()`                 | `MenuService`         | Menu items, `enable()` / `disable()`, `openEnd({ component, props })` / `closeEnd()` and the `endContent` store (`react-components-app`).                                                                                           |
| `useAppService()`                  | `AppService`          | `addEndButton` / `removeEndButton` (the `endButtons` store) and the document title (`initTitle`, `updateTitle(url)`).                                                                                                               |
| `useStorageService()`              | `StorageService`      | JSON values in `localStorage`, safe during server-side rendering.                                                                                                                                                                   |
| `useErrorService()`                | `ErrorService`        | Logs an error and shows an error toast.                                                                                                                                                                                             |
| `useStyleService()`                | `StyleService`        | Writes style settings as CSS custom properties on an element.                                                                                                                                                                       |
| `useDetailsService()`              | `DetailsService`      | The root object of the shown form or details, for `$root` in `enabled` specifications.                                                                                                                                              |
| `useFormFactory()`                 | `FormFactory`         | Building forms from models (`react-forms`).                                                                                                                                                                                         |

The services that hold UI state keep it in a `SmartStore` (`get()`, `set()`, `update()`, `subscribe()`); read one in a component with `useStore(store, selector?)`, which re-renders only when the selected value changes.

## Model providers

Abstract classes to extend and pass to `SmartProvider`:

```ts
import {
  IModelLabelOptions,
  IModelLabelProvider,
  IModelPossibilitiesOptions,
  IModelPossibilitiesProvider,
  SmartPossibility,
} from '@smartsoft001/react';

export class AppLabelProvider extends IModelLabelProvider {
  get({ key, type }: IModelLabelOptions): string | null {
    // Return nothing to fall back to the MODEL.<key> translation.
    return type?.name === 'Invoice' && key === 'total' ? 'Total (gross)' : null;
  }
}

export class AppPossibilitiesProvider extends IModelPossibilitiesProvider {
  async get({
    key,
  }: IModelPossibilitiesOptions): Promise<SmartPossibility[] | null> {
    if (key !== 'country') return null; // keep the field's own possibilities
    const countries: Array<{ code: string; name: string }> = await fetch(
      '/api/countries',
    ).then((r) => r.json());
    return countries.map((c) => ({ id: c.code, text: c.name, checked: false }));
  }
}
```

`IModelPossibilitiesProvider.get` is asked again (500 ms after the form's value last changed), so options can depend on other fields; CRUD filters use it too. `IModelValidatorsProvider` is described in `react-forms`.

## Shared option types

| Type               | Values                                                                                                                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartColor`       | `'slate' \| 'gray' \| 'zinc' \| 'neutral' \| 'stone' \| 'red' \| 'orange' \| 'amber' \| 'yellow' \| 'lime' \| 'green' \| 'emerald' \| 'teal' \| 'cyan' \| 'sky' \| 'blue' \| 'indigo' \| 'violet' \| 'purple' \| 'fuchsia' \| 'pink' \| 'rose'` (default `'indigo'` where a component has one) |
| `SmartSize`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                                                                                                                                                                                                         |
| `SmartVariant`     | `'primary' \| 'secondary' \| 'soft'`                                                                                                                                                                                                                                                           |
| `SmartPossibility` | `{ id: any; text: string; checked: boolean }`, an option of an `enum` / `radio` / `check` / `strings` field                                                                                                                                                                                    |

`COMPONENT_COLORS` maps every `SmartColor` to the `primary` / `secondary` / `soft` class lists (with dark variants) the button uses.

## Utilities

- `cn(...classes)`: joins class names, skipping falsy values and flattening arrays.
- `trustHtml(html)`, `sanitizeHtml(html)`, `toInnerHtml(value)`, `escapeHtml(text)`: HTML that details and lists render is sanitised with DOMPurify; a cell pipe returning `trustHtml(html)` opts out.
- `useModelLabel(instance, key, type)`, `useModelLabelFn()`, `useListHeaderFn()`: labels through the label provider and translations.

## File Locations

Source: `packages/shared/react/src/lib/` in the smartsoft001 repository.

- `providers/smart-provider.tsx`, `providers/smart-context.ts`: `SmartProvider`, `SmartConfig`, `useSmart`, `createSmartServices`
- `providers/hooks.ts`: `useTranslate`, `useNavigation`, `useSmartComponent`, the service hooks
- `providers/navigation.ts`: `ISmartNavigation`, `createHistoryNavigation`
- `providers/model-*.provider.ts`: the model provider classes
- `components/presets/presets.ts`: `SMART_PRESET_COMPONENTS`
- `i18n/`: `createTranslator`, `mergeTranslations`, the default dictionaries
- `services/`: the services; `store/store.ts`: `SmartStore`, `useStore`
- `models/interfaces.ts`: the option interfaces and shared types
