---
name: react-components-breadcrumbs
description: SmartBreadcrumbs React component API (@smartsoft001/react) — breadcrumb trail with link or button items, chevron/slash/arrow separators and four layouts, onItemClick, the 'breadcrumbs' registry key, SmartBreadcrumbsPreset and useBreadcrumbs.
user-invocable: false
---

# Breadcrumbs (`SmartBreadcrumbs`)

`SmartBreadcrumbs` renders a breadcrumb trail inside a `nav` (labelled `options.ariaLabel`, `'Breadcrumb'` by default). Items with `href` are links; items without one are buttons reported through `onItemClick({ itemId })`, so the trail also works with a router that navigates in code. The item marked `current` gets `aria-current="page"`. `options.separator` and `options.layout` choose the look, styled by `SmartBreadcrumbsPreset`.

## When to Use This Skill

- Showing where a page sits in the hierarchy (Home / Projects / Alpha)
- Navigating through a click handler instead of `href` (`onItemClick`)
- Choosing the separator glyph or a contained / full-width bar layout
- Restyling every breadcrumb trail (the `breadcrumbs` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                                                    |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartBreadcrumbs`         | component | Renders the implementation registered as `components.breadcrumbs` on `SmartProvider`, `SmartBreadcrumbsStandard` by default.                                  |
| `SmartBreadcrumbsPreset`   | component | Styled breadcrumbs variation (preset).                                                                                                                        |
| `SmartBreadcrumbsStandard` | component | The default breadcrumbs rendering: semantic markup with `breadcrumbs-*` class hooks; items with `href` are links, the others buttons reporting `onItemClick`. |
| `useBreadcrumbs`           | hook      | The behaviour every breadcrumbs variant shares: the items to render and the click on an item without `href`, reported as `{ itemId }`.                        |

The preset's class helpers (`getBreadcrumbsNavClasses`, `getBreadcrumbsListClasses`, `getBreadcrumbsItemClasses`, `getBreadcrumbsLinkClasses`, `getBreadcrumbsCurrentClasses`, `getBreadcrumbsSeparatorClasses`, `resolveBreadcrumbsSeparator`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartBreadcrumbsProps`

| Prop           | Type                                     | Default | Description                                             |
| -------------- | ---------------------------------------- | ------- | ------------------------------------------------------- |
| `options?`     | `IBreadcrumbsOptions`                    | —       | The items and the look.                                 |
| `className?`   | `string`                                 | —       | Classes on the root `nav`.                              |
| `onItemClick?` | `(event: IBreadcrumbsItemClick) => void` | —       | Click on an item without `href` (rendered as a button). |

### `IBreadcrumbsOptions`

| Field        | Type                        | Default        | Description                                                                                                                                                     |
| ------------ | --------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout?`    | `SmartBreadcrumbsLayout`    | —              | `contained` or `full-width-bar` wrap the trail in a bar; `simple-with-slashes` implies the slash separator. Read by the preset; the standard markup ignores it. |
| `ariaLabel?` | `string`                    | `'Breadcrumb'` | Accessible name of the `nav`.                                                                                                                                   |
| `separator?` | `SmartBreadcrumbsSeparator` | `'chevron'`    | Glyph between items (`data-separator` on the standard markup).                                                                                                  |
| `items`      | `IBreadcrumbItem[]`         | required       | The trail, first to last.                                                                                                                                       |

### `IBreadcrumbsItemClick`

Payload of `onItemClick`.

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `itemId` | `string` | required | The `id` of the clicked item. |

### `IBreadcrumbItem`

| Field          | Type        | Default  | Description                                                  |
| -------------- | ----------- | -------- | ------------------------------------------------------------ |
| `id`           | `string`    | required | Reported as `itemId` by `onItemClick`.                       |
| `label?`       | `string`    | —        | Visible text.                                                |
| `href?`        | `string`    | —        | Renders the item as a link; without it the item is a button. |
| `iconTpl?`     | `ReactNode` | —        | Icon before the label (e.g. a home icon).                    |
| `srOnlyLabel?` | `string`    | —        | Text for screen readers only, for an icon-only item.         |
| `current?`     | `boolean`   | —        | Marks the current page (`aria-current="page"`).              |

### Related types

- `SmartBreadcrumbsLayout`: `'contained' \| 'full-width-bar' \| 'simple-with-chevrons' \| 'simple-with-slashes'`
- `SmartBreadcrumbsSeparator`: `'chevron' \| 'slash' \| 'arrow'`

## Usage

```tsx
import { SmartBreadcrumbs, useNavigation } from '@smartsoft001/react';

export function ProjectBreadcrumbs({ projectName }: { projectName: string }) {
  const navigation = useNavigation();

  return (
    <SmartBreadcrumbs
      options={{
        separator: 'slash',
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'projects', label: 'Projects' },
          { id: 'project', label: projectName, current: true },
        ],
      }}
      onItemClick={({ itemId }) => {
        if (itemId === 'projects') navigation.navigate('/projects');
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartBreadcrumbs` renders the component registered under the `'breadcrumbs'` key of `SmartProvider`'s `components`, and `SmartBreadcrumbsStandard` when nothing is registered there. Every `SmartBreadcrumbs` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartBreadcrumbsPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { breadcrumbs: SmartBreadcrumbsPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartBreadcrumbsPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartBreadcrumbs`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useBreadcrumbs` hook

The behaviour every breadcrumbs variant shares: the items to render and the click on an item without `href`, reported as `{ itemId }`.

```ts
function useBreadcrumbs({
  options,
  onItemClick,
}: Pick<SmartBreadcrumbsProps, 'options' | 'onItemClick'>);
```

| Returns     | Type                                    | Description                                                |
| ----------- | --------------------------------------- | ---------------------------------------------------------- |
| `items`     | `IBreadcrumbItem[]`                     | `options.items ?? []`.                                     |
| `itemClick` | `(itemId: string) => void \| undefined` | Reports a click on an item without `href` as `{ itemId }`. |

```tsx
import { SmartBreadcrumbsProps, useBreadcrumbs } from '@smartsoft001/react';

export function TextBreadcrumbs({
  options,
  className,
  onItemClick,
}: SmartBreadcrumbsProps) {
  const { items, itemClick } = useBreadcrumbs({ options, onItemClick });

  return (
    <nav aria-label={options?.ariaLabel ?? 'Breadcrumb'} className={className}>
      {items.map((item, index) => (
        <span key={item.id}>
          {index > 0 && ' › '}
          {item.href ? (
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </a>
          ) : (
            <button type="button" onClick={() => itemClick(item.id)}>
              {item.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
```

## Styling

- `SmartBreadcrumbsStandard` renders semantic markup with `breadcrumbs-*` class hooks (`breadcrumbs-link`, `breadcrumbs-button`, `breadcrumbs-separator`, `current`) and `data-separator` for your own CSS.
- `SmartBreadcrumbsPreset` renders muted links, a bold current crumb and the separator glyph, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/breadcrumbs/` in the smartsoft001 repository.

- `breadcrumbs.tsx`: `SmartBreadcrumbs`
- `breadcrumbs.types.ts`: `IBreadcrumbsItemClick`, `SmartBreadcrumbsProps`
- `preset/breadcrumbs-preset.tsx`: `SmartBreadcrumbsPreset`
- `standard/breadcrumbs-standard.tsx`: `SmartBreadcrumbsStandard`
- `use-breadcrumbs.ts`: `useBreadcrumbs`
- `breadcrumbs.stories.tsx`: Storybook stories
