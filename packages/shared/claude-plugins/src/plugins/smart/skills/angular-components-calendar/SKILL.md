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

Main wrapper component. Renders `CalendarStandardComponent` by default. When `CALENDAR_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. The wrapper exposes a two-way `value` model (`Date | null`), an optional `referenceDate` input (defaults to today), and an `events` input.

### CalendarStandardComponent (`<smart-calendar-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional toolbar (`<button.prev>`, `<button.today-btn>`, `<button.next>`, optional `toolbarActionsTpl` slot) and a `<div class="view-grid">` with one `<div class="week">` per week and one `<button class="day">` per day. Each day exposes `data-current-month`, `data-today`, and `data-selected` attributes plus an `aria-label` of the date string. If `dayCellTpl` is provided in options, it replaces the default day-number content. The external `cssClass` is applied to the root wrapper. It does not include any visual styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### CalendarBaseComponent (abstract)

Abstract base directive containing the shared calendar logic. Exposes inputs and signals for state, plus methods for navigation and selection.

**Inputs:** `options` (`ICalendarOptions | undefined`), `value` (`Date | null`, two-way model), `referenceDate` (`Date | undefined`), `events` (`ICalendarEvent[]`), `class` (`string`)

**Computed signals:** `view` (current view from options, default `'month'`), `weekStart` (`0 | 1`, default `1`), `showToolbar` (default `true`), `reference` (effective reference date — internal writable, seeded from `referenceDate` input), `monthGrid` (current 6×7 grid).

**Methods:** `selectDay(date)`, `goToToday()`, `prevPeriod()`, `nextPeriod()`, `eventsForDay(day)`.

**Static method:** `buildMonthGrid(reference, weekStart, selected): ICalendarDayCell[][]` — pure function returning a 6×7 grid suitable for rendering.

## API

### Inputs

| Input           | Type                                         | Default | Description                                                                                     |
| --------------- | -------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `options`       | `InputSignal<ICalendarOptions \| undefined>` | -       | Configuration (view, weekStart, slot templates, …)                                              |
| `value`         | `ModelSignal<Date \| null>`                  | `null`  | Selected day (two-way binding)                                                                  |
| `referenceDate` | `InputSignal<Date \| undefined>`             | -       | Initial reference date (current month focus). Defaults to today inside the wrapper if undefined |
| `events`        | `InputSignal<ICalendarEvent[]>`              | `[]`    | Events available for `eventsForDay()` filtering                                                 |
| `class`         | `InputSignal<string>`                        | `''`    | External CSS classes (alias for `cssClass`)                                                     |

### ICalendarOptions

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

```typescript
interface ICalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}
```

The default `CalendarStandardComponent` renders the month view; `monthsCount`, `view: 'week' | 'day' | 'year'`, `eventListTpl`, `sidePanelTpl`, and `eventTpl` are hints / slots intended for custom implementations registered via the token. `weekStart` defaults to `1` (Monday).

## CALENDAR_STANDARD_COMPONENT_TOKEN

```typescript
import { CALENDAR_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `CalendarStandardComponent` with a custom implementation. Provide a `Type<CalendarBaseComponent>` to override.

```typescript
providers: [
  {
    provide: CALENDAR_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomCalendarComponent,
  },
];
```

> **Note:** `NgComponentOutlet` does not propagate output bindings. When a custom component is injected via the token, the `value` two-way binding becomes one-way (input only). Custom implementations should expose their selection events through dedicated outputs (e.g., `valueChange`) and the host application should wire those manually.

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

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
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomCalendarComponent extends CalendarBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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

<!-- With toolbar action slot -->
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
- Base class: `packages/shared/angular/src/lib/components/calendar/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CALENDAR_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICalendarOptions`, `ICalendarEvent`, `ICalendarDayCell`, `SmartCalendarView`)
