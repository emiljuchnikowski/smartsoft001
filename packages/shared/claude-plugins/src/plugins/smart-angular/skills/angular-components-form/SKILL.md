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

Main wrapper. Holds all reactive-form logic: builds the form via `FormFactory` (or takes `options.control`), disables it while `loading$` emits `true`, wraps the body in a `<form>` that emits `invokeSubmit` on submit and on Enter (`keyup.enter`), and emits `valueChange`, `valuePartialChange` and `validChange` from its own subscription to the form group. Renders `FormStandardComponent` by default. When `FORM_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passing `options`, the built `form` and the class, and re-emitting the body's `invokeSubmit`.

### FormStandardComponent (`<smart-form-standard>`)

Default concrete implementation. A container with dividers that renders one `<smart-input>` per control of the form (skipping missing and `__smartDisabled` controls), with the field's `possibilities` and `inputComponents` entry.

### FormBaseComponent (abstract)

Abstract base directive. Extend it to build custom form implementations. It exposes:

- inputs `form` (`UntypedFormGroup`, required), `options` (`IFormOptions<T>`, required) and `cssClass` (alias `class`)
- the `invokeSubmit` output (`OutputEmitterRef<any>`) and `submit()`, which emits it with the form value
- `fields` (the keys of `form.controls`), `model`, `mode` (`''` when unset), `possibilities`, `inputComponents`, `treeLevel`, all read from the inputs
- `getUntypedFormControl(field)` and the hooks `afterSetForm()` and `afterSetOptions()`

## API

### Inputs

| Input     | Type                           | Default    | Description                                                     |
| --------- | ------------------------------ | ---------- | --------------------------------------------------------------- |
| `options` | `InputSignal<IFormOptions<T>>` | _required_ | The model, the mode and the other form options                  |
| `class`   | `InputSignal<string>`          | `''`       | Classes on the body container (`cssClass` input, alias `class`) |

### Outputs

| Output               | Type                           | Description                                                                               |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| `invokeSubmit`       | `OutputEmitterRef<T>`          | Emits the form value (`form.value`) on submit and on Enter.                               |
| `valueChange`        | `OutputEmitterRef<T>`          | Emits the full form value on every change, and once when the form is ready                |
| `valuePartialChange` | `OutputEmitterRef<Partial<T>>` | Emits the values of the dirty controls (`<key>Confirm` controls left out) on every change |
| `validChange`        | `OutputEmitterRef<boolean>`    | Emits form validity on every change                                                       |

`<smart-form>` does not block the submit of an invalid form: keep `validChange` in state and check it before saving.

### IFormOptions

| Field             | Type                                                                               | Default    | Description                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `model`           | `T`                                                                                | required   | The model instance (a `@Model` class); the factory builds one control per `@Field` the mode includes.                           |
| `show`            | `boolean`                                                                          | required   | Required by the type; not read by the built-in implementations (pass `true`).                                                   |
| `mode`            | `'create' \| 'update' \| string`                                                   | `'create'` | Which fields and which mode options the factory uses. The inputs merge the options of the mode they receive (`''` without one). |
| `control`         | `AbstractControl`                                                                  | -          | A ready form group; without it the form is built from `model` by `FormFactory`.                                                 |
| `loading$`        | `Observable<boolean>`                                                              | -          | Disables the whole form while it emits `true`, enables it on `false`.                                                           |
| `uniqueProvider`  | `(values: Record<keyof T, any>) => Promise<boolean>`                               | -          | Async check of `unique` fields, passed to the factory.                                                                          |
| `possibilities`   | `{ [key: string]: WritableSignal<{ id: any; text: string; checked: boolean }[]> }` | `{}`       | Options of choice fields (`radio`, `check`, `enum`, ...), by field key.                                                         |
| `inputComponents` | `{ [key: string]: InputBaseComponentType<T> }`                                     | `{}`       | Field components by field key, used instead of the type's component.                                                            |
| `treeLevel`       | `number`                                                                           | `1`        | Nesting depth; written to the host as the `tree-level` attribute.                                                               |
| `fieldOptions`    | `IFieldOptions`                                                                    | -          | Not read by the built-in implementations; available to a custom implementation.                                                 |
| `modelOptions`    | `IModelOptions`                                                                    | -          | Not read by the built-in implementations; available to a custom implementation.                                                 |

```typescript
interface IFormOptions<T> {
  model: T; // Model instance (decorated with @Model / @Field)
  show: boolean; // Required by the type, not read
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
  fieldOptions?: IFieldOptions; // Not read by the built-in implementations
  modelOptions?: IModelOptions; // Not read by the built-in implementations
}
```

### FORM_STANDARD_COMPONENT_TOKEN

```typescript
import { FORM_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `FormStandardComponent` with a custom implementation. Provide a `Type<FormBaseComponent<T>>`; it renders inside the wrapper's `<form>`, so a `type="submit"` button submits it.

```typescript
providers: [
  { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: MyCustomFormComponent },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBaseComponent, InputComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-form',
  template: `
    <div [class]="cssClass()">
      @for (field of fields; track field) {
        <div class="my-field-row">
          <smart-input
            [options]="{
              treeLevel: treeLevel ?? 0,
              fieldKey: field,
              control: getUntypedFormControl(field),
              model: model,
              mode: mode,
            }"
          />
        </div>
      }
      <button type="submit">Save</button>
    </div>
  `,
  imports: [InputComponent],
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

## Preset

`FormPresetComponent` (`<smart-form-preset>`) is a styled, drop-in replacement for `FormStandardComponent`. It extends the standard component and reuses all of its logic (field iteration, statuses, submit-on-enter, and the value/valid/partial outputs on the wrapper). The preset only restyles the **shell**: the form root gets a vertical rhythm (`smart:space-y-5`) and each field row is wrapped in a `data-role="field"` element (with the field key on `data-key`); the root carries `data-role="form"`.

**The form preset does NOT restyle field internals.** Each field is still rendered by `<smart-input>`, so to get the full styled look, register the input presets alongside it: provide `FormPresetComponent` for `FORM_STANDARD_COMPONENT_TOKEN` and `INPUT_PRESET_FIELD_COMPONENTS` for `INPUT_FIELD_COMPONENTS_TOKEN`, or register every preset at once with `provideSmartPresets()`.

```typescript
import {
  FormPresetComponent,
  FORM_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';
import {
  INPUT_FIELD_COMPONENTS_TOKEN,
  INPUT_PRESET_FIELD_COMPONENTS,
} from '@smartsoft001/angular';

providers: [
  { provide: FORM_STANDARD_COMPONENT_TOKEN, useValue: FormPresetComponent },
  {
    provide: INPUT_FIELD_COMPONENTS_TOKEN,
    useValue: INPUT_PRESET_FIELD_COMPONENTS,
  },
];
```

Providing only `FORM_STANDARD_COMPONENT_TOKEN` restyles the form layout but leaves the inputs in their default look. The preset keeps the inherited `class` alias, so `<smart-form class="…">` still lands external classes on the form root.

## Reference implementation

The example application under `docs/examples/app` never places `<smart-form>` by hand: the CRUD item page renders it from the `@Field` metadata, and the pieces below are what the form reads in any application.

- `docs/examples/app/libs/model/src/lib/note.model.ts`: the `@Field` decorators the form is generated from, with `create` and `update` flags per mode, `required` repeated per mode and `focused` on the first input.
- `docs/examples/app/apps/web/src/app/app.config.ts`: `MODEL_VALIDATORS_PROVIDER` registered even though the app adds no validators of its own, because the form factory injects it without a default and the form does not render without it.
- `docs/examples/app/apps/web/src/app/app.config.spec.ts`: the test that the provider hands the base validators implied by the metadata back to the factory.
- `docs/examples/app/apps/web/src/app/translations.ts`: the `MODEL.<key>` labels the rendered inputs show.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/form/form.component.ts`
- Standard: `packages/shared/angular/src/lib/components/form/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/form/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/form/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`FORM_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IFormOptions`)
- Stories: `packages/shared/angular/src/lib/components/form/form.component.stories.ts`
