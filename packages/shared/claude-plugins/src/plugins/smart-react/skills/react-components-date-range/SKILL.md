---
name: react-components-date-range
description: SmartDateRange React component API (@smartsoft001/react) — date-range picker for IDateRange ({ start, end } as YYYY-MM-DD) with a scrollable calendar modal (standard) or a popover calendar (variant="preset"), value/onValueChange or a form control, quick-pick buttons, and the useDateRange / useDateRangeModal hooks.
user-invocable: false
---

# Date Range (`SmartDateRange`)

`SmartDateRange` picks a date range, an `IDateRange` from `@smartsoft001/domain-core` (`{ start, end }`, both `YYYY-MM-DD`). Its `variant` picks the rendering: `standard` (default) is a trigger with a clear button that opens `SmartDateRangeModalStandard`, a scrollable calendar of the months around today; `preset` is a trigger opening a popover calendar where the user picks a start and an end day and applies. Bind it with `value` + `onValueChange` (or `defaultValue`), or pass a form `control`. Clearing emits `undefined`.

## When to Use This Skill

- Filtering by a period (from / to) or entering a stay, a contract term, a report range
- Binding a range to a `SmartFormControl`
- Using the modal's quick picks (today, last 7 days, this month...) or restricting the range length, by rendering `SmartDateRangeModalStandard` yourself (`SmartDateRange` does not show them)
- Building a range picker of your own on `useDateRange` / `useDateRangeModal`

## Exports

All from `@smartsoft001/react`.

| Export                        | Kind      | What it is                                                                                                                                                 |
| ----------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartDateRange`              | component | The date-range picker in the `variant` rendering (`standard`, a trigger opening a scrollable calendar modal, by default; or `preset`, a calendar popover). |
| `SmartDateRangePreset`        | component | Styled date-range variation (preset) based on the Preline "single calendar range" datepicker.                                                              |
| `SmartDateRangeModalStandard` | component | The date-range picker modal: a scrollable calendar of the months around today.                                                                             |
| `SmartDateRangeStandard`      | component | The default date-range rendering: a trigger showing the range and a clear button; the trigger opens `<SmartDateRangeModalStandard>`, rendered inline.      |
| `useDateRangeModal`           | hook      | The behaviour of the date-range modal: the scrollable calendar of the `CalendarService`, the picked range and the quick-pick buttons.                      |
| `useDateRange`                | hook      | The behaviour every date-range variant shares: the range value, the open state of the picker and the calendar state the picker is reopened with.           |

The preset's class helpers (`DATE_RANGE_PRESET_TRIGGER`, `DATE_RANGE_PRESET_CLEAR`, `DATE_RANGE_PRESET_POPOVER`, `DATE_RANGE_PRESET_NAV_BUTTON`, `DATE_RANGE_PRESET_SELECT`, `DATE_RANGE_PRESET_WEEKDAY`, `DATE_RANGE_PRESET_DAY_DEFAULT`, `DATE_RANGE_PRESET_DAY_MUTED`, `DATE_RANGE_PRESET_DAY_SELECTED`, `DATE_RANGE_PRESET_RANGE_BG`, `DATE_RANGE_PRESET_FOOTER`, `DATE_RANGE_PRESET_CANCEL_BUTTON`, `DATE_RANGE_PRESET_APPLY_BUTTON`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartDateRangeProps`

Props of `<SmartDateRange>`. Extends `SmartDateRangeVariantProps`.

| Prop       | Type                   | Default      | Description                                                                                                                |
| ---------- | ---------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `variant?` | `DateRangeVariantName` | `'standard'` | `standard` (trigger + modal) or `preset` (popover calendar).                                                               |
| `control?` | `SmartAbstractControl` | —            | Binds the range to a form control: the control's value is shown, a change sets it and marks the control dirty and touched. |

### `SmartDateRangeVariantProps`

Props of the date-range variants: the range as a controlled `value` + `onValueChange` pair, or kept internally from `defaultValue`.

| Prop             | Type                                       | Default | Description                                                                                                                  |
| ---------------- | ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `value?`         | `IDateRange \| null`                       | —       | The range. `undefined` leaves the component uncontrolled, starting from `defaultValue`; `null` is an empty controlled value. |
| `defaultValue?`  | `IDateRange \| null`                       | —       | The initial range when uncontrolled.                                                                                         |
| `onValueChange?` | `(value: IDateRange \| undefined) => void` | —       | Emits the applied range, or `undefined` once cleared.                                                                        |
| `className?`     | `string`                                   | —       | Classes on the root element.                                                                                                 |

### `SmartDateRangeModalProps`

Props of the date-range modal (`SmartDateRangeModalStandard`). `SmartDateRange` renders the modal with none of them but `previousState`, `onApply` and `onDismiss`, so `showFilterBtns` and `restrictSelectionTo` only take effect when you render the modal yourself, e.g. `<SmartDateRangeModalStandard showFilterBtns ... />` in a picker built on `useDateRange`.

| Prop                   | Type                             | Default | Description                                                                  |
| ---------------------- | -------------------------------- | ------- | ---------------------------------------------------------------------------- |
| `showFilterBtns?`      | `boolean`                        | `false` | Shows the quick-pick buttons (today, last 7 days, ...). Modal only.          |
| `restrictSelectionTo?` | `number`                         | `0`     | When set, only a range of exactly this many days can be applied. Modal only. |
| `previousState?`       | `CalendarState`                  | —       | The state the modal opens with; without `dateFrom` it selects today.         |
| `onApply?`             | `(state: CalendarState) => void` | —       | Called with the picked state when the user applies.                          |
| `onDismiss?`           | `() => void`                     | —       | Called when the modal is closed without applying (backdrop or close button). |

### `CalendarState`

What the date-range modal applies, and is reopened with.

| Field                | Type                    | Default  | Description                                                     |
| -------------------- | ----------------------- | -------- | --------------------------------------------------------------- |
| `dateFrom`           | `moment.Moment \| null` | required | Start of the picked range.                                      |
| `dateTo`             | `moment.Moment \| null` | required | End of the picked range.                                        |
| `scrollPosition`     | `number`                | required | Scroll position of the modal's calendar, restored on reopening. |
| `selectedButtonName` | `FilterBtnConstants`    | required | The quick-pick button that produced the range.                  |

### `DateRangeModalForm`

The modal's form: the shown dates and the picked days.

| Field          | Type                    | Default  | Description           |
| -------------- | ----------------------- | -------- | --------------------- |
| `dateFrom`     | `string \| null`        | required | The shown start date. |
| `dateTo`       | `string \| null`        | required | The shown end date.   |
| `startDateRef` | `moment.Moment \| null` | required | The picked start day. |
| `endDateRef`   | `moment.Moment \| null` | required | The picked end day.   |

### Related types

- `DateRangeVariantName`: `'standard' \| 'preset'` — The renderings `SmartDateRange` can pick.
- `FilterBtnConstants` (enum): `empthyString = '', today = 'Today', yesterday = 'Yesterday', lastSevenDays = 'LastSevenDays', lastThirtyDays = 'LastThirtyDays', thisMonth = 'ThisMonth', lastMonth = 'LastMonth'` — The quick-pick buttons of the modal (the `empthyString` member is spelled that way in the code).

`SmartAbstractControl` is described in the `react-forms` and `react-provider` skills.

## Binding

- **Controlled**: `value` (`IDateRange`, `null` for empty) and `onValueChange(range | undefined)`.
- **Uncontrolled**: leave `value` undefined; the picker starts from `defaultValue`.
- **Form control**: `control={someControl}` shows the control's value; a change sets it, marks the control dirty and touched, and still calls `onValueChange`.

## Usage

```tsx
import { useState } from 'react';

import { IDateRange } from '@smartsoft001/domain-core';
import { SmartDateRange, SmartFormControl } from '@smartsoft001/react';

const period = new SmartFormControl<IDateRange | null>(null);

export function ReportPeriod() {
  const [range, setRange] = useState<IDateRange | null>({
    start: '2026-10-01',
    end: '2026-10-31',
  });

  return (
    <>
      {/* Trigger + scrollable calendar modal, controlled. */}
      <SmartDateRange
        value={range}
        onValueChange={(next) => setRange(next ?? null)}
      />

      {/* Popover calendar. */}
      <SmartDateRange
        variant="preset"
        value={range}
        onValueChange={(next) => setRange(next ?? null)}
      />

      {/* Bound to a form control. */}
      <SmartDateRange control={period} />
    </>
  );
}
```

## Replacing the Implementation

`SmartDateRange` has no `SmartProvider` registry key: the `variant` prop picks `SmartDateRangeStandard` or `SmartDateRangePreset`, and both can be rendered directly with `SmartDateRangeVariantProps`. A form's `dateRange` fields render it through the input field components (see `react-components-input`). For another look, write a component on `useDateRange` (and `useDateRangeModal` for the modal's calendar) and render it in place of `SmartDateRange`.

### Hooks

#### `useDateRangeModal`

The behaviour of the date-range modal: the scrollable calendar of the `CalendarService`, the picked range and the quick-pick buttons.

```ts
function useDateRangeModal({
  restrictSelectionTo = 0,
  previousState = EMPTY_STATE,
  onApply,
  onDismiss,
}: SmartDateRangeModalProps);
```

| Returns                        | Type                                      | Description                                                                                   |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `elementRef`                   | `RefObject<HTMLDivElement \| null>`       | Attach to the scrollable calendar element.                                                    |
| `calendar`                     | `month[]`                                 | The months of the `CalendarService` shown in the modal.                                       |
| `dateForm`                     | `DateRangeModalForm`                      | The shown dates and the picked days.                                                          |
| `selectedButtonName`           | `FilterBtnConstants`                      | The active quick pick.                                                                        |
| `onDayClick`                   | `(date: moment.Moment \| null) => void`   | Picks a start, then an end day.                                                               |
| `isInRange`                    | `(day: moment.Moment \| null) => boolean` | Whether a day lies inside the picked range.                                                   |
| `isSelectionStart`             | `(day: moment.Moment \| null) => boolean` | Whether a day is the range start.                                                             |
| `isSelectionEnd`               | `(day: moment.Moment \| null) => boolean` | Whether a day is the range end.                                                               |
| `isStartAndEndDateSame`        | `() => boolean`                           | Whether start and end are the same day.                                                       |
| `isSelectionInRestrictedRange` | `() => boolean`                           | Whether the range has exactly `restrictSelectionTo` days (always true without a restriction). |
| `selectToday`                  | `() => void`                              | Quick pick: today.                                                                            |
| `selectYesterday`              | `() => void`                              | Quick pick: yesterday.                                                                        |
| `selectLastSevenDays`          | `() => void`                              | Quick pick: the last 7 days.                                                                  |
| `selectLastThirtyDays`         | `() => void`                              | Quick pick: the last 30 days.                                                                 |
| `selectThisMonth`              | `() => void`                              | Quick pick: this month.                                                                       |
| `selectLastMonth`              | `() => void`                              | Quick pick: last month.                                                                       |
| `dismissPage`                  | `() => void \| undefined`                 | Calls `onDismiss`.                                                                            |
| `applyDates`                   | `() => void`                              | Calls `onApply` with the picked state.                                                        |

#### `useDateRange`

The behaviour every date-range variant shares: the range value, the open state of the picker and the calendar state the picker is reopened with.

```ts
function useDateRange({
  value,
  defaultValue,
  onValueChange,
}: SmartDateRangeVariantProps);
```

| Returns          | Type                            | Description                                                                         |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------- |
| `value`          | `IDateRange \| undefined`       | The current range (controlled or internal), `undefined` when empty.                 |
| `isOpen`         | `boolean`                       | Whether the picker is open.                                                         |
| `calendarData`   | `CalendarState`                 | The `CalendarState` the picker reopens with.                                        |
| `onClick`        | `() => void`                    | Opens the picker.                                                                   |
| `onModalApply`   | `(data: CalendarState) => void` | Applies a picked `CalendarState`: sets the range, calls `onValueChange` and closes. |
| `onModalDismiss` | `() => void`                    | Closes the picker without changing the range.                                       |
| `onClear`        | `() => void`                    | Clears the range and calls `onValueChange(undefined)`.                              |

```tsx
import {
  SmartDateRangeModalStandard,
  SmartDateRangeVariantProps,
  useDateRange,
} from '@smartsoft001/react';

export function LinkDateRange(props: SmartDateRangeVariantProps) {
  const {
    value,
    isOpen,
    calendarData,
    onClick,
    onModalApply,
    onModalDismiss,
    onClear,
  } = useDateRange(props);

  return (
    <span className={props.className}>
      <button type="button" onClick={onClick}>
        {value ? `${value.start} – ${value.end}` : 'Pick dates'}
      </button>
      {value && (
        <button type="button" onClick={onClear}>
          Clear
        </button>
      )}
      {isOpen && (
        <SmartDateRangeModalStandard
          showFilterBtns
          previousState={calendarData}
          onApply={onModalApply}
          onDismiss={onModalDismiss}
        />
      )}
    </span>
  );
}
```

## Styling

- `SmartDateRangeModalStandard` is `fixed` positioned and rendered inline by the standard trigger; a backdrop click or its close button dismisses it.
- Both variants carry `smart:dark:` variants; `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/date-range/` in the smartsoft001 repository.

- `date-range.tsx`: `SmartDateRange`
- `date-range.types.ts`: `DateRangeVariantName`, `FilterBtnConstants`, `CalendarState`, `SmartDateRangeVariantProps`, `SmartDateRangeProps`, `SmartDateRangeModalProps`
- `preset/date-range-preset.tsx`: `SmartDateRangePreset`
- `standard/date-range-modal-standard.tsx`: `SmartDateRangeModalStandard`
- `standard/date-range-standard.tsx`: `SmartDateRangeStandard`
- `use-date-range-modal.ts`: `useDateRangeModal`, `DateRangeModalForm`
- `use-date-range.ts`: `useDateRange`
- `date-range.stories.tsx`: Storybook stories
