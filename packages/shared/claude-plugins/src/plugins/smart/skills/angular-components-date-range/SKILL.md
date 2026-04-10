---
name: angular-components-date-range
description: Date range picker component API and usage patterns for @smartsoft001/angular
user-invocable: false
---

# Date Range Component

Date range picker with trigger button, modal calendar overlay, quick filter buttons, and `ControlValueAccessor` support.

## API

### Selector

`<smart-date-range>`

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

### Features

- Trigger button with calendar icon
- Clear button (X) to reset
- Modal overlay with calendar grid
- Quick filters: Today, Yesterday, Last 7/30 days, This/Last Month
- Range selection with start/end highlighting
- `ControlValueAccessor` for forms
- Dark mode

## Usage

```html
<smart-date-range [(ngModel)]="dateRange"></smart-date-range>
<smart-date-range formControlName="period"></smart-date-range>
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/date-range/date-range.component.ts`
- Trigger template: `packages/shared/angular/src/lib/components/date-range/date-range.component.html`
- Modal template: `packages/shared/angular/src/lib/components/date-range/date-range-modal.component.html`
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
