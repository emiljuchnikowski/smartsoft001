---
name: react-components
description: Build UI in React applications using @smartsoft001/react components and @smartsoft001/crud-shell-react screens. Knows which component fits a requirement and delegates to the per-component react-components-* skills, react-provider, react-forms and smart-crud-react for exact APIs.
---

# React Components Agent

Agent for building UI in React applications with the components of `@smartsoft001/react` (and the CRUD screens of `@smartsoft001/crud-shell-react`).

## When to Use

Use this agent when a developer needs to:

- Build a page or feature UI from `@smartsoft001/react` components
- Choose the right component for a UI requirement
- Get the correct props, options objects, callbacks and imports of a component
- Restyle components application-wide (presets, the `components` registry of `SmartProvider`)
- Write a custom implementation of a component on its `use<Name>` hook and register it
- Build model-driven forms, details and lists, or complete CRUD screens

## How the library works

- Every component is a function component configured with props and, usually, an `options` object (`IButtonOptions`, `IFormOptions`, ...). Content slots are `ReactNode` props (`*Tpl`), state that can change is a plain prop, and two-way values are **controlled props with an uncontrolled fallback** (`value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, ...).
- `SmartProvider` (skill `react-provider`) is the root: translations, navigation adapter, services, model providers and the **component registry**. A wrapper such as `SmartButton` renders the component registered under its key (`components={{ button: MyButton }}`), else its `Standard` implementation; `<Name>Preset` is the styled implementation, and `SMART_PRESET_COMPONENTS` registers every preset at once.
- Each wrapper exposes its shared logic as a `use<Name>` hook; a custom implementation takes the same props, calls the hook and is registered under the wrapper's key.
- Forms, details and lists read the model's `@Model` / `@Field` metadata from `@smartsoft001/models` (skills `react-forms`, `react-components-form`, `react-components-input`, `react-components-details`, `react-components-detail`, `react-components-list`).
- Styling: Tailwind CSS 4 classes with the `smart:` prefix, precompiled in `@smartsoft001/react/styles.css`; dark mode through a `dark` class on `<html>`. Several standard implementations are deliberately unstyled markup with `data-*` attributes and class hooks; the presets carry the visual design.

## Component Availability

### Components with a registry key

Each renders the component registered under its key on `SmartProvider`, else its standard implementation.

| Component           | Skill                                  | Wrapper                   | Registry key          | Preset                          |
| ------------------- | -------------------------------------- | ------------------------- | --------------------- | ------------------------------- |
| Action Panel        | `react-components-action-panel`        | `SmartActionPanel`        | `action-panel`        | `SmartActionPanelPreset`        |
| Alert               | `react-components-alert`               | `SmartAlert`              | `alert`               | —                               |
| App                 | `react-components-app`                 | `SmartApp`                | `app`                 | —                               |
| Avatar              | `react-components-avatar`              | `SmartAvatar`             | `avatar`              | `SmartAvatarPreset`             |
| Badge               | `react-components-badge`               | `SmartBadge`              | `badge`               | `SmartBadgePreset`              |
| Breadcrumbs         | `react-components-breadcrumbs`         | `SmartBreadcrumbs`        | `breadcrumbs`         | `SmartBreadcrumbsPreset`        |
| Button              | `react-components-button`              | `SmartButton`             | `button`              | `SmartButtonPreset`             |
| Button Group        | `react-components-button-group`        | `SmartButtonGroup`        | `button-group`        | `SmartButtonGroupPreset`        |
| Calendar            | `react-components-calendar`            | `SmartCalendar`           | `calendar`            | `SmartCalendarPreset`           |
| Card                | `react-components-card`                | `SmartCard`               | `card`                | `SmartCardPreset`               |
| Card Heading        | `react-components-card-heading`        | `SmartCardHeading`        | `card-heading`        | `SmartCardHeadingPreset`        |
| Command Palette     | `react-components-command-palette`     | `SmartCommandPalette`     | `command-palette`     | `SmartCommandPalettePreset`     |
| Container           | `react-components-container`           | `SmartContainer`          | `container`           | `SmartContainerPreset`          |
| Description List    | `react-components-description-list`    | `SmartDescriptionList`    | `description-list`    | `SmartDescriptionListPreset`    |
| Details             | `react-components-details`             | `SmartDetails`            | `details`             | —                               |
| Divider             | `react-components-divider`             | `SmartDivider`            | `divider`             | `SmartDividerPreset`            |
| Drawer              | `react-components-drawer`              | `SmartDrawer`             | `drawer`              | `SmartDrawerPreset`             |
| Dropdown            | `react-components-dropdown`            | `SmartDropdown`           | `dropdown`            | `SmartDropdownPreset`           |
| Empty State         | `react-components-empty-state`         | `SmartEmptyState`         | `empty-state`         | `SmartEmptyStatePreset`         |
| Feed                | `react-components-feed`                | `SmartFeed`               | `feed`                | `SmartFeedPreset`               |
| Form                | `react-components-form`                | `SmartForm`               | `form`                | `SmartFormPreset`               |
| Grid List           | `react-components-grid-list`           | `SmartGridList`           | `grid-list`           | `SmartGridListPreset`           |
| Info                | `react-components-info`                | `SmartInfo`               | `info`                | `SmartInfoPreset`               |
| List Container      | `react-components-list-container`      | `SmartListContainer`      | `list-container`      | —                               |
| Loader              | `react-components-loader`              | `SmartLoader`             | `loader`              | `SmartLoaderPreset`             |
| Media Object        | `react-components-media-object`        | `SmartMediaObject`        | `media-object`        | `SmartMediaObjectPreset`        |
| Modal               | `react-components-modal`               | `SmartModal`              | `modal`               | `SmartModalPreset`              |
| Multi-Column Layout | `react-components-multi-column-layout` | `SmartMultiColumnLayout`  | `multi-column-layout` | `SmartMultiColumnLayoutPreset`  |
| Navbar              | `react-components-navbar`              | `SmartNavbar`             | `navbar`              | `SmartNavbarPreset`             |
| Notification        | `react-components-notification`        | `SmartNotification`       | `notification`        | `SmartNotificationPreset`       |
| Page Heading        | `react-components-page-heading`        | `SmartPageHeading`        | `page-heading`        | `SmartPageHeadingPreset`        |
| Paging              | `react-components-paging`              | `SmartPaging`             | `paging`              | `SmartPagingPreset`             |
| Password Strength   | `react-components-password-strength`   | `SmartPasswordStrength`   | `password-strength`   | —                               |
| Progress Bars       | `react-components-progress-bars`       | `SmartProgressBars`       | `progress-bars`       | `SmartProgressBarsPreset`       |
| Searchbar           | `react-components-searchbar`           | `SmartSearchbar`          | `searchbar`           | —                               |
| Section Heading     | `react-components-section-heading`     | `SmartSectionHeading`     | `section-heading`     | `SmartSectionHeadingPreset`     |
| Select Menu         | `react-components-select-menu`         | `SmartSelectMenu`         | `select-menu`         | —                               |
| Sidebar Layout      | `react-components-sidebar-layout`      | `SmartSidebarLayout`      | `sidebar-layout`      | `SmartSidebarLayoutPreset`      |
| Sidebar Navigation  | `react-components-sidebar-navigation`  | `SmartSidebarNavigation`  | `sidebar-navigation`  | —                               |
| Sign-in Form        | `react-components-sign-in-form`        | `SmartSignInForm`         | `sign-in-form`        | `SmartSignInFormPreset`         |
| Stacked Layout      | `react-components-stacked-layout`      | `SmartStackedLayout`      | `stacked-layout`      | `SmartStackedLayoutPreset`      |
| Stacked List        | `react-components-stacked-list`        | `SmartStackedList`        | `stacked-list`        | `SmartStackedListPreset`        |
| Stats               | `react-components-stats`               | `SmartStats`              | `stats`               | `SmartStatsPreset`              |
| Table               | `react-components-table`               | `SmartTable`              | `table`               | `SmartTablePreset`              |
| Tabs                | `react-components-tabs`                | `SmartTabs`               | `tabs`                | `SmartTabsPreset`               |
| Textarea            | `react-components-textarea`            | `SmartTextarea`           | `textarea`            | `SmartTextareaPreset`           |
| Toggle              | `react-components-toggle`              | `SmartToggle`             | `toggle`              | `SmartTogglePreset`             |
| Vertical Navigation | `react-components-vertical-navigation` | `SmartVerticalNavigation` | `vertical-navigation` | `SmartVerticalNavigationPreset` |

### Components resolved differently

| Component  | Skill                         | Main export      | How it is customised                                                                                                                 |
| ---------- | ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Accordion  | `react-components-accordion`  | `SmartAccordion` | No registry key: render `SmartAccordionPreset`, or a component of your own on `useAccordion`.                                        |
| Date Edit  | `react-components-date-edit`  | `SmartDateEdit`  | `variant` prop: `standard` or `preset` (`SmartDateEditPreset`); `useDateEdit`.                                                       |
| Date Range | `react-components-date-range` | `SmartDateRange` | `variant` prop: `standard` or `preset` (`SmartDateRangePreset`); `useDateRange`.                                                     |
| Detail     | `react-components-detail`     | `SmartDetail`    | Field components by `FieldType`: `detailFieldComponents` (`DETAIL_PRESET_FIELD_COMPONENTS`); `useDetail`.                            |
| Export     | `react-components-export`     | `SmartExport`    | Renders `SmartButton` (the `button` key); `useExport`.                                                                               |
| Icon       | `react-components-icon`       | `SmartIcon`      | No registry key: `template` prop, or `SmartIconPreset`.                                                                              |
| Import     | `react-components-import`     | `SmartImport`    | Renders `SmartButton` (the `button` key); `useImport`.                                                                               |
| Input      | `react-components-input`      | `SmartInput`     | Field components by `FieldType`: `inputFieldComponents` (`INPUT_PRESET_FIELD_COMPONENTS`); messages under `input-error`; `useInput`. |
| List       | `react-components-list`       | `SmartList`      | Mode components: `listModeComponents` (`LIST_PRESET_MODE_COMPONENTS`); every mode at once under `list`; `useList`.                   |
| Overlays   | `react-components-overlays`   | `SmartOverlays`  | Hosts of `ToastService` / `AlertService` / `ModalService`; they render through the `notification`, `alert` and `modal` keys.         |
| Page       | `react-components-page`       | `SmartPage`      | Per variant: `page` for `standard`, `page:<variant>` otherwise (`PAGE_PRESET_VARIANT_COMPONENTS`); `usePage`.                        |

### Cross-cutting skills

| Skill              | Covers                                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `react-provider`   | `SmartProvider` props, the full registry key table, presets, translations, the navigation adapter (routers), services and their hooks, model providers, shared types, `styles.css` and dark mode.                                                      |
| `react-forms`      | `SmartFormControl` / `SmartFormGroup` / `SmartFormArray`, `SmartValidators`, `useControlBinding`, `FormFactory`, `useModelForm`, how `@Field` options become controls and validators.                                                                  |
| `smart-crud-react` | `@smartsoft001/crud-shell-react`: `CrudProvider`, `CrudFullConfig`, `SmartCrudPages` / `SmartCrudListPage` / `SmartCrudItemPage`, the `crud-list-page` / `crud-item-page` bodies, filters, export, multiselect, groups, the facade and `useCrudState`. |

## Decision Logic

When a developer asks for UI:

1. **Application setup, presets, restyling everything, routing, translations, services** (toasts, alerts, modals, auth, HTTP) → use skill `react-provider` (and `react-components-overlays` for toasts / dialogs / modals from code).
2. **A list / item screen of a collection backed by the API** → use skill `smart-crud-react`; it builds on `SmartPage`, `SmartList`, `SmartForm` and `SmartDetails`.
3. **A form for a model** → `react-components-form` (rendering) and `react-forms` (building, validation); per-field editors → `react-components-input`.
4. **Read-only fields of a record** → `react-components-details` (whole record) or `react-components-detail` (single fields).
5. **Records of a model in a list** → `react-components-list`; plain rows → `react-components-table` or `react-components-stacked-list`.
6. **Any other component** → the matching `react-components-*` skill from the tables above, for its props, callbacks, registry key, preset and hook.
7. **A custom implementation of a component** → that component's skill: it shows the props type to accept, the `use<Name>` hook to build on and the key to register under.

Always open the component's skill before writing code against it: props and option names differ between components, and several option fields are declared but read only by the preset (or by none), which the skills point out.

## Skills to Use

Always delegate to the per-component skill for detailed API, usage examples and customisation:

- **Accordion** (`SmartAccordion`) → use skill `react-components-accordion`
- **Action Panel** (`SmartActionPanel`) → use skill `react-components-action-panel`
- **Alert** (`SmartAlert`) → use skill `react-components-alert`
- **App** (`SmartApp`) → use skill `react-components-app`
- **Avatar** (`SmartAvatar`) → use skill `react-components-avatar`
- **Badge** (`SmartBadge`) → use skill `react-components-badge`
- **Breadcrumbs** (`SmartBreadcrumbs`) → use skill `react-components-breadcrumbs`
- **Button** (`SmartButton`) → use skill `react-components-button`
- **Button Group** (`SmartButtonGroup`) → use skill `react-components-button-group`
- **Calendar** (`SmartCalendar`) → use skill `react-components-calendar`
- **Card** (`SmartCard`) → use skill `react-components-card`
- **Card Heading** (`SmartCardHeading`) → use skill `react-components-card-heading`
- **Command Palette** (`SmartCommandPalette`) → use skill `react-components-command-palette`
- **Container** (`SmartContainer`) → use skill `react-components-container`
- **Date Edit** (`SmartDateEdit`) → use skill `react-components-date-edit`
- **Date Range** (`SmartDateRange`) → use skill `react-components-date-range`
- **Description List** (`SmartDescriptionList`) → use skill `react-components-description-list`
- **Detail** (`SmartDetail`) → use skill `react-components-detail`
- **Details** (`SmartDetails`) → use skill `react-components-details`
- **Divider** (`SmartDivider`) → use skill `react-components-divider`
- **Drawer** (`SmartDrawer`) → use skill `react-components-drawer`
- **Dropdown** (`SmartDropdown`) → use skill `react-components-dropdown`
- **Empty State** (`SmartEmptyState`) → use skill `react-components-empty-state`
- **Export** (`SmartExport`) → use skill `react-components-export`
- **Feed** (`SmartFeed`) → use skill `react-components-feed`
- **Form** (`SmartForm`) → use skill `react-components-form`
- **Grid List** (`SmartGridList`) → use skill `react-components-grid-list`
- **Icon** (`SmartIcon`) → use skill `react-components-icon`
- **Import** (`SmartImport`) → use skill `react-components-import`
- **Info** (`SmartInfo`) → use skill `react-components-info`
- **Input** (`SmartInput`) → use skill `react-components-input`
- **List** (`SmartList`) → use skill `react-components-list`
- **List Container** (`SmartListContainer`) → use skill `react-components-list-container`
- **Loader** (`SmartLoader`) → use skill `react-components-loader`
- **Media Object** (`SmartMediaObject`) → use skill `react-components-media-object`
- **Modal** (`SmartModal`) → use skill `react-components-modal`
- **Multi-Column Layout** (`SmartMultiColumnLayout`) → use skill `react-components-multi-column-layout`
- **Navbar** (`SmartNavbar`) → use skill `react-components-navbar`
- **Notification** (`SmartNotification`) → use skill `react-components-notification`
- **Overlays** (`SmartOverlays`) → use skill `react-components-overlays`
- **Page** (`SmartPage`) → use skill `react-components-page`
- **Page Heading** (`SmartPageHeading`) → use skill `react-components-page-heading`
- **Paging** (`SmartPaging`) → use skill `react-components-paging`
- **Password Strength** (`SmartPasswordStrength`) → use skill `react-components-password-strength`
- **Progress Bars** (`SmartProgressBars`) → use skill `react-components-progress-bars`
- **Searchbar** (`SmartSearchbar`) → use skill `react-components-searchbar`
- **Section Heading** (`SmartSectionHeading`) → use skill `react-components-section-heading`
- **Select Menu** (`SmartSelectMenu`) → use skill `react-components-select-menu`
- **Sidebar Layout** (`SmartSidebarLayout`) → use skill `react-components-sidebar-layout`
- **Sidebar Navigation** (`SmartSidebarNavigation`) → use skill `react-components-sidebar-navigation`
- **Sign-in Form** (`SmartSignInForm`) → use skill `react-components-sign-in-form`
- **Stacked Layout** (`SmartStackedLayout`) → use skill `react-components-stacked-layout`
- **Stacked List** (`SmartStackedList`) → use skill `react-components-stacked-list`
- **Stats** (`SmartStats`) → use skill `react-components-stats`
- **Table** (`SmartTable`) → use skill `react-components-table`
- **Tabs** (`SmartTabs`) → use skill `react-components-tabs`
- **Textarea** (`SmartTextarea`) → use skill `react-components-textarea`
- **Toggle** (`SmartToggle`) → use skill `react-components-toggle`
- **Vertical Navigation** (`SmartVerticalNavigation`) → use skill `react-components-vertical-navigation`
- **Provider, registry, presets, services, navigation, translations** → use skill `react-provider`
- **Form engine, validators, model forms** → use skill `react-forms`
- **CRUD screens** → use skill `smart-crud-react`

## Installation

```bash
npm install @smartsoft001/react @smartsoft001/domain-core @smartsoft001/models @smartsoft001/utils react react-dom reflect-metadata
# CRUD screens:
npm install @smartsoft001/crud-shell-react
```

Import `@smartsoft001/react/styles.css` (and `@smartsoft001/crud-shell-react/styles.css` with the CRUD screens) once, import `reflect-metadata` before the models, and wrap the application in `SmartProvider`.

## Public documentation

The package pages describe the same API: https://framework.smartflow.biz.pl/docs/packages/react and https://framework.smartflow.biz.pl/docs/packages/crud-shell-react. Every component also has Storybook stories in the repository (`packages/shared/react/src/lib/components/<name>/<name>.stories.tsx`).

## Import Patterns

```tsx
// Components, their Standard / Preset implementations, hooks and types
import {
  SmartButton,
  SmartButtonPreset,
  SmartButtonStandard,
  useButton,
  SmartButtonProps,
  IButtonOptions,
} from '@smartsoft001/react';

// Provider, presets, services and hooks
import {
  SmartProvider,
  SMART_PRESET_COMPONENTS,
  useTranslate,
  useNavigation,
  useToastService,
} from '@smartsoft001/react';

// Forms
import {
  SmartForm,
  SmartInput,
  useModelForm,
  SmartFormControl,
  SmartValidators,
} from '@smartsoft001/react';

// Model metadata
import { Model, Field, FieldType } from '@smartsoft001/models';

// CRUD screens
import {
  CrudProvider,
  CrudFullConfig,
  SmartCrudPages,
  useCrudFacade,
  useCrudState,
} from '@smartsoft001/crud-shell-react';
```

## Shared Types

- `SmartVariant`: `'primary' | 'secondary' | 'soft'`
- `SmartSize`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `SmartColor`: 22 Tailwind colour names (default `'indigo'` where a component has one)
- `SmartPossibility`: `{ id, text, checked }`, an option of an `enum` / `radio` / `check` / `strings` field

## Styling

- Tailwind CSS 4 with the `smart:` prefix, precompiled in `@smartsoft001/react/styles.css`; use your own classes in your own markup.
- Dark mode via a `dark` class on `<html>`; the components carry `smart:dark:` variants.
- External classes through the `className` prop (each skill says which element receives it).
