---
name: angular-components-date-range
description: Date range picker component API and usage patterns for @smartsoft001/angular. Includes ready-to-use <smart-date-range> and extensible base classes.
user-invocable: false
---

# Date Range Component

Date range picker with trigger button, modal calendar overlay, quick filter buttons, and `ControlValueAccessor` support.

This component has both a **default concrete implementation** (`<smart-date-range>`) and **abstract base classes** for custom extensions.

## Default Component Usage

### Selector

`<smart-date-range>`

### Import

```typescript
import { DateRangeDefaultComponent } from '@smartsoft001/angular';
```

### Properties

| Property  | Type                                   | Default     | Description                                       |
| --------- | -------------------------------------- | ----------- | ------------------------------------------------- |
| `ngModel` | `ModelSignal<IDateRange \| undefined>` | `undefined` | Date range value (`start`, `end` in `YYYY-MM-DD`) |

### IDateRange

```typescript
interface IDateRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}
```

### Usage

```html
<smart-date-range [(ngModel)]="dateRange"></smart-date-range>
<smart-date-range formControlName="period"></smart-date-range>
```

### Features

- Trigger button with calendar icon
- Clear button (X) to reset
- Modal overlay with calendar grid
- Quick filters: Today, Yesterday, Last 7/30 days, This/Last Month
- Range selection with start/end highlighting
- `ControlValueAccessor` for forms
- Dark mode

## DateRangePresetComponent (`<smart-date-range-preset>`)

A fully styled, drop-in variation based on the Preline "single calendar range"
datepicker (FRA-219). The Preline JS plugin is **not** installed, so the range
calendar is rendered entirely with Angular signals (no external runtime): click
the trigger to open an inline popover, pick a start and end day to highlight the
range, switch months via prev/next buttons or the month/year selects, then Apply.

Extends `DateRangeBaseComponent` (reuses `onClick`, `onModalApply`, `onModalDismiss`,
`onClear`), so it consumes the exact same API and `ControlValueAccessor` contract
as the standard variant — no new interface options or tokens are required.

### Selecting the variant

`<smart-date-range>` dispatches over the `variant` input (type
`DateRangeVariantName = 'standard' | 'preset'`) with an internal `@switch`. This
component does **not** use the InjectionToken / `NgComponentOutlet` pattern:

```html
<!-- via the wrapper -->
<smart-date-range variant="preset" [(ngModel)]="dateRange"></smart-date-range>

<!-- or directly -->
<smart-date-range-preset [(ngModel)]="dateRange"></smart-date-range-preset>
```

Because the wrapper binds `[class]="cssClass()"` directly on the selector (not via
`NgComponentOutlet`), the host `class` is applied natively — no `cssClass` input
override is needed (unlike token-based components such as `badge`).

## Base Classes API (for Extension)

### DateRangeBaseComponent

Provides open/close state, calendar data management, clear/apply logic, and `ControlValueAccessor`.

```typescript
import { DateRangeBaseComponent } from '@smartsoft001/angular';
```

| Member             | Type                                   | Description                              |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| `ngModel`          | `ModelSignal<IDateRange \| undefined>` | Date range value                         |
| `value`            | `IDateRange \| undefined`              | Current value (synced via effect)        |
| `isOpen`           | `WritableSignal<boolean>`              | Controls modal visibility                |
| `calendarData`     | `CalendarState`                        | Persisted calendar state between opens   |
| `onClick()`        | method                                 | Opens modal, restores previous selection |
| `onModalApply()`   | method                                 | Applies selection and closes modal       |
| `onModalDismiss()` | method                                 | Closes modal without applying            |
| `onClear()`        | method                                 | Resets value to undefined                |

### DateRangeModalBaseComponent

Provides calendar rendering, quick filter buttons, date selection, and range restriction.

```typescript
import { DateRangeModalBaseComponent } from '@smartsoft001/angular';
```

| Member                   | Type                           | Description                       |
| ------------------------ | ------------------------------ | --------------------------------- |
| `previousState`          | `InputSignal<CalendarState>`   | State from parent component       |
| `apply`                  | `OutputEmitter<CalendarState>` | Emits on apply                    |
| `dismiss`                | `OutputEmitter<void>`          | Emits on dismiss                  |
| `calendar`               | `month[]`                      | Generated calendar months         |
| `dateForm`               | `UntypedFormGroup`             | Form with dateFrom/dateTo fields  |
| `selectToday()`          | method                         | Quick filter: today               |
| `selectYesterday()`      | method                         | Quick filter: yesterday           |
| `selectLastSevenDays()`  | method                         | Quick filter: last 7 days         |
| `selectLastThirtyDays()` | method                         | Quick filter: last 30 days        |
| `selectThisMonth()`      | method                         | Quick filter: this month          |
| `selectLastMonth()`      | method                         | Quick filter: last month          |
| `isInRange(day)`         | method                         | Check if day is in selected range |
| `isSelectionStart(day)`  | method                         | Check if day is range start       |
| `isSelectionEnd(day)`    | method                         | Check if day is range end         |
| `applyDates()`           | method                         | Emits apply with current state    |
| `dismissPage()`          | method                         | Emits dismiss and unsubscribes    |

### Extending

```typescript
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateRangeBaseComponent } from '@smartsoft001/angular';
import { MyDateRangeModalComponent } from './my-modal.component';

@Component({
  selector: 'my-date-range',
  templateUrl: './my-date-range.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MyDateRangeModalComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyDateRangeComponent),
      multi: true,
    },
  ],
})
export class MyDateRangeComponent extends DateRangeBaseComponent {}
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/date-range/base/date-range-base.component.ts`
- Modal base: `packages/shared/angular/src/lib/components/date-range/base/date-range-modal-base.component.ts`
- Default component: `packages/shared/angular/src/lib/components/date-range/default/date-range-default.component.ts`
- Default template: `packages/shared/angular/src/lib/components/date-range/default/date-range-default.component.html`
- Default modal: `packages/shared/angular/src/lib/components/date-range/default/date-range-modal-default.component.ts`
- Preset component: `packages/shared/angular/src/lib/components/date-range/preset/preset.component.ts`
- Preset template: `packages/shared/angular/src/lib/components/date-range/preset/preset.component.html`
- Preset classes: `packages/shared/angular/src/lib/components/date-range/preset/preset-classes.util.ts`
- Preset tests: `packages/shared/angular/src/lib/components/date-range/preset/preset.component.spec.ts`
- Tests: `packages/shared/angular/src/lib/components/date-range/date-range.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/date-range/date-range.component.stories.ts`
- Calendar service: `packages/shared/angular/src/lib/services/calendar/calendar.service.ts`

## Dependencies

- `@smartsoft001/domain-core` — `IDateRange` interface
- `@ngx-translate/core` — `TranslatePipe` for i18n
- `moment` — date operations
- `CalendarService` — calendar month generation

## Tailwind Classes

All classes use `smart:` prefix. Trigger: `smart:inline-flex smart:rounded-md smart:border smart:border-gray-300`. Modal backdrop: `smart:fixed smart:inset-0 smart:bg-black/50`. Calendar selection: `smart:bg-indigo-600 smart:text-white`.
