---
name: angular-components-form
description: Form component API with InjectionToken pattern for custom implementations. Renders a reactive form with dynamic inputs based on model decorators.
user-invocable: false
---

# Form Component

The `<smart-form>` component renders a reactive form driven by `@Field()` model decorators. It is a wrapper that delegates to `FormStandardComponent` by default and can be replaced via `FORM_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to render an editable form for an entity using model decorators
- Developer asks about `<smart-form>` or `FormComponent`
- Developer wants to provide a custom layout for the standard form rendering
- Developer wants to use a pre-built `UntypedFormGroup` control with the form

## Components

### FormComponent (`<smart-form>`)

Main wrapper. Holds all reactive-form logic: builds the form via `FormFactory`, tracks `loading$`, and emits `valueChange`, `valuePartialChange`, and `validChange` outputs. Renders `FormStandardComponent` by default. When `FORM_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passing all inputs and outputs.

### FormStandardComponent (`<smart-form-standard>`)

Default concrete implementation. Generic Tailwind-styled container that iterates over `fields` and renders each via `<smart-input>` per control.

### FormBaseComponent (abstract)

Abstract base directive. Exposes `form` (`UntypedFormGroup`), `options`, `fields` (computed from `form.controls`), `model`, `mode`, `possibilities`, `inputComponents`, `cssClass`, and lifecycle hooks `submit()`, `afterSetForm()`, `afterSetOptions()`. Extend it to build custom form implementations.

## API

### Inputs

| Input     | Type                                     | Default    | Description                                            |
| --------- | ---------------------------------------- | ---------- | ------------------------------------------------------ |
| `options` | `InputSignal<IFormOptions<T>>`           | _required_ | Form configuration (model, mode, control, loading$, …) |
| `class`   | `InputSignal<string>` (alias `cssClass`) | `''`       | External CSS classes on the container                  |

### Outputs

| Output               | Type                           | Description                                      |
| -------------------- | ------------------------------ | ------------------------------------------------ |
| `invokeSubmit`       | `OutputEmitterRef<T>`          | Emits the form value when the form is submitted  |
| `valueChange`        | `OutputEmitterRef<T>`          | Emits the full form value on every change        |
| `valuePartialChange` | `OutputEmitterRef<Partial<T>>` | Emits only the changed portion of the form value |
| `validChange`        | `OutputEmitterRef<boolean>`    | Emits form validity on every change              |

### IFormOptions

```typescript
interface IFormOptions<T> {
  model: T; // Model instance (decorated with @Model / @Field)
  show: boolean; // Whether the form is visible
  treeLevel?: number; // Nesting depth in hierarchical forms
  control?: AbstractControl; // Pre-built form group — skips FormFactory when provided
  mode?: 'create' | 'update' | string; // Merges @Field({ create: … }) or { update: … } overrides
  loading$?: Observable<boolean>; // Shows loading state while true
  uniqueProvider?: (values: Record<keyof T, any>) => Promise<boolean>; // Async uniqueness check
  possibilities?: {
    [key: string]: WritableSignal<
      { id: any; text: string; checked: boolean }[]
    >;
  }; // Options for radio/check inputs keyed by field name
  inputComponents?: {
    [key: string]: InputBaseComponentType<T>;
  }; // Per-field component overrides keyed by field name
  fieldOptions?: IFieldOptions; // Additional @Field() metadata overrides
  modelOptions?: IModelOptions; // Additional @Model() metadata overrides
}
```

### FORM_STANDARD_COMPONENT_TOKEN

```typescript
import { FORM_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `FormStandardComponent` with a custom implementation. Provide a `Type<FormBaseComponent<T>>`.

```typescript
providers: [
  { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: MyCustomFormComponent },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBaseComponent } from '@smartsoft001/angular';
import { SmartInputComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-form',
  template: `
    <form [formGroup]="form" [class]="cssClass()" (ngSubmit)="submit()">
      @for (field of fields; track field.key) {
        <div class="my-field-row">
          <smart-input [options]="field.inputOptions"></smart-input>
        </div>
      }
      <button type="submit">Save</button>
    </form>
  `,
  imports: [SmartInputComponent],
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomFormComponent extends FormBaseComponent<any> {}
```

## Usage Examples

```html
<!-- Basic form -->
<smart-form
  [options]="{ model: userModel, show: true }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>

<!-- With external CSS class -->
<smart-form
  class="smart:p-4 smart:bg-white"
  [options]="{ model: userModel, show: true }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>

<!-- Update mode -->
<smart-form
  [options]="{ model: userModel, show: true, mode: 'update' }"
  (invokeSubmit)="onUpdate($event)"
  (validChange)="isValid = $event"
></smart-form>

<!-- With pre-built control (skips FormFactory) -->
<smart-form
  [options]="{ model: userModel, show: true, control: myFormGroup }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>

<!-- With loading state -->
<smart-form
  [options]="{ model: userModel, show: true, loading$: saving$ }"
  (invokeSubmit)="onSubmit($event)"
></smart-form>
```

## Field Rendering

Each field is rendered via `<smart-input>`. Per-field dispatch by `FieldType` is handled inside `<smart-input>` itself. See the `angular-components-input` skill for per-field details.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/form/form.component.ts`
- Standard: `packages/shared/angular/src/lib/components/form/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/form/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`FORM_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IFormOptions`)
- Stories: `packages/shared/angular/src/lib/components/form/form.component.stories.ts`
