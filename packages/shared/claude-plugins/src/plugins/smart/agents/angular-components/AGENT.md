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

| Component | Skill                        | Selector          | Token                              |
| --------- | ---------------------------- | ----------------- | ---------------------------------- |
| Details   | `angular-components-details` | `<smart-details>` | `DETAILS_STANDARD_COMPONENT_TOKEN` |
| Form      | `angular-components-form`    | `<smart-form>`    | `FORM_STANDARD_COMPONENT_TOKEN`    |

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
2. **Wants to use `<smart-details>` or `<smart-form>`** → delegate to the skill to explain usage, token override pattern, and how to extend the base class with a custom implementation
3. **Wants to use `<smart-button>`, `<smart-card>`, `<smart-accordion>`, `<smart-page>`, or `<smart-paging>`** → delegate to the skill to explain how to extend the base class and create a custom implementation
4. **Wants to create a custom component** → delegate to the base-only skill for extension patterns and API

## Skills to Use

Always delegate to the per-component skill for detailed API, usage examples, and options:

- **Date Edit** → use skill `angular-components-date-edit`
- **Date Range** → use skill `angular-components-date-range`
- **Accordion** (base only) → use skill `angular-components-accordion`
- **Detail** → use skill `angular-components-detail`
- **Details** (with extension token) → use skill `angular-components-details`
- **Form** (with extension token) → use skill `angular-components-form`
- **Input** → use skill `angular-components-input`
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
  ButtonBaseComponent,
  CardBaseComponent,
  AccordionBaseComponent,
  DetailBaseComponent,
  DetailsBaseComponent,
  DETAILS_STANDARD_COMPONENT_TOKEN,
  FormBaseComponent,
  FORM_STANDARD_COMPONENT_TOKEN,
  InputBaseComponent,
  InputPossibilitiesBaseComponent,
  PageBaseComponent,
  PAGE_VARIANT_COMPONENTS_TOKEN,
  SmartPageVariant,
  PagingBaseComponent,
  PAGING_STANDARD_COMPONENT_TOKEN,
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
- Dark mode via `dark:smart:` prefix
- External classes via `cssClass` input
