---
name: react-components-accordion
description: SmartAccordion React component API (@smartsoft001/react) — collapsible section with accordionHeader/accordionBody slots, controlled show/onShowChange or uncontrolled defaultShow, SmartAccordionPreset and the useAccordion hook for custom implementations.
user-invocable: false
---

# Accordion (`SmartAccordion`)

`SmartAccordion` is a collapsible section: a header button that toggles a body. The header and body are `ReactNode` slots (`accordionHeader`, `accordionBody`). The open state is either controlled (`show` + `onShowChange`) or kept inside the component (`defaultShow`, or `options.open` applied once on the first render). The accordion has **no registry key**: `SmartAccordion` always renders `SmartAccordionDefault`; for the styled look render `SmartAccordionPreset` directly.

## When to Use This Skill

- Showing or hiding a block of content behind a clickable header (FAQ entries, advanced settings)
- Controlling the open state from the parent (`show` + `onShowChange`) or leaving it to the component
- Choosing between the default bordered card and the styled `SmartAccordionPreset`
- Building a collapsible section of your own on `useAccordion`

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartAccordion`        | component | `SmartAccordionDefault` fed with the `accordionHeader` / `accordionBody` slots.                                                                                                           |
| `SmartAccordionBody`    | component | The padded content of an open accordion.                                                                                                                                                  |
| `SmartAccordionDefault` | component | The default accordion rendering: a bordered card whose header toggles the body.                                                                                                           |
| `SmartAccordionHeader`  | component | The header button of `SmartAccordionDefault`, with a chevron pointing up while `open`.                                                                                                    |
| `SmartAccordionPreset`  | component | Styled accordion variation (preset), based on the Preline bordered accordion.                                                                                                             |
| `useAccordion`          | hook      | The behaviour every accordion variant shares: the open state, controlled through `show` + `onShowChange` or kept internally, and `toggle()`, which does nothing while `options.disabled`. |

The preset's class helpers (`getAccordionPresetContainerClasses`, `getAccordionPresetToggleClasses`, `getAccordionPresetContentClasses`, `getAccordionPresetIconClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartAccordionProps`

Props of `SmartAccordion`. Extends `SmartAccordionStateProps`.

| Prop               | Type        | Default | Description                        |
| ------------------ | ----------- | ------- | ---------------------------------- |
| `className?`       | `string`    | —       | Classes appended to the container. |
| `accordionHeader?` | `ReactNode` | —       | Content of the header button.      |
| `accordionBody?`   | `ReactNode` | —       | Content shown while open.          |

### `SmartAccordionStateProps`

The open state every accordion shares: `show` and `options`. Pass `show` + `onShowChange` to control it; leave `show` undefined to let the accordion keep its own state, starting from `defaultShow` (or `options.open`).

| Prop            | Type                      | Default | Description                                                                      |
| --------------- | ------------------------- | ------- | -------------------------------------------------------------------------------- |
| `show?`         | `boolean`                 | —       | Controlled open state; `undefined` keeps the state internal.                     |
| `defaultShow?`  | `boolean`                 | `false` | Initial open state when uncontrolled.                                            |
| `onShowChange?` | `(show: boolean) => void` | —       | Every change of `show`: toggles and the initial `options.open`.                  |
| `options?`      | `IAccordionOptions`       | —       | `open` (initial state, applied once) and `disabled` (the header ignores clicks). |

### `SmartAccordionBaseProps`

Props of the accordion variations (`SmartAccordionDefault`, `SmartAccordionPreset`): the slots are `headerTpl` / `bodyTpl` instead of `accordionHeader` / `accordionBody`. Extends `SmartAccordionStateProps`.

| Prop         | Type        | Default  | Description                        |
| ------------ | ----------- | -------- | ---------------------------------- |
| `className?` | `string`    | —        | Classes appended to the container. |
| `headerTpl`  | `ReactNode` | required | Content of the header button.      |
| `bodyTpl`    | `ReactNode` | required | Content shown while open.          |

### `SmartAccordionHeaderProps`

Props of `SmartAccordionHeader`, the header button of the default variation.

| Prop         | Type        | Default | Description                     |
| ------------ | ----------- | ------- | ------------------------------- |
| `open?`      | `boolean`   | `false` | Chevron up while `true`.        |
| `disabled?`  | `boolean`   | `false` | Renders the button disabled.    |
| `className?` | `string`    | —       | Classes appended to the button. |
| `children?`  | `ReactNode` | —       | Content of the button.          |

### `SmartAccordionBodyProps`

Props of `SmartAccordionBody`, the padded body of the default variation.

| Prop         | Type        | Default | Description                   |
| ------------ | ----------- | ------- | ----------------------------- |
| `className?` | `string`    | —       | Classes appended to the body. |
| `children?`  | `ReactNode` | —       | Content of the body.          |

### `IAccordionOptions`

| Field       | Type      | Default | Description                                                                                                                                                                                                                                                                                                                                                                            |
| ----------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open?`     | `boolean` | —       | Initial open state, applied once on the first render by every variant: an uncontrolled accordion starts open, and `onShowChange(true)` is reported unless `show` / `defaultShow` was already `true`. Later changes to this flag are ignored; toggles and the `show` prop take over. A controlled accordion stays as its `show` prop says until the parent applies the reported change. |
| `disabled?` | `boolean` | `false` | Prevents `toggle()` from changing `show` (the header ignores clicks).                                                                                                                                                                                                                                                                                                                  |
| `animated?` | `boolean` | —       | @deprecated No accordion variant (default or preset) animates anything; this flag has no effect.                                                                                                                                                                                                                                                                                       |

## Controlled and uncontrolled

- **Uncontrolled**: leave `show` undefined. The accordion keeps its own state, starting from `defaultShow` (default `false`) or `options.open`. `onShowChange` still reports every toggle.
- **Controlled**: pass `show` and update it from `onShowChange`. A toggle only calls `onShowChange(next)`; the accordion stays as `show` says until the parent changes it.
- `options.open` is read once, on the first render. When it is `true` and the initial state is closed, the accordion reports `onShowChange(true)` once. Later changes of `options.open` are ignored.
- `options.disabled` makes the header ignore clicks (the header is rendered disabled).

## Usage

```tsx
import { useState } from 'react';

import { SmartAccordion, SmartAccordionPreset } from '@smartsoft001/react';

export function Faq() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Uncontrolled, starts closed. */}
      <SmartAccordion
        accordionHeader="What is the return policy?"
        accordionBody={<p>You can return any item within 30 days.</p>}
      />

      {/* Controlled by the parent. */}
      <SmartAccordion
        show={open}
        onShowChange={setOpen}
        accordionHeader="Shipping"
        accordionBody={<p>We ship worldwide.</p>}
      />

      {/* The styled variation, rendered directly (slots are headerTpl / bodyTpl). */}
      <SmartAccordionPreset
        headerTpl="What is the best thing about Switzerland?"
        bodyTpl="I don't know, but the flag is a big plus."
        defaultShow
      />
    </div>
  );
}
```

## Replacing the Implementation

The accordion has no `SmartProvider` registry key, so it cannot be swapped application-wide. Pick the variation where you render it:

- `SmartAccordion` (slots `accordionHeader` / `accordionBody`) renders `SmartAccordionDefault`, a bordered card with `SmartAccordionHeader` and `SmartAccordionBody`.
- `SmartAccordionPreset` (slots `headerTpl` / `bodyTpl`) is the styled variation, based on the Preline bordered accordion: the toggle button carries `aria-expanded` / `aria-controls` and the open body is a `region`.
- For a look of your own, write a component on `useAccordion` and render it in place of `SmartAccordion`.

### The `useAccordion` hook

The behaviour every accordion variant shares: the open state, controlled through `show` + `onShowChange` or kept internally, and `toggle()`, which does nothing while `options.disabled`. `options.open` is applied once, on the first render: an uncontrolled accordion starts open, and `onShowChange(true)` is reported unless `show` / `defaultShow` was already `true`. A controlled accordion stays as its `show` prop says until the parent applies that change. Later changes of `options.open` are ignored.

```ts
function useAccordion({
  show: showProp,
  defaultShow = false,
  onShowChange,
  options,
}: SmartAccordionStateProps);
```

| Returns                  | Type         | Description                                                                                   |
| ------------------------ | ------------ | --------------------------------------------------------------------------------------------- |
| `show`                   | `boolean`    | The current open state (the `show` prop when controlled).                                     |
| `toggle`                 | `() => void` | Flips the state and reports it through `onShowChange`; does nothing while `options.disabled`. |
| `sharedContainerClasses` | `string[]`   | The border and divider classes (with `smart:dark:` variants) of the default container.        |

```tsx
import { SmartAccordionBaseProps, useAccordion } from '@smartsoft001/react';

export function PlainAccordion(props: SmartAccordionBaseProps) {
  const { show, toggle } = useAccordion(props);

  return (
    <section className={props.className}>
      <button
        type="button"
        aria-expanded={show}
        onClick={toggle}
        disabled={props.options?.disabled}
      >
        {props.headerTpl}
      </button>
      {show && <div>{props.bodyTpl}</div>}
    </section>
  );
}
```

## Styling

- Tailwind 4 classes with the `smart:` prefix; the default container uses `useAccordion().sharedContainerClasses` and the preset its own `getAccordionPreset*Classes`, both with `smart:dark:` variants.
- `className` is appended to the container in both variations.
- `options.animated` is deprecated and has no effect.

## File Locations

Source: `packages/shared/react/src/lib/components/accordion/` in the smartsoft001 repository.

- `accordion.tsx`: `SmartAccordion`
- `accordion.types.ts`: `SmartAccordionStateProps`, `SmartAccordionBaseProps`, `SmartAccordionProps`, `SmartAccordionHeaderProps`, `SmartAccordionBodyProps`
- `body/accordion-body.tsx`: `SmartAccordionBody`
- `default/accordion-default.tsx`: `SmartAccordionDefault`
- `header/accordion-header.tsx`: `SmartAccordionHeader`
- `preset/accordion-preset.tsx`: `SmartAccordionPreset`
- `use-accordion.ts`: `useAccordion`
- `accordion.stories.tsx`: Storybook stories
