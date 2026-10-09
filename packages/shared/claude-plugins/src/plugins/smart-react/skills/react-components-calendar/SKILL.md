---
name: react-components-calendar
description: SmartCalendar React component API (@smartsoft001/react) — month calendar with day selection (controlled value/onValueChange or uncontrolled defaultValue), events per day, dayCellTpl render function, toolbar navigation, the 'calendar' registry key, SmartCalendarPreset and useCalendar.
user-invocable: false
---

# Calendar (`SmartCalendar`)

`SmartCalendar` renders a month grid (6 x 7 days) with a toolbar to move between periods, lets the user select a day, and marks the days that have `events`. The selection is controlled (`value` + `onValueChange`) or kept inside (`defaultValue`). `options.dayCellTpl` is a **render function** called for every day with `{ cell, events }`. `SmartCalendarStandard` is barebones native HTML; `SmartCalendarPreset` is a styled single date picker.

## When to Use This Skill

- Picking a single day from a month view
- Showing which days have events and rendering custom day cells (`options.dayCellTpl`)
- Starting the calendar on a given month (`referenceDate`)
- Restyling every calendar (the `calendar` registry key) or building one on `useCalendar`

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                                                                                                                       |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SmartCalendar`         | component | Renders the implementation registered as `components.calendar` on `SmartProvider`, `SmartCalendarStandard` by default.                                                                                                                                                                           |
| `SmartCalendarPreset`   | component | Styled calendar variation (preset) — a single date picker.                                                                                                                                                                                                                                       |
| `SmartCalendarStandard` | component | Barebones native-HTML month calendar.                                                                                                                                                                                                                                                            |
| `useCalendar`           | hook      | The behaviour every calendar variant shares: the options with their defaults (month view, Monday week start, toolbar shown), the selected day (`value`, controlled or uncontrolled), the navigated reference date with its 6 x 7 `monthGrid`, the events of a day and the day's accessible name. |
| `buildMonthGrid`        | function  | The 6 x 7 day grid of the month of `reference`, starting on `weekStart` (0 = Sunday, 1 = Monday), with the leading / trailing days of the neighbouring months.                                                                                                                                   |

The preset's class helpers (`getCalendarPresetDayClasses`, `CALENDAR_PRESET_CONTAINER`, `CALENDAR_PRESET_INNER`, `CALENDAR_PRESET_HEADER`, `CALENDAR_PRESET_NAV_BUTTON`, `CALENDAR_PRESET_MONTH_LABEL`, `CALENDAR_PRESET_WEEK_ROW`, `CALENDAR_PRESET_DAY_ROW`, `CALENDAR_PRESET_WEEKDAY`, `CALENDAR_PRESET_EVENT_DOT`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartCalendarProps`

| Prop             | Type                            | Default | Description                                                                                                                                                              |
| ---------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options?`       | `SmartCalendarOptions`          | —       | View, week start, toolbar and the custom templates.                                                                                                                      |
| `className?`     | `string`                        | —       | Classes on the root element.                                                                                                                                             |
| `value?`         | `Date \| null`                  | —       | The selected day. Controlled when defined (`null` = nothing selected); leave it `undefined` to let the calendar keep the selection itself, starting from `defaultValue`. |
| `defaultValue?`  | `Date \| null`                  | `null`  | The initial selection of an uncontrolled calendar.                                                                                                                       |
| `onValueChange?` | `(value: Date \| null) => void` | —       | Called with the day the user selects.                                                                                                                                    |
| `referenceDate?` | `Date`                          | `today` | The day whose month is shown first; the calendar navigates from there and jumps back to it whenever it changes. Today when omitted.                                      |
| `events?`        | `ICalendarEvent[]`              | `[]`    | Events to mark; a day lists the events whose `start` falls on it.                                                                                                        |

### `SmartCalendarOptions`

`ICalendarOptions` with `dayCellTpl` as a render function, called for every day with `SmartCalendarDayCellContext`. `toolbarActionsTpl` has no context, so it stays a `ReactNode`. `eventListTpl`, `sidePanelTpl`, `eventTpl` and `monthsCount` are not read by the built-in implementations; they are available to a custom implementation. Extends `Omit<ICalendarOptions, 'dayCellTpl'>`.

| Field         | Type                                                  | Default | Description                            |
| ------------- | ----------------------------------------------------- | ------- | -------------------------------------- |
| `dayCellTpl?` | `(context: SmartCalendarDayCellContext) => ReactNode` | —       | Renders the content of every day cell. |

### `ICalendarOptions`

The base options; `SmartCalendarOptions` replaces its `dayCellTpl` with a render function.

| Field                | Type                | Default   | Description                                                                               |
| -------------------- | ------------------- | --------- | ----------------------------------------------------------------------------------------- |
| `view?`              | `SmartCalendarView` | `'month'` | The period Prev / Next move by (month, week, day, year). The grid is always a month grid. |
| `monthsCount?`       | `1 \| 2 \| 12`      | —         | Not read by the built-in implementations; available to a custom implementation.           |
| `weekStart?`         | `0 \| 1`            | `1`       | `1` Monday, `0` Sunday.                                                                   |
| `showToolbar?`       | `boolean`           | `true`    | Shows the Prev / Today / Next toolbar.                                                    |
| `toolbarActionsTpl?` | `ReactNode`         | —         | Extra content in the toolbar of the standard calendar (the preset does not render it).    |
| `eventListTpl?`      | `ReactNode`         | —         | Not read by the built-in implementations; available to a custom implementation.           |
| `sidePanelTpl?`      | `ReactNode`         | —         | Not read by the built-in implementations; available to a custom implementation.           |
| `dayCellTpl?`        | `ReactNode`         | —         | Overridden by `SmartCalendarOptions.dayCellTpl` (a render function).                      |
| `eventTpl?`          | `ReactNode`         | —         | Not read by the built-in implementations; available to a custom implementation.           |

### `SmartCalendarDayCellContext`

The context `dayCellTpl` renders with: the day `cell` and its `events`.

| Field    | Type               | Default  | Description                                                     |
| -------- | ------------------ | -------- | --------------------------------------------------------------- |
| `cell`   | `ICalendarDayCell` | required | The day: `date`, `isCurrentMonth`, `isToday`, `isSelected`.     |
| `events` | `ICalendarEvent[]` | required | The events starting on `cell.date` (`eventsForDay(cell.date)`). |

### `ICalendarDayCell`

One day of the month grid.

| Field            | Type      | Default  | Description                                                         |
| ---------------- | --------- | -------- | ------------------------------------------------------------------- |
| `date`           | `Date`    | required | The day.                                                            |
| `isCurrentMonth` | `boolean` | required | `false` for the leading / trailing days of the neighbouring months. |
| `isToday`        | `boolean` | required | The day is today.                                                   |
| `isSelected`     | `boolean` | required | The day is the selected `value`.                                    |

### `ICalendarEvent`

An event shown on the day of its `start`.

| Field    | Type                      | Default  | Description                                                                                                                                                 |
| -------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`     | `string \| number`        | required | Identifies the event.                                                                                                                                       |
| `start`  | `Date`                    | required | Start; decides the day the event is listed on.                                                                                                              |
| `end?`   | `Date`                    | —        | Not read by the built-in implementations; available to a custom implementation or your `dayCellTpl`.                                                        |
| `title?` | `string`                  | —        | Not rendered by the built-in implementations (the day's accessible name only counts the events); available to a custom implementation or your `dayCellTpl`. |
| `meta?`  | `Record<string, unknown>` | —        | Free data for a custom implementation or your `dayCellTpl`.                                                                                                 |

### Related types

- `SmartCalendarView`: `'month' \| 'week' \| 'day' \| 'year'`

## Behaviour

- `SmartCalendar` replaces a missing `referenceDate` with the date it was mounted, so a registered implementation always gets one. When `referenceDate` changes to another day, the calendar jumps back to it.
- The toolbar labels (Prev / Today / Next) of the standard calendar and the English month and weekday names of the preset are not translated.
- `SmartCalendarPreset` disables days outside the shown month; the standard grid marks days with events with `data-events="<count>"`.

## Usage

```tsx
import { useState } from 'react';

import {
  ICalendarEvent,
  SmartCalendar,
  SmartCalendarPreset,
} from '@smartsoft001/react';

const events: ICalendarEvent[] = [
  { id: 1, start: new Date(2026, 9, 12, 10), title: 'Sprint review' },
  { id: 2, start: new Date(2026, 9, 12, 14), title: 'Retro' },
];

export function MeetingCalendar() {
  const [day, setDay] = useState<Date | null>(null);

  return (
    <>
      <SmartCalendar
        value={day}
        onValueChange={setDay}
        events={events}
        referenceDate={new Date(2026, 9, 1)}
        options={{
          weekStart: 1,
          dayCellTpl: ({ cell, events: dayEvents }) => (
            <span>
              {cell.date.getDate()}
              {dayEvents.length > 0 && <small> ({dayEvents.length})</small>}
            </span>
          ),
        }}
      />

      {/* A styled single date picker, uncontrolled. */}
      <SmartCalendarPreset
        defaultValue={new Date()}
        onValueChange={(value) => console.log(value)}
      />
    </>
  );
}
```

## Replacing the Implementation

`SmartCalendar` renders the component registered under the `'calendar'` key of `SmartProvider`'s `components`, and `SmartCalendarStandard` when nothing is registered there. Every `SmartCalendar` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartCalendarPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { calendar: SmartCalendarPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartCalendarPreset` is the styled (preset) implementation: register it under the `'calendar'` key of `SmartProvider`'s `components`, render it directly in place of `SmartCalendar`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useCalendar` hook

The behaviour every calendar variant shares: the options with their defaults (month view, Monday week start, toolbar shown), the selected day (`value`, controlled or uncontrolled), the navigated reference date with its 6 x 7 `monthGrid`, the events of a day and the day's accessible name. The reference starts at `referenceDate` (today when omitted), moves with `prevPeriod` / `nextPeriod` / `goToToday`, and jumps back to `referenceDate` whenever that prop changes to another point in time.

```ts
function useCalendar({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  referenceDate,
  events = NO_EVENTS,
}: SmartCalendarProps);
```

| Returns        | Type                              | Description                                               |
| -------------- | --------------------------------- | --------------------------------------------------------- |
| `view`         | `SmartCalendarView`               | `options.view ?? 'month'`.                                |
| `weekStart`    | `0 \| 1`                          | `options.weekStart ?? 1`.                                 |
| `showToolbar`  | `boolean`                         | `options.showToolbar ?? true`.                            |
| `value`        | `Date \| null`                    | The selected day (controlled or internal).                |
| `reference`    | `Date`                            | The navigated reference date (the shown month).           |
| `monthGrid`    | `ICalendarDayCell[][]`            | The 6 x 7 grid of the reference month (`buildMonthGrid`). |
| `eventsForDay` | `(day: Date) => ICalendarEvent[]` | The events starting on a day.                             |
| `dayAriaLabel` | `(day: Date) => string`           | The accessible name of a day (with the event count).      |
| `selectDay`    | `(date: Date) => void`            | Selects a day and calls `onValueChange`.                  |
| `goToToday`    | `() => void`                      | Moves the reference to today.                             |
| `prevPeriod`   | `() => void`                      | Moves the reference one `view` period back.               |
| `nextPeriod`   | `() => void`                      | Moves the reference one `view` period forward.            |

```tsx
import { SmartCalendarProps, useCalendar } from '@smartsoft001/react';

export function CompactCalendar(props: SmartCalendarProps) {
  const {
    monthGrid,
    reference,
    selectDay,
    prevPeriod,
    nextPeriod,
    dayAriaLabel,
  } = useCalendar(props);

  return (
    <div className={props.className}>
      <button type="button" onClick={prevPeriod}>
        ‹
      </button>
      <span>
        {reference.toLocaleDateString(undefined, {
          month: 'long',
          year: 'numeric',
        })}
      </span>
      <button type="button" onClick={nextPeriod}>
        ›
      </button>
      {monthGrid.map((week, index) => (
        <div key={index}>
          {week.map((cell) => (
            <button
              key={cell.date.toISOString()}
              type="button"
              aria-label={dayAriaLabel(cell.date)}
              aria-pressed={cell.isSelected}
              disabled={!cell.isCurrentMonth}
              onClick={() => selectDay(cell.date)}
            >
              {cell.date.getDate()}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Styling

- `SmartCalendarStandard` is unstyled native HTML (`.calendar`, `data-view`, `data-events`); `SmartCalendarPreset` carries the date-picker look with `smart:dark:` variants.
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/calendar/` in the smartsoft001 repository.

- `calendar.tsx`: `SmartCalendar`
- `calendar.types.ts`: `SmartCalendarDayCellContext`, `SmartCalendarOptions`, `SmartCalendarProps`
- `preset/calendar-preset.tsx`: `SmartCalendarPreset`
- `standard/calendar-standard.tsx`: `SmartCalendarStandard`
- `use-calendar.ts`: `useCalendar`, `buildMonthGrid`
- `calendar.stories.tsx`: Storybook stories
