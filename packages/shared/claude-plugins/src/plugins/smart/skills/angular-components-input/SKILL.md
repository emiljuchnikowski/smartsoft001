---
name: angular-components-input
description: Input field component with InjectionToken pattern for per-FieldType substitution.
user-invocable: false
---

# Input Component

The `<smart-input>` component renders a form input for a single model field by delegating to a sub-component chosen by `FieldType`. It selects a sub-component based on the `FieldType` resolved from `@Field()` decorator metadata via an internal `baseMap` and an optional `extendMap` injected via `INPUT_FIELD_COMPONENTS_TOKEN`. Shows error messages via `<smart-input-error>` when the control is touched and invalid.

## When to Use This Skill

- Developer wants to use or customize the input field component
- Developer asks about `<smart-input>` or `InputComponent`
- Developer wants to extend `InputBaseComponent` for a custom sub-component

## Components

### InputComponent (`<smart-input>`)

Main wrapper component. Resolves `fieldOptions` from `@Field()` decorator metadata on the model, then selects a sub-component from `baseMap` (or `extendMap` override) based on `fieldOptions.type` and renders it via `NgComponentOutlet`. Also renders an inline info button when `fieldOptions.info` is set and a loader while `control.status === 'PENDING'`. Below the input, renders `<smart-input-error>` when `control.errors` are present and the control has been touched.

### InputBaseComponent (abstract)

Abstract base directive for all input sub-components. Provides:

- `options: InputSignal<InputOptions<T>>` — field configuration (control, fieldKey, model, treeLevel, possibilities, component)
- `fieldOptions: InputSignal<IFieldOptions | undefined>` — resolved field decorator metadata
- `cssClass: InputSignal<string>` (alias `class`) — external CSS classes
- `internalOptions`, `control`, `required`, `possibilities` — populated via `effect` when options change
- `afterSetOptionsHandler()` — hook invoked after options resolve, used by sub-components for validator/possibilities setup
- `formControl`, `formControlArray`, `formControlGroup` — typed accessors for `control`

### InputPossibilitiesBaseComponent (abstract)

Extends `InputBaseComponent` for sub-components that need list possibilities (radio, check). Injects `MODEL_POSSIBILITIES_PROVIDER` and auto-refreshes possibilities on parent control changes.

### Default Sub-Components

| FieldType       | Sub-component                 | Selector                      | Description                                           |
| --------------- | ----------------------------- | ----------------------------- | ----------------------------------------------------- |
| `text`          | `InputTextComponent`          | `smart-input-text`            | Plain text input                                      |
| `email`         | `InputEmailComponent`         | `smart-input-email`           | Email input                                           |
| `password`      | `InputPasswordComponent`      | `smart-input-password`        | Password input + optional `<smart-password-strength>` |
| `nip`           | `InputNipComponent`           | `smart-input-nip`             | NIP with built-in `invalidNip` validator              |
| `pesel`         | `InputPeselComponent`         | `smart-input-pesel`           | PESEL text input                                      |
| `int`           | `InputIntComponent`           | `smart-input-int`             | Integer input (`type="number" step="1"`)              |
| `float`         | `InputFloatComponent`         | `smart-input-float`           | Decimal input (`type="number" step="0.01"`)           |
| `currency`      | `InputCurrencyComponent`      | `smart-input-currency`        | Currency input (`type="number" step="0.01"`)          |
| `phoneNumber`   | `InputPhoneNumberComponent`   | `smart-input-phone-number`    | Telephone input                                       |
| `phoneNumberPl` | `InputPhoneNumberPlComponent` | `smart-input-phone-number-pl` | Telephone input + built-in length(9) validator        |
| `longText`      | `InputLongTextComponent`      | `smart-input-long-text`       | Rich text editor (`ngx-editor`)                       |
| `date`          | `InputDateComponent`          | `smart-input-date`            | HTML date input (`type="date"`)                       |
| `dateWithEdit`  | `InputDateWithEditComponent`  | `smart-input-date-with-edit`  | Digit-by-digit date via `<smart-date-edit>`           |
| `dateRange`     | `InputDateRangeComponent`     | `smart-input-date-range`      | Date range via `<smart-date-range>`                   |
| `flag`          | `InputFlagComponent`          | `smart-input-flag`            | Single checkbox                                       |
| `radio`         | `InputRadioComponent`         | `smart-input-radio`           | Radio group (from possibilities)                      |
| `check`         | `InputCheckComponent`         | `smart-input-check`           | Checkbox group (from possibilities)                   |
| `enum`          | `InputEnumComponent`          | `smart-input-enum`            | Multi-select checkboxes from enum                     |
| `color`         | `InputColorComponent`         | `smart-input-color`           | Color picker (`ngx-color-picker`)                     |
| `logo`          | `InputLogoComponent`          | `smart-input-logo`            | Image upload with inline preview                      |
| `address`       | `InputAddressComponent`       | `smart-input-address`         | Nested `FormGroup` (city/zip/street/building/flat)    |
| `object`        | `InputObjectComponent`        | `smart-input-object`          | Nested form via `FORM_COMPONENT_TOKEN`                |
| `array`         | `InputArrayComponent`         | `smart-input-array`           | Dynamic array of nested forms                         |
| `ints`          | `InputIntsComponent`          | `smart-input-ints`            | Dynamic list of integer inputs                        |
| `strings`       | `InputStringsComponent`       | `smart-input-strings`         | Dynamic list of string inputs                         |
| `file`          | `InputFileComponent`          | `smart-input-file`            | Generic file chooser                                  |
| `attachment`    | `InputAttachmentComponent`    | `smart-input-attachment`      | File upload (any type) with download/delete           |
| `image`         | `InputImageComponent`         | `smart-input-image`           | Image upload with preview                             |
| `pdf`           | `InputPdfComponent`           | `smart-input-pdf`             | PDF upload with show/delete                           |
| `video`         | `InputVideoComponent`         | `smart-input-video`           | Video upload with play/delete                         |

## API

### InputComponent Inputs

| Input     | Type                                        | Default  | Description         |
| --------- | ------------------------------------------- | -------- | ------------------- |
| `options` | `InputSignal<InputOptions<T> \| undefined>` | optional | Field configuration |

### InputOptions

```typescript
type InputOptions<T> = IInputOptions & IInputFromFieldOptions<T>;

interface IInputOptions {
  treeLevel: number;
  control: UntypedFormControl | UntypedFormArray;
  possibilities?: WritableSignal<{ id: any; text: string; checked: boolean }[]>;
  component?: Type<InputBaseComponent<any>>; // per-call inline override
}

interface IInputFromFieldOptions<T> {
  model: T;
  fieldKey: string;
  mode?: 'create' | 'update' | string;
}
```

**Notes:**

- `fieldKey` ending with `Confirm` is stripped — confirm variants share the original field's `@Field()` metadata.
- `mode` === `'create'` or `'update'` merges the matching `@Field({ create: … })` / `@Field({ update: … })` override into the resolved `fieldOptions`.
- If `options.component` is provided, it overrides everything (both `baseMap` and token).

### INPUT_FIELD_COMPONENTS_TOKEN

```typescript
import { INPUT_FIELD_COMPONENTS_TOKEN } from '@smartsoft001/angular';
import { FieldType } from '@smartsoft001/models';
```

`InjectionToken<Partial<Record<FieldTypeDef, Type<InputBaseComponent<any>>>>>` — allows substituting a sub-component for any field type.

```typescript
providers: [
  {
    provide: INPUT_FIELD_COMPONENTS_TOKEN,
    useValue: {
      [FieldType.text]: MyCustomTextInputComponent,
      [FieldType.image]: MyCustomImageUploaderComponent,
    },
  },
];
```

Maps are merged (`{ ...baseMap, ...extendMap }`), so only selected types need to be overridden.

## Extending the Base Class

```typescript
import { Component, computed } from '@angular/core';
import { InputBaseComponent } from '@smartsoft001/angular';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-input-text',
  template: `
    @if (control) {
      <label [class]="labelClasses()">
        {{
          control?.parent?.value
            | smartModelLabel
              : internalOptions.fieldKey
              : internalOptions?.model?.constructor
        }}
        @if (required) {
          <span>*</span>
        }
      </label>
      <input type="text" [formControl]="formControl" [class]="inputClasses()" />
    }
  `,
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class MyInputTextComponent extends InputBaseComponent<any> {
  labelClasses = computed(() => 'my-prefix-label ' + this.cssClass());
  inputClasses = computed(() => 'my-prefix-input ' + this.cssClass());
}
```

## Usage Examples

```html
<!-- Direct usage -->
<smart-input [options]="inputOptions"></smart-input>

<!-- With custom class -->
<smart-input [options]="inputOptions" class="smart:mt-4"></smart-input>
```

```typescript
// In a component
import { UntypedFormControl } from '@angular/forms';
import { InputOptions } from '@smartsoft001/angular';

const control = new UntypedFormControl('');
this.inputOptions = {
  control,
  fieldKey: 'email',
  model: new UserModel(),
  treeLevel: 0,
} as InputOptions<UserModel>;
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/input/input.component.ts`
- Base: `packages/shared/angular/src/lib/components/input/base/base.component.ts`
- Possibilities base: `packages/shared/angular/src/lib/components/input/base/possibilities.component.ts`
- File base: `packages/shared/angular/src/lib/components/input/base/file.component.ts`
- Sub-components: `packages/shared/angular/src/lib/components/input/<name>/<name>.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`INPUT_FIELD_COMPONENTS_TOKEN`)
- Error component: `packages/shared/angular/src/lib/components/input/error/error.component.ts`
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`InputOptions`, `IInputOptions`, `IInputFromFieldOptions`)
