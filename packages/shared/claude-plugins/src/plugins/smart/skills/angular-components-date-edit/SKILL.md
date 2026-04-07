---
name: angular-components-date-edit
description: Date edit component API and usage patterns for @smartsoft001/angular
user-invocable: false
---

# Date Edit Component

Digit-by-digit date input editor (DD-MM-RRRR format) with auto-navigation, validation, and `ControlValueAccessor` support.

## API

### Selector

`<smart-date-edit>`

### Properties

| Property      | Type                     | Default        | Description                       |
| ------------- | ------------------------ | -------------- | --------------------------------- |
| `ngModel`     | `ModelSignal<string>`    | `'2001-01-01'` | Date value in `YYYY-MM-DD` format |
| `validChange` | `OutputEmitter<boolean>` | -              | Emits on validity change          |

### Features

- 8 individual digit inputs (DD + MM + YYYY)
- Auto-focus to next field on input
- Moment.js validation
- Invalid state: red border + red text
- Dark mode support
- `ControlValueAccessor` for forms

## Usage

```html
<smart-date-edit [(ngModel)]="dateValue"></smart-date-edit>
<smart-date-edit formControlName="birthDate"></smart-date-edit>
```

## File Locations

- Component: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.ts`
- Template: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.html`
- Tests: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.stories.ts`

## Tailwind Classes

All classes use `smart:` prefix. Inputs: `smart:w-8 smart:h-10 smart:text-center smart:border smart:rounded-md`. Invalid: `smart:border-red-500 smart:text-red-600`. Dark: `dark:smart:bg-gray-800 dark:smart:text-white`.
