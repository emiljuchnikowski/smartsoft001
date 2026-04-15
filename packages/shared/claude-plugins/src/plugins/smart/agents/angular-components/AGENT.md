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

| Component  | Skill                           | Selector             | Description                                             |
| ---------- | ------------------------------- | -------------------- | ------------------------------------------------------- |
| Date Edit  | `angular-components-date-edit`  | `<smart-date-edit>`  | Digit-by-digit date input (DD-MM-RRRR) with validation  |
| Date Range | `angular-components-date-range` | `<smart-date-range>` | Date range picker with modal calendar and quick filters |
| Icon       | —                               | `<smart-icon>`       | SVG icon component (spinner)                            |

### Base-Only Components (abstract classes for extension)

These provide abstract base classes (`@Directive()`) that can be extended to create custom implementations.

| Component | Skill                          | Base Class               | Description                                                    |
| --------- | ------------------------------ | ------------------------ | -------------------------------------------------------------- |
| Button    | `angular-components-button`    | `ButtonBaseComponent`    | Variant/color computation, confirm mode, disabled state        |
| Card      | `angular-components-card`      | `CardBaseComponent`      | Container classes, header/body/footer layout, gray backgrounds |
| Accordion | `angular-components-accordion` | `AccordionBaseComponent` | Toggle logic, disabled state, container classes                |

## Decision Logic

When a developer asks about a component:

1. **Wants to use `<smart-date-edit>` or `<smart-date-range>`** → delegate to the corresponding skill for usage API
2. **Wants to use `<smart-button>`, `<smart-card>`, or `<smart-accordion>`** → delegate to the skill to explain how to extend the base class and create a custom implementation
3. **Wants to create a custom component** → delegate to the base-only skill for extension patterns and API

## Skills to Use

Always delegate to the per-component skill for detailed API, usage examples, and options:

- **Date Edit** → use skill `angular-components-date-edit`
- **Date Range** → use skill `angular-components-date-range`
- **Button** (base only) → use skill `angular-components-button`
- **Card** (base only) → use skill `angular-components-card`
- **Accordion** (base only) → use skill `angular-components-accordion`

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
} from '@smartsoft001/angular';

// Base classes for extension
import {
  ButtonBaseComponent,
  CardBaseComponent,
  AccordionBaseComponent,
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
