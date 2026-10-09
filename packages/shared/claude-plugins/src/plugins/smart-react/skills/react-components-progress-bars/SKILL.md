---
name: react-components-progress-bars
description: SmartProgressBars React component API (@smartsoft001/react) — step indicators (simple, panels, bullets, circles, with text) or a percentage progress bar with columns, step status complete/current/upcoming, router links and onStepClick, the 'progress-bars' registry key and SmartProgressBarsPreset.
user-invocable: false
---

# Progress Bars (`SmartProgressBars`)

`SmartProgressBars` shows progress in two ways. With a step layout it renders `steps` (each `complete`, `current` or `upcoming`) as a `<nav>` list; steps with an internal `href` render through the navigation adapter's `linkComponent` when one is set, steps without `href` are buttons reported through `onStepClick({ stepId })`. With `layout: 'progress-bar'` it renders a track filled to `value` percent, with an optional title and column captions.

## When to Use This Skill

- A multi-step form or checkout ("Account → Profile → Confirm")
- A percentage progress bar with labelled stages (`progress-bar` layout + `columns`)
- Restyling every progress indicator (the `progress-bars` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                      | Kind      | What it is                                                                                                                         |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `SmartProgressBars`         | component | Renders the implementation registered as `components['progress-bars']` on `SmartProvider`, `SmartProgressBarsStandard` by default. |
| `SmartProgressBarsPreset`   | component | Styled progress bars variation (preset).                                                                                           |
| `SmartProgressBarsStandard` | component | The default progress bars rendering: the steps as a `<nav>` list, or a progress bar for the `progress-bar` layout.                 |

The preset's class helpers (`getProgressBarsColumnClasses`, `isProgressBarsVertical`, `isProgressBarsBullet`, `isProgressBarsCircle`, `isProgressBarsPanel`, `isProgressBarsSimple`, `getProgressBarsListClasses`, `getProgressBarsStepClasses`, `getProgressBarsMarkerClasses`, `getProgressBarsNameClasses`, `getProgressBarsConnectorClasses`, `PROGRESS_BARS_WRAPPER`, `PROGRESS_BARS_HEADER`, `PROGRESS_BARS_TITLE`, `PROGRESS_BARS_VALUE_LABEL`, `PROGRESS_BARS_TRACK`, `PROGRESS_BARS_FILL`, `PROGRESS_BARS_COLUMNS`, `PROGRESS_BARS_NAV`, `PROGRESS_BARS_STEPPER_TITLE`, `PROGRESS_BARS_DESCRIPTION`, `PROGRESS_BARS_INDEX`, `PROGRESS_BARS_STEP_BUTTON`, `PROGRESS_BARS_STEP_LINK`, `PROGRESS_BARS_CHECK_ICON`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartProgressBarsProps`

| Prop           | Type                                  | Default | Description                          |
| -------------- | ------------------------------------- | ------- | ------------------------------------ |
| `options?`     | `IProgressBarsOptions`                | —       | Layout, steps or the progress value. |
| `className?`   | `string`                              | —       | Classes on the root element.         |
| `onStepClick?` | `(event: IProgressStepClick) => void` | —       | A click on a step without `href`.    |

### `IProgressBarsOptions`

| Field          | Type                      | Default      | Description                                                                                           |
| -------------- | ------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| `layout?`      | `SmartProgressBarsLayout` | `'simple'`   | A step layout, or `progress-bar` for the percentage bar.                                              |
| `ariaLabel?`   | `string`                  | `'Progress'` | Accessible name of the step `<nav>`; the preset also puts it on the bar's `role="progressbar"` track. |
| `steps?`       | `IProgressStep[]`         | `[]`         | The steps of a step layout.                                                                           |
| `title?`       | `string`                  | —            | Title above the steps or the bar (the preset bar also shows the `value%` next to it).                 |
| `srOnlyTitle?` | `string`                  | —            | Bar mode: a heading for screen readers only.                                                          |
| `value?`       | `number`                  | `0`          | Bar mode: the percentage, clamped to 0–100.                                                           |
| `columns?`     | `IProgressBarColumn[]`    | `[]`         | Bar mode: captions under the bar.                                                                     |

### `IProgressStepClick`

| Field    | Type     | Default  | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `stepId` | `string` | required | The `id` of the clicked step. |

### `IProgressStep`

| Field          | Type                      | Default      | Description                                                                                                       |
| -------------- | ------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `id`           | `string`                  | required     | Reported as `stepId`.                                                                                             |
| `name?`        | `string`                  | —            | Step name.                                                                                                        |
| `description?` | `string`                  | —            | Text under the name, in every step layout.                                                                        |
| `status?`      | `SmartProgressStepStatus` | `'upcoming'` | `complete`, `current` (adds `aria-current="step"`) or `upcoming`.                                                 |
| `href?`        | `string`                  | —            | Renders the step as a link (through the navigation adapter for internal paths); no `onStepClick`.                 |
| `iconTpl?`     | `ReactNode`               | —            | Icon of the step; the preset shows it in the marker, so not in the `simple` layout.                               |
| `index?`       | `string`                  | —            | Number of the step (e.g. `'01'`): the standard shows it when there is no `iconTpl`, the preset in circle markers. |

### `IProgressBarColumn`

| Field     | Type      | Default  | Description             |
| --------- | --------- | -------- | ----------------------- |
| `label`   | `string`  | required | Caption text.           |
| `active?` | `boolean` | —        | Highlights the caption. |

### Related types

- `SmartProgressBarsLayout`: `'simple' \| 'panels' \| 'bullets' \| 'panels-with-border' \| 'circles' \| 'bullets-and-text' \| 'circles-with-text' \| 'progress-bar'`
- `SmartProgressStepStatus`: `'complete' \| 'current' \| 'upcoming'`

## Usage

```tsx
import {
  SmartProgressBars,
  SmartProgressBarsPreset,
} from '@smartsoft001/react';

export function CheckoutProgress({ onStep }: { onStep: (id: string) => void }) {
  return (
    <>
      <SmartProgressBarsPreset
        options={{
          layout: 'circles-with-text',
          steps: [
            {
              id: 'cart',
              name: 'Cart',
              description: 'Review items',
              status: 'complete',
            },
            {
              id: 'shipping',
              name: 'Shipping',
              description: 'Address and method',
              status: 'current',
            },
            {
              id: 'payment',
              name: 'Payment',
              description: 'Card or transfer',
              status: 'upcoming',
            },
          ],
        }}
        onStepClick={({ stepId }) => onStep(stepId)}
      />

      <SmartProgressBars
        options={{
          layout: 'progress-bar',
          title: 'Migrating MySQL database…',
          value: 37,
          columns: [
            { label: 'Copying files', active: true },
            { label: 'Migrating database', active: true },
            { label: 'Compiling assets' },
          ],
        }}
      />
    </>
  );
}
```

## Replacing the Implementation

`SmartProgressBars` renders the component registered under the `'progress-bars'` key of `SmartProvider`'s `components`, and `SmartProgressBarsStandard` when nothing is registered there. Every `SmartProgressBars` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartProgressBarsPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'progress-bars': SmartProgressBarsPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartProgressBarsPreset` is the styled (preset) implementation: register it under the `'progress-bars'` key of `SmartProvider`'s `components`, render it directly in place of `SmartProgressBars`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

```tsx
import { SmartProgressBarsProps } from '@smartsoft001/react';

export function DotsProgress({
  options,
  className,
  onStepClick,
}: SmartProgressBarsProps) {
  return (
    <ol aria-label={options?.ariaLabel ?? 'Progress'} className={className}>
      {(options?.steps ?? []).map((step) => (
        <li
          key={step.id}
          aria-current={step.status === 'current' ? 'step' : undefined}
        >
          <button
            type="button"
            onClick={() => onStepClick?.({ stepId: step.id })}
          >
            {step.status === 'complete' ? '●' : '○'} {step.name}
          </button>
        </li>
      ))}
    </ol>
  );
}
```

## Styling

- The standard rendering is unstyled; `SmartProgressBarsPreset` renders every layout (connectors between horizontal circles and bullets, the track and fill of the bar) with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/progress-bars/` in the smartsoft001 repository.

- `preset/progress-bars-preset.tsx`: `SmartProgressBarsPreset`
- `progress-bars.tsx`: `SmartProgressBars`
- `progress-bars.types.ts`: `IProgressStepClick`, `SmartProgressBarsProps`
- `standard/progress-bars-standard.tsx`: `SmartProgressBarsStandard`
- `progress-bars.stories.tsx`: Storybook stories
