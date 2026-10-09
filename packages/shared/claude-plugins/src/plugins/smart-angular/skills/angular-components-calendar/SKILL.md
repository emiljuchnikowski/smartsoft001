---
name: angular-components-calendar
description: Calendar component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Calendar Component

The `<smart-calendar>` component renders a date calendar with shared month-grid logic, navigation (prev/next/today), single-day selection, and per-day event awareness. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `CalendarBaseComponent` defines the shared API and contains the date logic (pure month-grid construction, period navigation, day selection, event filtering). `CalendarStandardComponent` is a barebones placeholder concrete implementation that renders a 6×7 month grid. `CalendarComponent` is the public wrapper that renders `CalendarStandardComponent` by default and accepts a custom replacement via `CALENDAR_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the calendar component
- Developer asks about `<smart-calendar>`, `CalendarComponent`, `CalendarStandardComponent`, or `CalendarBaseComponent`

## Components

### CalendarComponent (`<smart-calendar>`)

Main wrapper component. Renders `CalendarStandardComponent` by default. When `CALENDAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. The wrapper exposes a two-way `value` model (`Date | null`), an optional `referenceDate` input (today when omitted), an `events` input, `options` and `class`. It passes all of them to the injected component (`referenceDate` included) and writes the injected component's `value` changes back to its own `value` model, so `[(value)]` works the same with the standard, the preset or an implementation of your own.

### CalendarStandardComponent (`<smart-calendar-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` (carrying the external classes) containing a `<div class="calendar" data-view>` with an optional toolbar (`<button.prev>`, `<button.today-btn>`, `<button.next>`, optional `toolbarActionsTpl` slot) and a `<div class="view-grid">` with one `<div class="week">` per week and one `<button class="day">` per day. Each day exposes `data-current-month`, `data-today`, and `data-selected` attributes plus an `aria-label` of the date string. The standard marks event days: a day with `eventsForDay(date).length > 0` gets `data-events="<count>"`, its `aria-label` gains the count (e.g. `"Thu Sep 03 2026, 1 event"`, `", 2 events"`; built by the base's `dayAriaLabel(date)`, which the preset uses too), and — without `dayCellTpl` — a `<span class="smart-calendar-event" data-role="event-dot" aria-hidden="true">` marker after the day number. If `dayCellTpl` is provided in options, it replaces the default day content (day number and marker). The toolbar labels (Prev / Today / Next) are not translated. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### CalendarPresetComponent (`<smart-calendar-preset>`)

Styled single date-picker variation that extends `CalendarBaseComponent` and is a drop-in replacement for `CalendarStandardComponent`. Register it via `CALENDAR_STANDARD_COMPONENT_TOKEN` (`{ provide: CALENDAR_STANDARD_COMPONENT_TOKEN, useValue: CalendarPresetComponent }`) to restyle every `<smart-calendar>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-calendar-preset>` selector directly (it takes the extra classes as `class` or `[cssClass]`). It reproduces Preline's single date-picker visual (a `w-80` rounded popover card: month/year navigation header with chevron prev/next buttons, a weekday header row, and a 6×7 grid of circular day buttons) translated to `smart:`-prefixed vanilla Tailwind with explicit `dark:` variants. Month navigation (`prevPeriod`/`nextPeriod`) and day selection (`selectDay`) are driven entirely by Angular signals — the Preline datepicker JS plugin is **not** required. It honors `options.weekStart` (rotates the weekday header; default `1` → Monday) and `options.showToolbar` (toggles the navigation header); it does not render `toolbarActionsTpl`. Selected, today, default, and out-of-month day states each get distinct styling; out-of-month days are rendered disabled. Days that have matching `events` show a small dot marker, and `options.dayCellTpl` overrides the default day content. The month name and the weekday labels are English and not translated.

### CalendarBaseComponent (abstract)

Abstract base directive containing the shared calendar logic. Exposes inputs and signals for state, plus methods for navigation and selection.

**Inputs:** `options` (`ICalendarOptions | undefined`), `value` (`Date | null`, two-way model), `referenceDate` (`Date | undefined`; the class property is `referenceDateInput`), `events` (`ICalendarEvent[]`), `class` (`string`, the `cssClass` property)

**Computed signals:** `view` (current view from options, default `'month'`), `weekStart` (`0 | 1`, default `1`), `showToolbar` (default `true`), `reference` (the navigated reference date, read-only; it starts at `referenceDate` or today and jumps back to `referenceDate` whenever that input changes), `monthGrid` (current 6×7 grid).

**Methods:** `selectDay(date)` (sets `value`), `goToToday()`, `prevPeriod()` / `nextPeriod()` (move `reference` one `view` period: a month, 7 days, a day or a year), `eventsForDay(day)`, `dayAriaLabel(day)` (date string plus `", N event(s)"` when the day has events).

**Static method:** `buildMonthGrid(reference, weekStart, selected): ICalendarDayCell[][]` — pure function returning a 6×7 grid suitable for rendering.

## API

### Inputs

| Input           | Type                                         | Default | Description                                                                                                    |
| --------------- | -------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `options`       | `InputSignal<ICalendarOptions \| undefined>` | -       | Configuration (view, weekStart, toolbar, slot templates)                                                       |
| `value`         | `ModelSignal<Date \| null>`                  | `null`  | Selected day (two-way binding); `valueChange` reports every selection                                          |
| `referenceDate` | `InputSignal<Date \| undefined>`             | today   | The day whose month is shown first; the calendar navigates from there and jumps back to it whenever it changes |
| `events`        | `InputSignal<ICalendarEvent[]>`              | `[]`    | Events for `eventsForDay()`; the standard and preset mark days that have events                                |
| `class`         | `InputSignal<string>`                        | `''`    | External CSS classes (alias for `cssClass`)                                                                    |

### ICalendarOptions

| Field               | Type                   | Default     | Description                                                                                                                                                                                                         |
| ------------------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `view`              | `SmartCalendarView`    | `'month'`   | The period Prev / Next move by (`'month'`, `'week'`, `'day'`, `'year'`). The grid is always a month grid; the standard also exposes the value as `data-view`.                                                       |
| `monthsCount`       | `1 \| 2 \| 12`         | `undefined` | Not read by the built-in implementations (standard and preset); available to a custom implementation.                                                                                                               |
| `weekStart`         | `0 \| 1`               | `1`         | First day of the week: `1` Monday, `0` Sunday.                                                                                                                                                                      |
| `showToolbar`       | `boolean`              | `true`      | Shows the navigation toolbar (the standard's Prev / Today / Next, the preset's month header).                                                                                                                       |
| `toolbarActionsTpl` | `TemplateRef<unknown>` | `undefined` | Standard only: extra content at the end of the toolbar. The preset does not render it.                                                                                                                              |
| `eventListTpl`      | `TemplateRef<unknown>` | `undefined` | Not read by the built-in implementations; available to a custom implementation.                                                                                                                                     |
| `sidePanelTpl`      | `TemplateRef<unknown>` | `undefined` | Not read by the built-in implementations; available to a custom implementation.                                                                                                                                     |
| `dayCellTpl`        | `TemplateRef<unknown>` | `undefined` | Replaces the content of every day button. Its context is the day cell as `$implicit` (`ICalendarDayCell`) and the day's events as `events` (`ICalendarEvent[]`): `<ng-template #day let-cell let-events="events">`. |
| `eventTpl`          | `TemplateRef<unknown>` | `undefined` | Not read by the built-in implementations; available to a custom implementation.                                                                                                                                     |

```typescript
type SmartCalendarView = 'month' | 'week' | 'day' | 'year';

interface ICalendarOptions {
  view?: SmartCalendarView;
  monthsCount?: 1 | 2 | 12;
  weekStart?: 0 | 1;
  showToolbar?: boolean;
  toolbarActionsTpl?: TemplateRef<unknown>;
  eventListTpl?: TemplateRef<unknown>;
  sidePanelTpl?: TemplateRef<unknown>;
  dayCellTpl?: TemplateRef<unknown>;
  eventTpl?: TemplateRef<unknown>;
}
```

### ICalendarEvent

An event marks the day of its `start`.

| Field   | Type                      | Default     | Description                                                                                                                                                 |
| ------- | ------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`    | `string \| number`        | required    | Identifies the event.                                                                                                                                       |
| `start` | `Date`                    | required    | Decides the day the event is listed on (`eventsForDay`).                                                                                                    |
| `end`   | `Date`                    | `undefined` | Not read by the built-in implementations; available to a custom implementation or your `dayCellTpl`.                                                        |
| `title` | `string`                  | `undefined` | Not rendered by the built-in implementations (the day's accessible name only counts the events); available to a custom implementation or your `dayCellTpl`. |
| `meta`  | `Record<string, unknown>` | `undefined` | Free data for a custom implementation or your `dayCellTpl`.                                                                                                 |

```typescript
interface ICalendarEvent {
  id: string | number;
  start: Date;
  end?: Date;
  title?: string;
  meta?: Record<string, unknown>;
}
```

### ICalendarDayCell

One day of the month grid (`monthGrid()`, and the `$implicit` context of `dayCellTpl`).

| Field            | Type      | Default  | Description                                                         |
| ---------------- | --------- | -------- | ------------------------------------------------------------------- |
| `date`           | `Date`    | required | The day.                                                            |
| `isCurrentMonth` | `boolean` | required | `false` for the leading / trailing days of the neighbouring months. |
| `isToday`        | `boolean` | required | The day is today.                                                   |
| `isSelected`     | `boolean` | required | The day is the selected `value`.                                    |

```typescript
interface ICalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}
```

## CALENDAR_STANDARD_COMPONENT_TOKEN

```typescript
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `CalendarStandardComponent` with a custom implementation. Provide a `Type<CalendarBaseComponent>` to override. The wrapper passes it every input it declares (`referenceDate` and `class` included) and writes its `value` changes back to the wrapper's `value` model, so `[(value)]` on `<smart-calendar>` keeps working.

```typescript
providers: [
  {
    provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomCalendarComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { CalendarBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-calendar',
  template: `
    <div [class]="containerClasses()">
      @if (showToolbar()) {
        <div class="toolbar">
          <button (click)="prevPeriod()">Prev</button>
          <button (click)="goToToday()">Today</button>
          <button (click)="nextPeriod()">Next</button>
        </div>
      }
      <div class="grid">
        @for (week of monthGrid(); track $index) {
          <div class="week">
            @for (cell of week; track cell.date.getTime()) {
              <button
                type="button"
                [attr.data-today]="cell.isToday ? 'true' : null"
                [attr.data-selected]="cell.isSelected ? 'true' : null"
                (click)="selectDay(cell.date)"
              >
                {{ cell.date.getDate() }}
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomCalendarComponent extends CalendarBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-calendar'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Basic month calendar with two-way binding -->
<smart-calendar [(value)]="selected" />

<!-- With reference date and events -->
<smart-calendar
  [(value)]="selected"
  [referenceDate]="january2026"
  [events]="meetings"
/>

<!-- Hidden toolbar -->
<smart-calendar [(value)]="selected" [options]="{ showToolbar: false }" />

<!-- Sunday-first weeks -->
<smart-calendar [(value)]="selected" [options]="{ weekStart: 0 }" />

<!-- Custom day cell (renders events in cell) -->
<ng-template #dayCell let-cell let-events="events">
  <span>{{ cell.date.getDate() }}</span>
  @for (event of events; track event.id) {
  <span class="dot" [title]="event.title"></span>
  }
</ng-template>

<smart-calendar
  [(value)]="selected"
  [events]="meetings"
  [options]="{ dayCellTpl: dayCell }"
/>

<!-- With toolbar action slot (standard only) -->
<ng-template #addBtn>
  <button>+ Add event</button>
</ng-template>

<smart-calendar
  [(value)]="selected"
  [options]="{ toolbarActionsTpl: addBtn }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/calendar/calendar.component.ts`
- Standard: `packages/shared/angular/src/lib/components/calendar/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/calendar/preset/preset.component.ts` (selector `smart-calendar-preset`, class recipes in `preset/preset-classes.util.ts`, internal)
- Base class: `packages/shared/angular/src/lib/components/calendar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CALENDAR_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICalendarOptions`, `ICalendarEvent`, `ICalendarDayCell`, `SmartCalendarView`)
