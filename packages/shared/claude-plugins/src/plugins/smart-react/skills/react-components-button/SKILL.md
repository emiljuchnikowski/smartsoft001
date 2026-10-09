---
name: react-components-button
description: SmartButton React component API (@smartsoft001/react) — IButtonOptions (click, variant, color, size, confirm, loading), the 'button' registry key, SmartButtonPreset and the useButton hook for custom implementations.
user-invocable: false
---

# Button (`SmartButton`)

`SmartButton` is the button of `@smartsoft001/react`. It is configured through an `IButtonOptions` object (`click` plus the look: `variant`, `color`, `size`, `rounded`, `circular`), renders its `children` as the label, shows a spinner while `options.loading` is `true`, and with `options.confirm` turns the first click into a Cancel / Confirm pair before `click` runs. The wrapper renders whatever is registered under the `button` key of `SmartProvider` (`SmartButtonStandard` by default), so one registration restyles every button of the application.

## When to Use This Skill

- Rendering a clickable action (save, delete, submit) in a React app built with `@smartsoft001/react`
- Asking for a confirmation step before an action runs (`options.confirm`)
- Showing a loading spinner on a button while a request runs
- Restyling every button (register `SmartButtonPreset` or an own component under the `button` key)
- Writing a custom button on top of `useButton`

## Exports

All from `@smartsoft001/react`.

| Export                | Kind      | What it is                                                                                                                                                                        |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartButton`         | component | Renders the implementation registered as `components.button` on `SmartProvider`, `SmartButtonStandard` by default.                                                                |
| `SmartButtonPreset`   | component | Styled button variation (preset).                                                                                                                                                 |
| `SmartButtonStandard` | component | The default button rendering.                                                                                                                                                     |
| `useButton`           | hook      | The behaviour every button variant shares: the colour classes of the variant, and the confirm mode, where a first click asks for confirmation instead of running `options.click`. |

The preset's class helpers (`toButtonPresetVariant`, `getButtonPresetClasses`) and their types (`SmartButtonPresetVariant`: `'solid' | 'outline' | 'soft'`; `ButtonPresetShape`: `{ rounded: boolean; circular: boolean }`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartButtonProps`

| Prop         | Type             | Default  | Description                                                                                                                                                    |
| ------------ | ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`    | `IButtonOptions` | required | The button configuration; `click` is required.                                                                                                                 |
| `disabled?`  | `boolean`        | `false`  | Disables the button; the standard adds `smart:opacity-50 smart:cursor-not-allowed`, the preset `smart:disabled:opacity-50 smart:disabled:pointer-events-none`. |
| `className?` | `string`         | —        | Classes appended to the `<button>`.                                                                                                                            |
| `children?`  | `ReactNode`      | —        | The label (any `ReactNode`). Replaced by the spinner while `options.loading`.                                                                                  |

### `IButtonOptions`

| Field           | Type                      | Default     | Description                                                                                                                  |
| --------------- | ------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `type?`         | `'submit' \| 'button'`    | `'button'`  | The `type` attribute of the `<button>`. Use `'submit'` inside a `<form>` of your own.                                        |
| `confirm?`      | `boolean`                 | —           | The first click shows Cancel / Confirm buttons (translated `cancel` / `confirm`); `click` runs only after Confirm.           |
| `click`         | `() => void`              | required    | Called on click (after the confirmation when `confirm` is set).                                                              |
| `loading?`      | `boolean`                 | —           | Shows the spinner instead of the label and disables the button.                                                              |
| `variant?`      | `SmartVariant`            | `'primary'` | `primary` (solid), `secondary` (outline) or `soft`.                                                                          |
| `size?`         | `SmartSize`               | `'md'`      | Padding and text size; the standard also uses smaller rounding for `xs` / `sm`.                                              |
| `color?`        | `SmartColor`              | `'indigo'`  | One of the 22 Tailwind palette names.                                                                                        |
| `rounded?`      | `boolean`                 | —           | Pill shape. Read by `SmartButtonPreset` only.                                                                                |
| `circular?`     | `boolean`                 | —           | Square padding plus pill shape, for an icon-only button. Read by `SmartButtonPreset` only.                                   |
| `iconPosition?` | `'leading' \| 'trailing'` | —           | Not read by the built-in implementations (`SmartButtonStandard`, `SmartButtonPreset`); available to a custom implementation. |

`SmartColor`, `SmartSize`, `SmartVariant` are described in the `react-provider` skill.

## Behaviour

- There is no `onClick` prop: the handler is `options.click`.
- `options.loading` and `disabled` both disable the `<button>`; while loading, the label is replaced by `<SmartIcon name="spinner" />`.
- With `options.confirm` the button switches to a confirm mode: it renders a Cancel and a Confirm button instead of itself. Confirm runs `click` and returns to the normal mode; Cancel only returns. The labels come from the provider's translations (`cancel`, `confirm`).
- `options.type` defaults to `'button'`, so a `SmartButton` inside a `<form>` does not submit it unless you pass `type: 'submit'`.

## Usage

```tsx
import { useState } from 'react';

import { SmartButton, SmartButtonPreset } from '@smartsoft001/react';

export function SaveActions({
  onSave,
  onDelete,
}: {
  onSave: () => Promise<void>;
  onDelete: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Rendered by whatever is registered under `button` (standard by default). */}
      <SmartButton
        options={{
          click: () => void save(),
          loading: saving,
          variant: 'primary',
          size: 'lg',
        }}
      >
        Save
      </SmartButton>

      {/* The first click asks for confirmation. */}
      <SmartButton
        options={{
          click: onDelete,
          confirm: true,
          color: 'red',
          variant: 'secondary',
        }}
      >
        Delete
      </SmartButton>

      {/* The preset rendered directly, without registering it. */}
      <SmartButtonPreset
        options={{ click: () => undefined, variant: 'soft', rounded: true }}
      >
        Pill
      </SmartButtonPreset>
    </div>
  );
}
```

## Replacing the Implementation

`SmartButton` renders the component registered under the `'button'` key of `SmartProvider`'s `components`, and `SmartButtonStandard` when nothing is registered there. Every `SmartButton` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartButtonPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { button: SmartButtonPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartButtonPreset` is the styled (preset) implementation: register it under the `'button'` key of `SmartProvider`'s `components`, render it directly in place of `SmartButton`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useButton` hook

The behaviour every button variant shares: the colour classes of the variant, and the confirm mode, where a first click asks for confirmation instead of running `options.click`.

```ts
function useButton({ options, disabled = false }: SmartButtonProps);
```

| Returns          | Type                     | Description                                                                                                   |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `mode`           | `"default" \| "confirm"` | `'confirm'` after a first click on a `confirm` button, `'default'` otherwise.                                 |
| `loading`        | `boolean`                | `!!options.loading`.                                                                                          |
| `variantClasses` | `string[]`               | The colour classes of `options.variant` / `options.color` from `COMPONENT_COLORS`, plus the disabled classes. |
| `invoke`         | `() => void`             | The click handler: runs `options.click`, or enters the confirm mode when `options.confirm`.                   |
| `confirmInvoke`  | `() => void`             | Runs `options.click` and leaves the confirm mode.                                                             |
| `confirmCancel`  | `() => void`             | Leaves the confirm mode without running `click`.                                                              |

A custom button builds on `useButton`, which keeps the confirm mode and computes the colour classes of `options.variant` / `options.color`:

```tsx
import type { ReactNode } from 'react';

import {
  SmartButtonProps,
  SmartProvider,
  useButton,
  useTranslate,
} from '@smartsoft001/react';

export function BrandButton(props: SmartButtonProps) {
  const { options, disabled = false, className, children } = props;
  const t = useTranslate();
  const {
    mode,
    loading,
    variantClasses,
    invoke,
    confirmInvoke,
    confirmCancel,
  } = useButton(props);

  if (mode === 'confirm') {
    return (
      <span className="inline-flex gap-2">
        <button type="button" onClick={confirmCancel}>
          {t('cancel')}
        </button>
        <button type="button" onClick={confirmInvoke}>
          {t('confirm')}
        </button>
      </span>
    );
  }

  return (
    <button
      type={options.type ?? 'button'}
      className={[...variantClasses, 'rounded-full px-6 py-2', className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      onClick={invoke}
    >
      {loading ? '…' : children}
    </button>
  );
}

// Registered once, at the root: every SmartButton now renders BrandButton.
const components = { button: BrandButton };

export function App({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

## Styling

- Classes are Tailwind 4 utilities with the `smart:` prefix; import `@smartsoft001/react/styles.css` once in the app.
- Every colour of `COMPONENT_COLORS` (used by `useButton().variantClasses`) carries `smart:dark:` variants, and the preset classes do too, so the button follows the `dark` class on `<html>`.
- `className` is appended last, so it can add spacing or override utilities.

## File Locations

Source: `packages/shared/react/src/lib/components/button/` in the smartsoft001 repository.

- `button.tsx`: `SmartButton`
- `button.types.ts`: `SmartButtonProps`
- `preset/button-preset.tsx`: `SmartButtonPreset`
- `standard/button-standard.tsx`: `SmartButtonStandard`
- `use-button.ts`: `useButton`
- `button.stories.tsx`: Storybook stories
