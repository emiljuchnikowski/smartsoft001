---
name: react-components-loader
description: SmartLoader React component API (@smartsoft001/react) — spinner shown while show is true, with size and colour, the 'loader' registry key, SmartLoaderPreset and useLoader.
user-invocable: false
---

# Loader (`SmartLoader`)

`SmartLoader` renders a spinner while `show` is `true` and nothing otherwise. `size` and `color` use the shared `SmartSize` / `SmartColor` scales. Form inputs render it while an async validator runs, and lists while they load, so registering a loader under the `loader` key changes all of them.

## When to Use This Skill

- Showing that something is loading in place of, or next to, content
- Changing the spinner used across the library (the `loader` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                         |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| `SmartLoader`         | component | Renders the implementation registered as `components.loader` on `SmartProvider`, `SmartLoaderStandard` by default. |
| `SmartLoaderPreset`   | component | Styled loader variation (preset).                                                                                  |
| `SmartLoaderStandard` | component | The default loader rendering: an SVG spinner.                                                                      |
| `useLoader`           | hook      | The behaviour every loader variant shares: the spinner classes for `size` and `color`, with `className` appended.  |

The preset's class helpers (`getLoaderSpinnerClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartLoaderProps`

| Prop         | Type         | Default    | Description                       |
| ------------ | ------------ | ---------- | --------------------------------- |
| `show?`      | `boolean`    | `false`    | Renders the spinner while `true`. |
| `size?`      | `SmartSize`  | `'md'`     | Spinner size.                     |
| `color?`     | `SmartColor` | `'indigo'` | Spinner colour.                   |
| `className?` | `string`     | —          | Classes appended to the spinner.  |

`SmartColor`, `SmartSize` are described in the `react-provider` skill.

## Usage

```tsx
import { SmartLoader, SmartLoaderPreset } from '@smartsoft001/react';

export function Saving({ saving }: { saving: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <SmartLoader show={saving} size="sm" color="blue" />
      <SmartLoaderPreset show={saving} size="lg" />
      {saving && <span>Saving…</span>}
    </div>
  );
}
```

## Replacing the Implementation

`SmartLoader` renders the component registered under the `'loader'` key of `SmartProvider`'s `components`, and `SmartLoaderStandard` when nothing is registered there. Every `SmartLoader` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartLoaderPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { loader: SmartLoaderPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartLoaderPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartLoader`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useLoader` hook

The behaviour every loader variant shares: the spinner classes for `size` and `color`, with `className` appended.

```ts
function useLoader({
  size = 'md',
  color = 'indigo',
  className = '',
}: SmartLoaderProps);
```

| Returns          | Type       | Description                                                    |
| ---------------- | ---------- | -------------------------------------------------------------- |
| `spinnerClasses` | `string[]` | The classes for `size` and `color`, with `className` appended. |

```tsx
import { SmartLoaderProps, useLoader } from '@smartsoft001/react';

export function DotsLoader(props: SmartLoaderProps) {
  const { spinnerClasses } = useLoader(props);

  if (!props.show) return null;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={spinnerClasses.join(' ')}
    >
      …
    </span>
  );
}
```

## Styling

- `SmartLoaderStandard` is an SVG spinner; `SmartLoaderPreset` is a bordered spinning ring with explicit `smart:dark:` variants for every colour.

## File Locations

Source: `packages/shared/react/src/lib/components/loader/` in the smartsoft001 repository.

- `loader.tsx`: `SmartLoader`
- `loader.types.ts`: `SmartLoaderProps`
- `preset/loader-preset.tsx`: `SmartLoaderPreset`
- `standard/loader-standard.tsx`: `SmartLoaderStandard`
- `use-loader.ts`: `useLoader`
- `loader.stories.tsx`: Storybook stories
