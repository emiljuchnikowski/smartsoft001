---
name: angular-components
description: Build UI in end-user projects using @smartsoft001/angular components. Knows available components and delegates to per-component skills for API details.
---

# Angular Components Agent

Agent for building UI in end-user Angular projects using components from `@smartsoft001/angular`.

## When to Use

Use this agent when a developer needs to:

- Build a page or feature UI using `@smartsoft001/angular` components
- Choose the right component for a UI requirement
- Get correct usage, imports, and options for a component
- Extend a base component class to create a custom implementation

## Component Availability

This package contains two categories of components:

### Ready-to-Use Components (base + default implementation)

These have concrete selectors and can be used directly in templates.

| Component  | Skill                           | Selector             | Description                                                                    |
| ---------- | ------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| Date Edit  | `angular-components-date-edit`  | `<smart-date-edit>`  | Digit-by-digit date input (DD-MM-RRRR) with validation                         |
| Date Range | `angular-components-date-range` | `<smart-date-range>` | Date range picker with modal calendar and quick filters                        |
| Detail     | `angular-components-detail`     | `<smart-detail>`     | Renders a single model field by dispatching to a sub-component per `FieldType` |
| Input      | `angular-components-input`      | `<smart-input>`      | Renders a form input by dispatching to a sub-component per `FieldType`         |
| Icon       | —                               | `<smart-icon>`       | SVG icon component (spinner)                                                   |

### Ready-to-Use with extension token

These render a default standard implementation and accept a custom implementation via an InjectionToken.

| Component           | Skill                                    | Selector                      | Token                                          |
| ------------------- | ---------------------------------------- | ----------------------------- | ---------------------------------------------- |
| Action Panel        | `angular-components-action-panel`        | `<smart-action-panel>`        | `ACTION_PANEL_STANDARD_COMPONENT_TOKEN`        |
| Breadcrumbs         | `angular-components-breadcrumbs`         | `<smart-breadcrumbs>`         | `BREADCRUMBS_STANDARD_COMPONENT_TOKEN`         |
| Calendar            | `angular-components-calendar`            | `<smart-calendar>`            | `CALENDAR_STANDARD_COMPONENT_TOKEN`            |
| Card Heading        | `angular-components-card-heading`        | `<smart-card-heading>`        | `CARD_HEADING_STANDARD_COMPONENT_TOKEN`        |
| Description List    | `angular-components-description-list`    | `<smart-description-list>`    | `DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN`    |
| Details             | `angular-components-details`             | `<smart-details>`             | `DETAILS_STANDARD_COMPONENT_TOKEN`             |
| Empty State         | `angular-components-empty-state`         | `<smart-empty-state>`         | `EMPTY_STATE_STANDARD_COMPONENT_TOKEN`         |
| Feed                | `angular-components-feed`                | `<smart-feed>`                | `FEED_STANDARD_COMPONENT_TOKEN`                |
| Form                | `angular-components-form`                | `<smart-form>`                | `FORM_STANDARD_COMPONENT_TOKEN`                |
| Grid List           | `angular-components-grid-list`           | `<smart-grid-list>`           | `GRID_LIST_STANDARD_COMPONENT_TOKEN`           |
| Info                | `angular-components-info`                | `<smart-info>`                | `INFO_STANDARD_COMPONENT_TOKEN`                |
| List                | `angular-components-list`                | `<smart-list>`                | `LIST_MODE_COMPONENTS_TOKEN`                   |
| Multi-Column Layout | `angular-components-multi-column-layout` | `<smart-multi-column-layout>` | `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN` |
| Navbar              | `angular-components-navbar`              | `<smart-navbar>`              | `NAVBAR_STANDARD_COMPONENT_TOKEN`              |
| Page Heading        | `angular-components-page-heading`        | `<smart-page-heading>`        | `PAGE_HEADING_STANDARD_COMPONENT_TOKEN`        |
| Password Strength   | `angular-components-password-strength`   | `<smart-password-strength>`   | `PASSWORD_STRENGTH_STANDARD_COMPONENT_TOKEN`   |
| Progress Bars       | `angular-components-progress-bars`       | `<smart-progress-bars>`       | `PROGRESS_BARS_STANDARD_COMPONENT_TOKEN`       |
| Searchbar           | `angular-components-searchbar`           | `<smart-searchbar>`           | `SEARCHBAR_STANDARD_COMPONENT_TOKEN`           |
| Section Heading     | `angular-components-section-heading`     | `<smart-section-heading>`     | `SECTION_HEADING_STANDARD_COMPONENT_TOKEN`     |
| Select Menu         | `angular-components-select-menu`         | `<smart-select-menu>`         | `SELECT_MENU_STANDARD_COMPONENT_TOKEN`         |
| Sidebar Layout      | `angular-components-sidebar-layout`      | `<smart-sidebar-layout>`      | `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`      |
| Sidebar Navigation  | `angular-components-sidebar-navigation`  | `<smart-sidebar-navigation>`  | `SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN`  |
| Sign-in Form        | `angular-components-sign-in-form`        | `<smart-sign-in-form>`        | `SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN`        |
| Stacked Layout      | `angular-components-stacked-layout`      | `<smart-stacked-layout>`      | `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`      |
| Stacked List        | `angular-components-stacked-list`        | `<smart-stacked-list>`        | `STACKED_LIST_STANDARD_COMPONENT_TOKEN`        |
| Stats               | `angular-components-stats`               | `<smart-stats>`               | `STATS_STANDARD_COMPONENT_TOKEN`               |
| Table               | `angular-components-table`               | `<smart-table>`               | `TABLE_STANDARD_COMPONENT_TOKEN`               |
| Tabs                | `angular-components-tabs`                | `<smart-tabs>`                | `TABS_STANDARD_COMPONENT_TOKEN`                |
| Textarea            | `angular-components-textarea`            | `<smart-textarea>`            | `TEXTAREA_STANDARD_COMPONENT_TOKEN`            |
| Toggle              | `angular-components-toggle`              | `<smart-toggle>`              | `TOGGLE_STANDARD_COMPONENT_TOKEN`              |
| Vertical Navigation | `angular-components-vertical-navigation` | `<smart-vertical-navigation>` | `VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN` |

### Base-Only Components (abstract classes for extension)

These provide abstract base classes (`@Directive()`) that can be extended to create custom implementations.

| Component | Skill                          | Base Class               | Description                                                       |
| --------- | ------------------------------ | ------------------------ | ----------------------------------------------------------------- |
| Button    | `angular-components-button`    | `ButtonBaseComponent`    | Variant/color computation, confirm mode, disabled state           |
| Card      | `angular-components-card`      | `CardBaseComponent`      | Container classes, header/body/footer layout, gray backgrounds    |
| Accordion | `angular-components-accordion` | `AccordionBaseComponent` | Toggle logic, disabled state, container classes                   |
| Page      | `angular-components-page`      | `PageBaseComponent`      | Header with title, back button, search, end buttons, content slot |
| Paging    | `angular-components-paging`    | `PagingBaseComponent`    | Page state, ellipsized page list, `pageChange` output             |

## Decision Logic

When a developer asks about a component:

1. **Wants to use `<smart-date-edit>`, `<smart-date-range>`, `<smart-detail>`, or `<smart-input>`** → delegate to the corresponding skill for usage API
2. **Wants to use `<smart-action-panel>`, `<smart-breadcrumbs>`, `<smart-calendar>`, `<smart-card-heading>`, `<smart-description-list>`, `<smart-details>`, `<smart-empty-state>`, `<smart-feed>`, `<smart-form>`, `<smart-grid-list>`, `<smart-info>`, `<smart-list>`, `<smart-multi-column-layout>`, `<smart-navbar>`, `<smart-page-heading>`, `<smart-password-strength>`, `<smart-progress-bars>`, `<smart-searchbar>`, `<smart-section-heading>`, `<smart-select-menu>`, `<smart-sidebar-layout>`, `<smart-sidebar-navigation>`, `<smart-sign-in-form>`, `<smart-stacked-layout>`, `<smart-stacked-list>`, `<smart-stats>`, `<smart-table>`, `<smart-tabs>`, `<smart-textarea>`, `<smart-toggle>`, or `<smart-vertical-navigation>`** → delegate to the skill to explain usage, token override pattern, and how to extend the base class with a custom implementation
3. **Wants to use `<smart-button>`, `<smart-card>`, `<smart-accordion>`, `<smart-page>`, or `<smart-paging>`** → delegate to the skill to explain how to extend the base class and create a custom implementation
4. **Wants to create a custom component** → delegate to the base-only skill for extension patterns and API

## Skills to Use

Always delegate to the per-component skill for detailed API, usage examples, and options:

- **Date Edit** → use skill `angular-components-date-edit`
- **Date Range** → use skill `angular-components-date-range`
- **Accordion** (base only) → use skill `angular-components-accordion`
- **Action Panel** (with extension token) → use skill `angular-components-action-panel`
- **Breadcrumbs** (with extension token) → use skill `angular-components-breadcrumbs`
- **Detail** → use skill `angular-components-detail`
- **Calendar** (with extension token) → use skill `angular-components-calendar`
- **Card Heading** (with extension token) → use skill `angular-components-card-heading`
- **Description List** (with extension token) → use skill `angular-components-description-list`
- **Details** (with extension token) → use skill `angular-components-details`
- **Empty State** (with extension token) → use skill `angular-components-empty-state`
- **Feed** (with extension token) → use skill `angular-components-feed`
- **Form** (with extension token) → use skill `angular-components-form`
- **Grid List** (with extension token) → use skill `angular-components-grid-list`
- **Info** (with extension token) → use skill `angular-components-info`
- **Input** → use skill `angular-components-input`
- **List** (with extension token map) → use skill `angular-components-list`
- **Multi-Column Layout** (with extension token) → use skill `angular-components-multi-column-layout`
- **Navbar** (with extension token) → use skill `angular-components-navbar`
- **Page Heading** (with extension token) → use skill `angular-components-page-heading`
- **Password Strength** (with extension token) → use skill `angular-components-password-strength`
- **Progress Bars** (with extension token) → use skill `angular-components-progress-bars`
- **Searchbar** (with extension token) → use skill `angular-components-searchbar`
- **Section Heading** (with extension token) → use skill `angular-components-section-heading`
- **Select Menu** (with extension token) → use skill `angular-components-select-menu`
- **Sidebar Layout** (with extension token) → use skill `angular-components-sidebar-layout`
- **Sidebar Navigation** (with extension token) → use skill `angular-components-sidebar-navigation`
- **Sign-in Form** (with extension token) → use skill `angular-components-sign-in-form`
- **Stacked Layout** (with extension token) → use skill `angular-components-stacked-layout`
- **Stacked List** (with extension token) → use skill `angular-components-stacked-list`
- **Stats** (with extension token) → use skill `angular-components-stats`
- **Table** (with extension token) → use skill `angular-components-table`
- **Tabs** (with extension token) → use skill `angular-components-tabs`
- **Textarea** (with extension token) → use skill `angular-components-textarea`
- **Toggle** (with extension token) → use skill `angular-components-toggle`
- **Vertical Navigation** (with extension token) → use skill `angular-components-vertical-navigation`
- **Button** (base only) → use skill `angular-components-button`
- **Card** (base only) → use skill `angular-components-card`
- **Page** (base only) → use skill `angular-components-page`
- **Paging** (base only) → use skill `angular-components-paging`

## Installation

```bash
npm i @smartsoft001/angular
```

## Import Patterns

```typescript
// Ready-to-use components
import {
  DateEditDefaultComponent,
  DateRangeDefaultComponent,
  DetailComponent,
  InputComponent,
  DETAIL_FIELD_COMPONENTS_TOKEN,
  INPUT_FIELD_COMPONENTS_TOKEN,
} from '@smartsoft001/angular';

// Base classes for extension
import {
  ActionPanelBaseComponent,
  ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
  BreadcrumbsBaseComponent,
  BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
  ButtonBaseComponent,
  CalendarBaseComponent,
  CALENDAR_STANDARD_COMPONENT_TOKEN,
  CardBaseComponent,
  CardHeadingBaseComponent,
  CARD_HEADING_STANDARD_COMPONENT_TOKEN,
  AccordionBaseComponent,
  DescriptionListBaseComponent,
  DESCRIPTION_LIST_STANDARD_COMPONENT_TOKEN,
  DetailBaseComponent,
  DetailsBaseComponent,
  DETAILS_STANDARD_COMPONENT_TOKEN,
  EmptyStateBaseComponent,
  EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
  FeedBaseComponent,
  FEED_STANDARD_COMPONENT_TOKEN,
  FormBaseComponent,
  FORM_STANDARD_COMPONENT_TOKEN,
  GridListBaseComponent,
  GRID_LIST_STANDARD_COMPONENT_TOKEN,
  InfoBaseComponent,
  INFO_STANDARD_COMPONENT_TOKEN,
  InputBaseComponent,
  InputPossibilitiesBaseComponent,
  ListBaseComponent,
  LIST_MODE_COMPONENTS_TOKEN,
  ListMode,
  IListOptions,
  IListProvider,
  MultiColumnLayoutBaseComponent,
  MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
  NavbarBaseComponent,
  NAVBAR_STANDARD_COMPONENT_TOKEN,
  PageBaseComponent,
  PAGE_VARIANT_COMPONENTS_TOKEN,
  SmartPageVariant,
  PageHeadingBaseComponent,
  PAGE_HEADING_STANDARD_COMPONENT_TOKEN,
  PagingBaseComponent,
  PAGING_STANDARD_COMPONENT_TOKEN,
  ProgressBarsBaseComponent,
  PROGRESS_BARS_STANDARD_COMPONENT_TOKEN,
  SearchbarBaseComponent,
  SEARCHBAR_STANDARD_COMPONENT_TOKEN,
  SectionHeadingBaseComponent,
  SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
  SelectMenuBaseComponent,
  SELECT_MENU_STANDARD_COMPONENT_TOKEN,
  SidebarLayoutBaseComponent,
  SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
  SidebarNavigationBaseComponent,
  SIDEBAR_NAVIGATION_STANDARD_COMPONENT_TOKEN,
  SignInFormBaseComponent,
  SIGN_IN_FORM_STANDARD_COMPONENT_TOKEN,
  StackedLayoutBaseComponent,
  STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
  StackedListBaseComponent,
  STACKED_LIST_STANDARD_COMPONENT_TOKEN,
  StatsBaseComponent,
  STATS_STANDARD_COMPONENT_TOKEN,
  TableBaseComponent,
  TABLE_STANDARD_COMPONENT_TOKEN,
  TabsBaseComponent,
  TABS_STANDARD_COMPONENT_TOKEN,
  TextareaBaseComponent,
  TEXTAREA_STANDARD_COMPONENT_TOKEN,
  ToggleBaseComponent,
  TOGGLE_STANDARD_COMPONENT_TOKEN,
  VerticalNavigationBaseComponent,
  VERTICAL_NAVIGATION_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';

// Base classes for date components (also extensible)
import {
  DateEditBaseComponent,
  DateRangeBaseComponent,
  DateRangeModalBaseComponent,
} from '@smartsoft001/angular';
```

## Shared Types

All components use shared types from `@smartsoft001/angular`:

- `SmartVariant` — `'primary' | 'secondary' | 'soft'`
- `SmartSize` — `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `SmartColor` — 22 Tailwind color names (default: `'indigo'`)

## Styling

- Tailwind CSS v4 with `smart:` prefix
- Dark mode via `smart:dark:` prefix
- External classes via `cssClass` input
