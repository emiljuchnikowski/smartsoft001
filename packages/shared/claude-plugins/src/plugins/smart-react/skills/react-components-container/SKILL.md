---
name: react-components-container
description: SmartContainer React component API (@smartsoft001/react) — page-width wrapper with full-width/constrained/container modes, padding and narrow options, the 'container' registry key and SmartContainerPreset (the standard is a neutral div with data attributes).
user-invocable: false
---

# Container (`SmartContainer`)

`SmartContainer` wraps page content to control its width and horizontal padding. `options.mode` (`full-width`, `constrained`, `container`), `options.padding` (`none`, `mobile`, `always`) and `options.narrow` describe the layout. `SmartContainerStandard` (the default) is a **neutral `div`** that only exposes `data-mode` / `data-padding`; `SmartContainerPreset` maps the options to real Tailwind layout utilities.

## When to Use This Skill

- Constraining page content to a readable max width, centred, with responsive padding
- A narrow column (`options.narrow`) for forms or articles
- Restyling every container (the `container` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                   | Kind      | What it is                                                                                                                                                      |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartContainer`         | component | Renders the implementation registered as `components.container` on `SmartProvider`, `SmartContainerStandard` by default.                                        |
| `SmartContainerPreset`   | component | Styled container variation (preset).                                                                                                                            |
| `SmartContainerStandard` | component | The default container rendering: a neutral `div` exposing `options.mode` / `options.padding` as `data-mode` / `data-padding` for the application's own styling. |

The preset's class helpers (`getContainerClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartContainerProps`

| Prop         | Type                | Default | Description                          |
| ------------ | ------------------- | ------- | ------------------------------------ |
| `options?`   | `IContainerOptions` | —       | Width mode, padding and narrow flag. |
| `className?` | `string`            | —       | Classes on the container `div`.      |
| `children?`  | `ReactNode`         | —       | The content.                         |

### `IContainerOptions`

| Field      | Type                                           | Default | Description                                                                                                                      |
| ---------- | ---------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `mode?`    | `'full-width' \| 'constrained' \| 'container'` | —       | In the preset: `container` centres at `max-w-7xl`, `constrained` at `max-w-5xl`, `full-width` (also when unset) spans the width. |
| `padding?` | `'none' \| 'mobile' \| 'always'`               | —       | In the preset: `always` pads at every breakpoint (`px-4` / `sm:px-6` / `lg:px-8`), `mobile` only below `sm`, `none` not at all.  |
| `narrow?`  | `boolean`                                      | —       | In the preset: centres at `max-w-3xl`, whatever the mode.                                                                        |

## Usage

```tsx
import type { ReactNode } from 'react';

import { SmartContainer, SmartContainerPreset } from '@smartsoft001/react';

export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <SmartContainerPreset
      options={{ mode: 'constrained', padding: 'always', narrow: true }}
    >
      {children}
    </SmartContainerPreset>
  );
}

// Through the registry: a neutral div with data-mode / data-padding unless a preset is registered.
export function Section({ children }: { children: ReactNode }) {
  return (
    <SmartContainer options={{ mode: 'container', padding: 'mobile' }}>
      {children}
    </SmartContainer>
  );
}
```

## Replacing the Implementation

`SmartContainer` renders the component registered under the `'container'` key of `SmartProvider`'s `components`, and `SmartContainerStandard` when nothing is registered there. Every `SmartContainer` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartContainerPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { container: SmartContainerPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartContainerPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartContainer`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartContainerProps } from '@smartsoft001/react';

export function MaxWidthContainer({
  options,
  className,
  children,
}: SmartContainerProps) {
  // The application's own classes: the library's compiled stylesheet is not built from your sources.
  const width = options?.narrow
    ? 'max-w-3xl'
    : options?.mode === 'full-width'
      ? ''
      : 'max-w-7xl';
  const padding = options?.padding && options.padding !== 'none' ? 'px-4' : '';

  return (
    <div
      className={['mx-auto', width, padding, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
```

## Styling

- With the default `SmartContainerStandard`, style `[data-mode]` / `[data-padding]` yourself, or register `SmartContainerPreset`.
- `className` is appended to the container.

## File Locations

Source: `packages/shared/react/src/lib/components/container/` in the smartsoft001 repository.

- `container.tsx`: `SmartContainer`
- `container.types.ts`: `SmartContainerProps`
- `preset/container-preset.tsx`: `SmartContainerPreset`
- `standard/container-standard.tsx`: `SmartContainerStandard`
- `container.stories.tsx`: Storybook stories
