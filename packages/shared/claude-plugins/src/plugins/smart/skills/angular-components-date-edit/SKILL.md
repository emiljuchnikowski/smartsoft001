---
name: angular-components-date-edit
description: Date edit component API and usage patterns for @smartsoft001/angular. Includes ready-to-use <smart-date-edit> and extensible base class.
user-invocable: false
---

# Date Edit Component

Digit-by-digit date input editor (DD-MM-RRRR format) with auto-navigation, validation, and `ControlValueAccessor` support.

This component has both a **default concrete implementation** (`<smart-date-edit>`) and an **abstract base class** for custom extensions.

## Default Component Usage

### Selector

`<smart-date-edit>`

### Import

```typescript
import { DateEditDefaultComponent } from '@smartsoft001/angular';
```

### Properties

| Property      | Type                     | Default        | Description                       |
| ------------- | ------------------------ | -------------- | --------------------------------- |
| `ngModel`     | `ModelSignal<string>`    | `'2001-01-01'` | Date value in `YYYY-MM-DD` format |
| `validChange` | `OutputEmitter<boolean>` | -              | Emits on validity change          |

### Usage

```html
<smart-date-edit [(ngModel)]="dateValue"></smart-date-edit>
<smart-date-edit formControlName="birthDate"></smart-date-edit>
<smart-date-edit
  [(ngModel)]="dateValue"
  (validChange)="onValid($event)"
></smart-date-edit>
```

### Features

- 8 individual digit inputs (DD + MM + YYYY)
- Auto-focus to next field on input
- Moment.js validation
- Invalid state: red border + red text
- Dark mode support
- `ControlValueAccessor` for forms

## Base Class API (for Extension)

### Import

```typescript
import { DateEditBaseComponent } from '@smartsoft001/angular';
```

### Key Members

| Member         | Type                     | Description                                 |
| -------------- | ------------------------ | ------------------------------------------- |
| `ngModel`      | `ModelSignal<string>`    | Date value (`YYYY-MM-DD`)                   |
| `validDate`    | `boolean`                | Whether current value is a valid date       |
| `validChange`  | `OutputEmitter<boolean>` | Emits on validity change                    |
| `d1/d2`        | `string` (get/set)       | Day digit accessors (index 8, 9)            |
| `m1/m2`        | `string` (get/set)       | Month digit accessors (index 5, 6)          |
| `y1/y2/y3/y4`  | `string` (get/set)       | Year digit accessors (index 0-3)            |
| `moveTo()`     | method                   | Handles keyup: validates digit, moves focus |
| `select()`     | method                   | Selects input content for overwrite         |
| `writeValue()` | method                   | `ControlValueAccessor` — sets value         |

### Extending

```typescript
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateEditBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-date-edit',
  templateUrl: './my-date-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyDateEditComponent),
      multi: true,
    },
  ],
})
export class MyDateEditComponent extends DateEditBaseComponent {}
```

## File Locations

- Base class: `packages/shared/angular/src/lib/components/date-edit/base/base.component.ts`
- Default component: `packages/shared/angular/src/lib/components/date-edit/default/default.component.ts`
- Default template: `packages/shared/angular/src/lib/components/date-edit/default/default.component.html`
- Tests: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.stories.ts`

## Tailwind Classes

All classes use `smart:` prefix. Inputs: `smart:w-8 smart:h-10 smart:text-center smart:border smart:rounded-md`. Invalid: `smart:border-red-500 smart:text-red-600`. Dark: `dark:smart:bg-gray-800 dark:smart:text-white`.
