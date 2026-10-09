---
name: angular-components-date-range
description: Date range picker component API and usage patterns for @smartsoft001/angular. Includes ready-to-use <smart-date-range> and extensible base classes.
user-invocable: false
---

# Date Range Component

Date range picker with a trigger button, a clear button and a calendar to pick the start and end day, with `ControlValueAccessor` support. The value is an `IDateRange` from `@smartsoft001/domain-core` (`{ start, end }`, both `YYYY-MM-DD`); clearing sets it to `undefined`.

This component has both a **default concrete implementation** (`<smart-date-range>`) and **abstract base classes** for custom extensions.

## Default Component Usage

### Selector

`<smart-date-range>` (class `DateRangeComponent`), bound with `[(ngModel)]`, `formControlName` or `[formControl]`.

```typescript
import { DateRangeComponent } from '@smartsoft001/angular';
```

```html
<smart-date-range [(ngModel)]="dateRange"></smart-date-range>
<smart-date-range variant="preset" formControlName="period"></smart-date-range>
```

### Inputs

| Input     | Type                                   | Default      | Description                                                                                                |
| --------- | -------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `ngModel` | `ModelSignal<IDateRange \| undefined>` | `undefined`  | The range (`start`, `end` in `YYYY-MM-DD`); also bound through `ControlValueAccessor` (`formControlName`). |
| `variant` | `DateRangeVariantName`                 | `'standard'` | `'standard'` (trigger + scrollable calendar modal) or `'preset'` (trigger + popover calendar).             |
| `class`   | `string`                               | `''`         | Classes on the rendered variant (`cssClass` input, alias `class`).                                         |

`DateRangeVariantName` is `'standard' | 'preset'`.

### Features

- Trigger button with a calendar icon, showing `start - end` (or the translated `select` while empty)
- Clear button (X) that resets the value to `undefined`
- `standard`: a modal with a scrollable calendar of the months around today; pick a start, then an end day, and apply
- `preset`: a popover calendar with month navigation, then Apply / Cancel
- `ControlValueAccessor` for template-driven and reactive forms
- Dark mode

`<smart-date-range>` does not show the modal's quick-pick buttons (today, last 7 days, ...): the standard renders `DateRangeModalStandardComponent` without `showFilterBtns` and `restrictSelectionTo`, so both stay at their defaults. They take effect only when you render the modal yourself (see `DateRangeModalBaseComponent`).

## DateRangePresetComponent (`<smart-date-range-preset>`)

A fully styled, drop-in variation based on the Preline "single calendar range" datepicker. The Preline JS plugin is **not** installed, so the range calendar is rendered entirely with Angular signals (no external runtime): click the trigger to open an inline popover, pick a start and end day to highlight the range, switch months via prev/next buttons or the month/year selects, then Apply.

It extends `DateRangeBaseComponent` (reuses `onClick`, `onModalApply`, `onModalDismiss`, `onClear`), so it has the same value API and `ControlValueAccessor` contract as the standard variant.

### Selecting the variant

`<smart-date-range>` picks the rendering with its `variant` input and an internal `@switch`; it has no injection token. Use `variant="preset"` on the wrapper, or the `<smart-date-range-preset>` selector directly.

```html
<!-- via the wrapper -->
<smart-date-range variant="preset" [(ngModel)]="dateRange"></smart-date-range>

<!-- or directly -->
<smart-date-range-preset [(ngModel)]="dateRange"></smart-date-range-preset>
```

The wrapper binds `[class]="cssClass()"` on the variant it renders, so `class` on `<smart-date-range>` reaches either variant.

## Base Classes API (for Extension)

### DateRangeBaseComponent

Provides the value, the open/close state, the calendar state kept between opens, the clear/apply logic and `ControlValueAccessor`.

```typescript
import { DateRangeBaseComponent } from '@smartsoft001/angular';
```

| Member                 | Type                                   | Description                                                |
| ---------------------- | -------------------------------------- | ---------------------------------------------------------- |
| `ngModel`              | `ModelSignal<IDateRange \| undefined>` | Date range value                                           |
| `value`                | `IDateRange \| undefined`              | Current value (synced from `ngModel` via an effect)        |
| `isOpen`               | `WritableSignal<boolean>`              | Whether the picker is open                                 |
| `calendarData`         | `CalendarState`                        | Calendar state the picker reopens with                     |
| `onClick()`            | method                                 | Opens the picker with the current range                    |
| `onModalApply(data)`   | method                                 | Sets the value from a `CalendarState`, emits it and closes |
| `onModalDismiss()`     | method                                 | Closes without changing the value                          |
| `onClear()`            | method                                 | Resets the value to `undefined` and emits it               |
| `propagateChange(val)` | method                                 | The registered `ControlValueAccessor` change callback      |

### DateRangeModalBaseComponent

The modal's behaviour: calendar months, quick-pick buttons, date selection and range restriction. `DateRangeModalStandardComponent` (`<smart-date-range-modal-standard>`) is its implementation.

```typescript
import { DateRangeModalBaseComponent } from '@smartsoft001/angular';
```

| Member                                | Type                              | Description                                                                                      |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `showFilterBtns`                      | `InputSignal<boolean>`            | Shows the quick-pick buttons. Default `false`; modal only: `<smart-date-range>` does not set it. |
| `restrictSelectionTo`                 | `InputSignal<number>`             | When non-zero, only a range of exactly this many days can be applied. Default `0`; modal only.   |
| `previousState`                       | `InputSignal<CalendarState>`      | The state the modal opens with; without `dateFrom` it selects today                              |
| `apply`                               | `OutputEmitterRef<CalendarState>` | Emits the picked state on apply                                                                  |
| `dismiss`                             | `OutputEmitterRef<void>`          | Emits when the modal is closed without applying                                                  |
| `calendar`                            | `month[]`                         | The months of the `CalendarService`                                                              |
| `dateForm`                            | `UntypedFormGroup`                | `dateFrom` / `dateTo` (shown dates) and the `datesRefGroup` of the picked days                   |
| `selectToday()` … `selectLastMonth()` | method                            | Quick picks: today, yesterday, last 7 days, last 30 days, this month, last month                 |
| `isInRange(day)`                      | method                            | Whether a day lies inside the picked range                                                       |
| `isSelectionStart(day)`               | method                            | Whether a day is the range start                                                                 |
| `isSelectionEnd(day)`                 | method                            | Whether a day is the range end                                                                   |
| `isStartAndEndDateSame()`             | method                            | Whether start and end are the same day                                                           |
| `isSelectionInRestrictedRange()`      | method                            | Whether the range has exactly `restrictSelectionTo` days                                         |
| `applyDates()`                        | method                            | Emits `apply` with the current state                                                             |
| `dismissPage()`                       | method                            | Emits `dismiss` and unsubscribes                                                                 |

### CalendarState

What the modal applies, and is reopened with.

| Field                | Type                 | Default  | Description                                                     |
| -------------------- | -------------------- | -------- | --------------------------------------------------------------- |
| `dateFrom`           | `moment.Moment`      | required | Start of the picked range (`null` while nothing is picked).     |
| `dateTo`             | `moment.Moment`      | required | End of the picked range.                                        |
| `scrollPosition`     | `number`             | required | Scroll position of the modal's calendar, restored on reopening. |
| `selectedButtonName` | `FilterBtnConstants` | required | The quick-pick button that produced the range.                  |

`FilterBtnConstants` is a `const enum`: `empthyString = ''` (spelled that way in the code), `today = 'Today'`, `yesterday = 'Yesterday'`, `lastSevenDays = 'LastSevenDays'`, `lastThirtyDays = 'LastThirtyDays'`, `thisMonth = 'ThisMonth'`, `lastMonth = 'LastMonth'`.

### Extending

```typescript
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateRangeBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-date-range',
  templateUrl: './my-date-range.component.html',
  encapsulation: ViewEncapsulation.None,
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

- Wrapper: `packages/shared/angular/src/lib/components/date-range/date-range.component.ts`
- Base class: `packages/shared/angular/src/lib/components/date-range/base/date-range-base.component.ts`
- Modal base: `packages/shared/angular/src/lib/components/date-range/base/date-range-modal-base.component.ts`
- Standard: `packages/shared/angular/src/lib/components/date-range/standard/standard.component.ts` (+ `.html`)
- Standard modal: `packages/shared/angular/src/lib/components/date-range/standard/standard-modal.component.ts` (+ `.html`)
- Preset: `packages/shared/angular/src/lib/components/date-range/preset/preset.component.ts` (+ `.html`, `preset-classes.util.ts`)
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
