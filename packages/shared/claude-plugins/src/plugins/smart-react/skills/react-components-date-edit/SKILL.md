---
name: react-components-date-edit
description: SmartDateEdit React component API (@smartsoft001/react) — YYYY-MM-DD date editor (eight digit inputs DD-MM-RRRR, or the preset calendar popover via variant="preset"), value/onValueChange or a form control, onValidChange, and the useDateEdit hook (value/setValue, digits, validity).
user-invocable: false
---

# Date Edit (`SmartDateEdit`)

`SmartDateEdit` edits one date stored as a `YYYY-MM-DD` string. Its `variant` picks the rendering: `standard` (default) is eight single-digit inputs spelling DD-MM-RRRR where every digit moves the focus on, `preset` is a read-only trigger opening a calendar popover with month navigation and month / year selects. Bind it with `value` + `onValueChange` (or `defaultValue` uncontrolled), or pass a form `control`. Every edit is emitted, even an invalid date; `onValidChange` reports whether the edited date is valid.

## When to Use This Skill

- Entering a date as digits (birth date, document date) or picking it from a calendar popover
- Binding a date field to a `SmartFormControl` (`control`)
- Knowing whether the typed date is valid (`onValidChange`)
- Building a date editor of your own on `useDateEdit`

## Exports

All from `@smartsoft001/react`.

| Export                   | Kind      | What it is                                                                                                                   |
| ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `SmartDateEdit`          | component | The date editor in the `variant` rendering (`standard`, eight digit inputs, by default; or `preset`, a calendar popover).    |
| `SmartDateEditPreset`    | component | Styled date-edit variation (preset) — a Preline single datepicker.                                                           |
| `SmartDateEditStandard`  | component | The default date-edit rendering: eight single-digit inputs spelling DD-MM-RRRR.                                              |
| `useDateEdit`            | hook      | The behaviour every date-edit variant shares: the `YYYY-MM-DD` value, its single digits and the validity of the edited date. |
| `DATE_EDIT_DEFAULT_DATE` | const     | `'2001-01-01'`, the value an uncontrolled editor without `defaultValue` starts from.                                         |

The preset's class helpers (`getDateEditDayClasses`, `DATE_EDIT_TRIGGER_WRAPPER`, `DATE_EDIT_TRIGGER_INPUT`, `DATE_EDIT_TRIGGER_INVALID`, `DATE_EDIT_TRIGGER_ICON`, `DATE_EDIT_POPOVER`, `DATE_EDIT_NAV_BUTTON`, `DATE_EDIT_SELECT`, `DATE_EDIT_WEEKDAY`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDateEditProps`

Props of `<SmartDateEdit>`. Extends `SmartDateEditVariantProps`.

| Prop       | Type                   | Default      | Description                                                                                                              |
| ---------- | ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `variant?` | `DateEditVariantName`  | `'standard'` | `standard` (digit inputs) or `preset` (calendar popover).                                                                |
| `control?` | `SmartAbstractControl` | —            | Binds the date to a form control: the control's value is shown, an edit sets it and marks the control dirty and touched. |

### `SmartDateEditVariantProps`

Props of the date-edit variants: the date as a controlled `value` + `onValueChange` pair, or kept internally from `defaultValue`.

| Prop             | Type                       | Default                                   | Description                                                                                                                                 |
| ---------------- | -------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `value?`         | `string \| null`           | —                                         | The date as `YYYY-MM-DD`. `undefined` leaves the component uncontrolled, starting from `defaultValue`; `null` is an empty controlled value. |
| `defaultValue?`  | `string \| null`           | `'2001-01-01'` (`DATE_EDIT_DEFAULT_DATE`) | The initial value when uncontrolled (`useDateEdit` falls back to `DATE_EDIT_DEFAULT_DATE`, `'2001-01-01'`).                                 |
| `onValueChange?` | `(value: string) => void`  | —                                         | Emits the edited date, even an invalid one.                                                                                                 |
| `onValidChange?` | `(valid: boolean) => void` | —                                         | Emits whether the edited date is valid.                                                                                                     |
| `className?`     | `string`                   | —                                         | Classes on the root element.                                                                                                                |

### `DateEditDay`

A cell of the preset's calendar grid.

| Field      | Type      | Default  | Description                         |
| ---------- | --------- | -------- | ----------------------------------- |
| `date`     | `string`  | required | The day as `YYYY-MM-DD`.            |
| `day`      | `number`  | required | Day of the month.                   |
| `inMonth`  | `boolean` | required | The day belongs to the shown month. |
| `selected` | `boolean` | required | The day is the current value.       |

### Related types

- `DateEditVariantName`: `'standard' \| 'preset'` — The renderings `SmartDateEdit` can pick.

`SmartAbstractControl` is described in the `react-forms` and `react-provider` skills.

## Binding

- **Controlled**: `value` (a `YYYY-MM-DD` string, `null` for empty) and `onValueChange`. A new `value` from the parent always wins, so resetting the parent's state also resets the editor.
- **Uncontrolled**: leave `value` undefined; the editor starts from `defaultValue`.
- **Form control**: `control={someControl}` shows the control's value; every edit sets it, marks the control dirty and touched, and still calls `onValueChange`.
- `onValueChange` receives the edited text even when it is not a valid date; use `onValidChange` to know.

## Usage

```tsx
import { useState } from 'react';

import {
  SmartDateEdit,
  SmartFormControl,
  SmartValidators,
} from '@smartsoft001/react';

const birthDate = new SmartFormControl<string | null>(
  null,
  SmartValidators.required,
);

export function DateFields() {
  const [date, setDate] = useState('2026-04-07');
  const [valid, setValid] = useState(true);

  return (
    <>
      {/* Eight digit inputs, controlled. */}
      <SmartDateEdit
        value={date}
        onValueChange={setDate}
        onValidChange={setValid}
      />
      {!valid && <p>Not a valid date.</p>}

      {/* Calendar popover. */}
      <SmartDateEdit variant="preset" value={date} onValueChange={setDate} />

      {/* Bound to a form control. */}
      <SmartDateEdit control={birthDate} />
    </>
  );
}
```

## Replacing the Implementation

`SmartDateEdit` has no `SmartProvider` registry key: the `variant` prop picks `SmartDateEditStandard` or `SmartDateEditPreset`, and both can be rendered directly with `SmartDateEditVariantProps`. A form's `date` / `dateWithEdit` fields render it through the input field components (see `react-components-input`). For another look, write a component on `useDateEdit` and render it in place of `SmartDateEdit`.

### The `useDateEdit` hook

The behaviour every date-edit variant shares: the `YYYY-MM-DD` value, its single digits and the validity of the edited date.

```ts
function useDateEdit({
  value,
  defaultValue = DATE_EDIT_DEFAULT_DATE,
  onValueChange,
  onValidChange,
}: SmartDateEditVariantProps);
```

| Returns        | Type                                                                             | Description                                                                         |
| -------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `value`        | `string \| null`                                                                 | The current `YYYY-MM-DD` value (controlled or internal), `null` when empty.         |
| `setValue`     | `(next: string) => void`                                                         | Sets the value and calls `onValueChange` (no call when unchanged).                  |
| `validDate`    | `boolean`                                                                        | Whether the current value is a valid date.                                          |
| `setValidDate` | `Dispatch<SetStateAction<boolean>>`                                              | Sets the validity flag (also reported through `onValidChange`).                     |
| `setValueAt`   | `(val: string \| number \| null, index: number) => void`                         | Writes one digit at a position of the DD-MM-RRRR mask.                              |
| `moveTo`       | `(event: KeyboardEvent<HTMLInputElement>, el: HTMLInputElement \| null) => void` | Keyup handler of a digit input: a digit moves the focus to the next input.          |
| `select`       | `(el: HTMLInputElement \| null) => void`                                         | Trims an input to one character and selects it, so the next key replaces the digit. |
| `d1`           | `string \| null`                                                                 | First day digit.                                                                    |
| `d2`           | `string \| null`                                                                 | Second day digit.                                                                   |
| `m1`           | `string \| null`                                                                 | First month digit.                                                                  |
| `m2`           | `string \| null`                                                                 | Second month digit.                                                                 |
| `y1`           | `string \| null`                                                                 | First year digit.                                                                   |
| `y2`           | `string \| null`                                                                 | Second year digit.                                                                  |
| `y3`           | `string \| null`                                                                 | Third year digit.                                                                   |
| `y4`           | `string \| null`                                                                 | Fourth year digit.                                                                  |

```tsx
import { SmartDateEditVariantProps, useDateEdit } from '@smartsoft001/react';

export function NativeDateEdit(props: SmartDateEditVariantProps) {
  const { value, setValue, validDate } = useDateEdit(props);

  return (
    <input
      type="date"
      className={props.className}
      aria-invalid={!validDate}
      value={value ?? ''}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
```

## Styling

- The standard digit inputs and the preset trigger / popover carry `smart:dark:` variants; the preset trigger shows an invalid state when the date is not valid.
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/date-edit/` in the smartsoft001 repository.

- `date-edit.tsx`: `SmartDateEdit`
- `date-edit.types.ts`: `DateEditVariantName`, `SmartDateEditVariantProps`, `SmartDateEditProps`
- `preset/date-edit-preset.tsx`: `SmartDateEditPreset`, `DateEditDay`
- `standard/date-edit-standard.tsx`: `SmartDateEditStandard`
- `use-date-edit.ts`: `useDateEdit`, `DATE_EDIT_DEFAULT_DATE`
- `date-edit.stories.tsx`: Storybook stories
