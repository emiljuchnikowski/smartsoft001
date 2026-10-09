---
name: angular-components-date-edit
description: Date edit component API and usage patterns for @smartsoft001/angular. Includes ready-to-use <smart-date-edit> and extensible base class.
user-invocable: false
---

# Date Edit Component

Date editor with two variations: the standard digit-by-digit input (DD-MM-RRRR, eight digit boxes) with auto-navigation and validation, and a preset calendar picker. Both support `[(ngModel)]` and `ControlValueAccessor` forms.

This component has a **wrapper** (`<smart-date-edit>`) that picks its variation through the `variant` input, and an **abstract base class** for custom extensions. It has no injection token.

## Default Component Usage

### Selector

`<smart-date-edit>`

### Import

```typescript
import { DateEditComponent } from '@smartsoft001/angular';
```

### Properties

| Property      | Type                     | Default        | Description                                                                                                                                |
| ------------- | ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `variant`     | `DateEditVariantName`    | `'standard'`   | `'standard'` renders `<smart-date-edit-standard>` (eight digit inputs); `'preset'` renders `<smart-date-edit-preset>` (a calendar picker). |
| `class`       | `string`                 | `''`           | Extra CSS classes on the rendered variation.                                                                                               |
| `ngModel`     | `ModelSignal<string>`    | `'2001-01-01'` | Date value in `YYYY-MM-DD` format. Written back after every edit, also when the edited date is not valid.                                  |
| `validChange` | `OutputEmitter<boolean>` | —              | Emits whether the edited date is valid, after every digit edit (standard) or picked day (preset).                                          |

`DateEditVariantName` is `'standard' | 'preset'`.

### Usage

```html
<smart-date-edit [(ngModel)]="dateValue"></smart-date-edit>
<smart-date-edit formControlName="birthDate"></smart-date-edit>
<smart-date-edit
  [(ngModel)]="dateValue"
  (validChange)="onValid($event)"
></smart-date-edit>
<smart-date-edit variant="preset" [(ngModel)]="dateValue"></smart-date-edit>
```

Both binding styles (`[(ngModel)]` and `formControlName`) work, with or without `FormsModule` in the consuming component. `<smart-date-edit>` renders from an internal signal rather than straight off `ngModel`, so when `FormsModule` is imported and Angular's own `NgModel` directive also matches the element, the `null` it seeds its `FormControl` with cannot leak back into your bound property. A bound form control receives every edit, also a date that is not valid: check `validChange` before using the value.

### Features of the standard variation

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

| Member                | Type                       | Description                                                                                                          |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `DEFAULT_DATE`        | `string`                   | `'2001-01-01'`: the initial `ngModel`, and the date a digit edit starts from when the value is empty                 |
| `ngModel`             | `ModelSignal<string>`      | Date value (`YYYY-MM-DD`)                                                                                            |
| `validDate`           | `boolean`                  | Whether the current value is a valid date (a plain field, not a signal)                                              |
| `validChange`         | `OutputEmitter<boolean>`   | Emits the validity after an edit                                                                                     |
| `d1/d2`               | `string \| null` (get/set) | Day digit accessors (index 8, 9)                                                                                     |
| `m1/m2`               | `string \| null` (get/set) | Month digit accessors (index 5, 6)                                                                                   |
| `y1/y2/y3/y4`         | `string \| null` (get/set) | Year digit accessors (index 0-3)                                                                                     |
| `propagateChange`     | `(val: any) => void`       | The form's change callback (set by `registerOnChange`); a digit edit passes the date, or `null` when it is not valid |
| `propagateTouched`    | `() => void`               | The form's touched callback (set by `registerOnTouched`)                                                             |
| `moveTo()`            | method                     | Handles keyup: validates digit, moves focus                                                                          |
| `select()`            | method                     | Selects input content for overwrite                                                                                  |
| `writeValue()`        | method                     | `ControlValueAccessor`: sets `ngModel` and runs change detection                                                     |
| `registerOnChange()`  | method                     | `ControlValueAccessor`: stores `propagateChange`                                                                     |
| `registerOnTouched()` | method                     | `ControlValueAccessor`: stores `propagateTouched`                                                                    |

A subclass registers itself as `NG_VALUE_ACCESSOR` to be usable with `formControlName`; the base implements every method the contract needs.

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

`<smart-date-edit>` has no injection token, so a custom implementation is used through its own selector in place of `<smart-date-edit>`.

## Variations

### DateEditStandardComponent (`<smart-date-edit-standard>`)

The default variation: eight number inputs bound to the digit accessors, with the invalid state in red. `<smart-date-edit>` renders it while `variant` is `'standard'`; it can also be used directly.

### DateEditPresetComponent (`<smart-date-edit-preset>`)

A fully-styled Preline single datepicker variation: a read-only trigger input plus a calendar popover. Drop-in replacement for the standard editor.

Unlike token-based components, `<smart-date-edit>` selects its variation through the `variant` input (NOT an `InjectionToken` / `NgComponentOutlet`), so `provideSmartPresets()` does not change it: set `variant="preset"` on each `<smart-date-edit>` that should render the preset, or use `<smart-date-edit-preset>` directly.

The preset extends `DateEditBaseComponent`, so it shares `ngModel` (`YYYY-MM-DD`), `validDate`, and `validChange`. Preline's JS plugin is not installed, so the popover (open/close, prev/next month, day selection) is driven entirely by Angular signals — no external runtime. Month/year pickers are native `<select>` elements styled to match Preline. Picking a day closes the popover, and so does a click outside the component.

```typescript
import { DateEditPresetComponent } from '@smartsoft001/angular';
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.ts`
- Base class: `packages/shared/angular/src/lib/components/date-edit/base/base.component.ts`
- Standard component: `packages/shared/angular/src/lib/components/date-edit/standard/standard.component.{ts,html}`
- Preset component: `packages/shared/angular/src/lib/components/date-edit/preset/preset.component.{ts,html}` + `preset/preset-classes.util.ts` (internal)
- Tests: `packages/shared/angular/src/lib/components/date-edit/{date-edit,base/base,preset/preset}.component.spec.ts`
- Stories: `packages/shared/angular/src/lib/components/date-edit/date-edit.component.stories.ts`

## Tailwind Classes

All classes use `smart:` prefix. Standard inputs: `smart:w-8 smart:h-10 smart:text-center smart:border smart:rounded-md`. Invalid: `smart:border-red-500 smart:text-red-600`. Dark: `smart:dark:bg-gray-800 smart:dark:text-white`.
