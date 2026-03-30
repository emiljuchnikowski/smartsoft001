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

## Available Components

| Component | Skill                       | Selector         | Description                                                                                             |
| --------- | --------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| Button    | `angular-components-button` | `<smart-button>` | Button with shapes (standard/rounded/circular), variants (primary/secondary/soft), sizes, color palette |
| Icon      | —                           | `<smart-icon>`   | SVG icon component (spinner)                                                                            |

## Skills to Use

When a user asks about a specific component, **always delegate to the per-component skill** for detailed API, usage examples, and options:

- **Button** → use skill `angular-components-button`

## Installation

```bash
npm i @smartsoft001/angular
```

## Import Pattern

```typescript
import { ButtonComponent } from '@smartsoft001/angular';
```

## Shared Types

All components use shared types from `@smartsoft001/angular`:

- `SmartVariant` — `'primary' | 'secondary' | 'soft'`
- `SmartSize` — `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `SmartColor` — 22 Tailwind color names (default: `'indigo'`)

## Styling

- Tailwind CSS v4 with `smart:` prefix
- Dark mode via `dark:smart:` prefix
- External classes via `class` input
