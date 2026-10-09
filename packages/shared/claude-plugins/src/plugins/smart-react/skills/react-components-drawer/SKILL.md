---
name: react-components-drawer
description: SmartDrawer React component API (@smartsoft001/react) — side panel (offcanvas) with a title and close button, controlled open/onOpenChange or uncontrolled defaultOpen, onClosed, left/right position, wide and overlay options, the 'drawer' registry key, SmartDrawerPreset and useDrawer.
user-invocable: false
---

# Drawer (`SmartDrawer`)

`SmartDrawer` is a side panel (`role="dialog"`) that slides in from the right (or left) with a header holding the `title` and a close button, and `children` as the body. Its open state is controlled (`open` + `onOpenChange`) or kept inside (`defaultOpen`). Closing through the close button or the overlay calls `onClosed`. It renders nothing while closed.

## When to Use This Skill

- Showing details, a form or filters in a side panel without leaving the page
- Opening and closing a panel from the parent (`open` + `onOpenChange`)
- Choosing the side, the width and a backdrop (`options.position`, `wide`, `withOverlay`)
- Restyling every drawer (the `drawer` registry key) or building one on `useDrawer`

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                                                                   |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartDrawer`         | component | Renders the implementation registered as `components.drawer` on `SmartProvider`, `SmartDrawerStandard` by default.                                                                                           |
| `SmartDrawerPreset`   | component | Styled drawer (offcanvas) variation (preset).                                                                                                                                                                |
| `SmartDrawerStandard` | component | The default drawer rendering.                                                                                                                                                                                |
| `useDrawer`           | hook      | The behaviour every drawer variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`, and `close()`, which hides the drawer and reports `onClosed`. |

The preset's class helpers (`getDrawerPanelClasses`, `getDrawerBackdropClasses`, `getDrawerHeaderClasses`, `getDrawerTitleClasses`, `getDrawerCloseClasses`, `getDrawerBodyClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDrawerProps`

| Prop            | Type                      | Default | Description                                                                                                  |
| --------------- | ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| `open?`         | `boolean`                 | —       | Whether the drawer is shown. Leave it `undefined` for an uncontrolled drawer that starts from `defaultOpen`. |
| `defaultOpen?`  | `boolean`                 | `false` | Initial `open` of an uncontrolled drawer.                                                                    |
| `onOpenChange?` | `(open: boolean) => void` | —       | Called when the drawer opens or closes.                                                                      |
| `title?`        | `string`                  | —       | Heading of the panel; the standard drawer renders the header (with the close button) only when it is set.    |
| `options?`      | `IDrawerOptions`          | —       | Side, width, backdrop and header look.                                                                       |
| `className?`    | `string`                  | —       | Classes on the panel.                                                                                        |
| `onClosed?`     | `() => void`              | —       | Called after the drawer closed itself (close button / overlay click).                                        |
| `children?`     | `ReactNode`               | —       | The body of the panel.                                                                                       |

### `IDrawerOptions`

| Field            | Type                 | Default   | Description                                                                 |
| ---------------- | -------------------- | --------- | --------------------------------------------------------------------------- |
| `position?`      | `'left' \| 'right'`  | `'right'` | The side the panel opens on.                                                |
| `wide?`          | `boolean`            | —         | A wider panel (preset).                                                     |
| `withOverlay?`   | `boolean`            | —         | Renders a backdrop; a click on it closes the drawer.                        |
| `brandedHeader?` | `boolean`            | —         | A coloured header (preset).                                                 |
| `stickyFooter?`  | `boolean`            | —         | Declared; not read by the standard or preset drawer.                        |
| `variant?`       | `SmartDrawerVariant` | —         | Declared (`SmartDrawerVariant`); not read by the standard or preset drawer. |

### Related types

- `SmartDrawerVariant`: `'empty' \| 'create-form' \| 'user-profile' \| 'contact-list' \| 'file-details'`

## Usage

```tsx
import { useState } from 'react';

import { SmartButton, SmartDrawer } from '@smartsoft001/react';

export function OrderDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SmartButton options={{ click: () => setOpen(true) }}>
        Show order
      </SmartButton>
      <SmartDrawer
        open={open}
        onOpenChange={setOpen}
        title="Order #1024"
        options={{ position: 'right', withOverlay: true, wide: true }}
      >
        <p>3 items, shipped yesterday.</p>
      </SmartDrawer>
    </>
  );
}
```

## Replacing the Implementation

`SmartDrawer` renders the component registered under the `'drawer'` key of `SmartProvider`'s `components`, and `SmartDrawerStandard` when nothing is registered there. Every `SmartDrawer` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartDrawerPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { drawer: SmartDrawerPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartDrawerPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartDrawer`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useDrawer` hook

The behaviour every drawer variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`, and `close()`, which hides the drawer and reports `onClosed`.

```ts
function useDrawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClosed,
}: SmartDrawerProps);
```

| Returns   | Type                       | Description                                                         |
| --------- | -------------------------- | ------------------------------------------------------------------- |
| `open`    | `boolean`                  | The open state (controlled or internal).                            |
| `setOpen` | `(value: boolean) => void` | Sets the state and calls `onOpenChange`.                            |
| `close`   | `() => void`               | Closes the drawer, calls `onOpenChange(false)` and then `onClosed`. |

```tsx
import { SmartDrawerProps, useDrawer } from '@smartsoft001/react';

export function BottomSheet(props: SmartDrawerProps) {
  const { open, close } = useDrawer(props);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={props.title}
      className={props.className}
    >
      <button type="button" aria-label="Close" onClick={close}>
        ×
      </button>
      {props.children}
    </div>
  );
}
```

## Styling

- The standard drawer is unstyled markup (`data-position`, a `.drawer-overlay` backdrop); register or render `SmartDrawerPreset` for the sliding panel look with `smart:dark:` variants.
- `className` is appended to the panel.

## File Locations

Source: `packages/shared/react/src/lib/components/drawer/` in the smartsoft001 repository.

- `drawer.tsx`: `SmartDrawer`
- `drawer.types.ts`: `SmartDrawerProps`
- `preset/drawer-preset.tsx`: `SmartDrawerPreset`
- `standard/drawer-standard.tsx`: `SmartDrawerStandard`
- `use-drawer.ts`: `useDrawer`
- `drawer.stories.tsx`: Storybook stories
