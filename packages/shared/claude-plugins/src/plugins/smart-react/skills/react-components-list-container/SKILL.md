---
name: react-components-list-container
description: SmartListContainer React component API (@smartsoft001/react) — role="list" wrapper around list entries with simple-dividers/card-dividers/separate-cards/flat-card-dividers variants exposed as data attributes, and the 'list-container' registry key (no preset).
user-invocable: false
---

# List Container (`SmartListContainer`)

`SmartListContainer` wraps list entries (`children`) in a `role="list"` element and exposes `options.variant` as `data-variant` so your CSS (or an implementation of your own) can draw dividers or cards. There is no preset for it: register a component of your own under the `list-container` key for a styled container.

## When to Use This Skill

- Wrapping a set of `role="listitem"` rows with a consistent container
- Switching between divider and card looks through one option
- Providing the application's own list container (the `list-container` registry key)

For a list of records with avatars and meta, see `react-components-stacked-list`; for model-driven lists, `react-components-list`.

## Exports

All from `@smartsoft001/react`.

| Export                       | Kind      | What it is                                                                                                                                 |
| ---------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartListContainer`         | component | Renders the implementation registered as `components['list-container']` on `SmartProvider`, `SmartListContainerStandard` by default.       |
| `SmartListContainerStandard` | component | The default list-container rendering: a `role="list"` element around `children`, exposing `options.variant` as `data-variant` for styling. |

## Props and Types

### `SmartListContainerProps`

| Prop         | Type                    | Default | Description                           |
| ------------ | ----------------------- | ------- | ------------------------------------- |
| `options?`   | `IListContainerOptions` | —       | Variant and mobile behaviour.         |
| `className?` | `string`                | —       | Classes on the `role="list"` element. |
| `children?`  | `ReactNode`             | —       | The list entries.                     |

### `IListContainerOptions`

| Field                | Type                        | Default | Description                                                                                               |
| -------------------- | --------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `variant?`           | `SmartListContainerVariant` | —       | Exposed as `data-variant`.                                                                                |
| `fullWidthOnMobile?` | `boolean`                   | —       | For implementations of your own (edge-to-edge on small screens); the standard rendering does not read it. |

### Related types

- `SmartListContainerVariant`: `'simple-dividers' \| 'card-dividers' \| 'separate-cards' \| 'flat-card-dividers'`

## Usage

```tsx
import { SmartListContainer } from '@smartsoft001/react';

export function Team() {
  return (
    <SmartListContainer options={{ variant: 'card-dividers' }}>
      <div role="listitem">Lindsay Walton — Front-end Developer</div>
      <div role="listitem">Courtney Henry — Designer</div>
    </SmartListContainer>
  );
}
```

## Replacing the Implementation

`SmartListContainer` renders the component registered under the `'list-container'` key of `SmartProvider`'s `components`, and `SmartListContainerStandard` when nothing is registered there. Every `SmartListContainer` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartListContainerProps`, as shown below, as `components={{ 'list-container': MyListContainer }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartListContainerProps } from '@smartsoft001/react';

export function CardListContainer({
  options,
  className,
  children,
}: SmartListContainerProps) {
  const cards = options?.variant === 'separate-cards';

  return (
    <div
      role="list"
      data-variant={options?.variant}
      className={[cards ? 'space-y-3' : 'divide-y rounded-md border', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
```

## Styling

- The standard rendering is unstyled: style `[data-variant]` with your own CSS or register your own component.

## File Locations

Source: `packages/shared/react/src/lib/components/list-container/` in the smartsoft001 repository.

- `list-container.tsx`: `SmartListContainer`
- `list-container.types.ts`: `SmartListContainerProps`
- `standard/list-container-standard.tsx`: `SmartListContainerStandard`
- `list-container.stories.tsx`: Storybook stories
