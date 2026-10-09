---
name: react-components-form
description: SmartForm React component API (@smartsoft001/react) — model-driven form built from @Model/@Field metadata by the form factory (IFormOptions with model, mode, control, loading, possibilities, inputComponents), onInvokeSubmit/onValueChange/onValuePartialChange/onValidChange, the 'form' registry key, SmartFormPreset and the useFormBase hook for custom form bodies.
user-invocable: false
---

# Form (`SmartForm`)

`SmartForm` turns a model instance into a form. It asks the provider's `FormFactory` for a form of `options.model` in `options.mode` (`'create'` by default): one control per `@Field` the mode includes, with the validators the field options call for (see `react-forms`). Then it renders a body (the component registered under the `form` key, `SmartFormStandard` by default) with one `SmartInput` per control, and reports the value as the user types. Submitting, or pressing Enter in a single-line input, calls `onInvokeSubmit(value)` once. Pass a form you built yourself as `options.control` to skip the factory.

## When to Use This Skill

- Rendering a create / edit form for a model decorated with `@Model` / `@Field`
- Reacting to submit, to every change, to the changed fields only, or to validity
- Disabling the form while saving (`options.loading`)
- Overriding the editor of one field (`options.inputComponents`) or supplying radio / check options (`options.possibilities`)
- Restyling the form body (the `form` registry key, `SmartFormPreset`) or writing one on `useFormBase`

## Exports

All from `@smartsoft001/react`.

| Export              | Kind      | What it is                                                                                                                                                        |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartForm`         | component | The form of `options.model`, built by the form factory for `options.mode` (`'create'` by default) with `options.uniqueProvider`, or `options.control` when given. |
| `SmartFormPreset`   | component | Styled form variation (preset).                                                                                                                                   |
| `SmartFormStandard` | component | The default form body: one input per control.                                                                                                                     |
| `useFormBase`       | hook      | What every form body shares: the fields to render, the options every input gets and `submit()`.                                                                   |

The preset's class helpers (`getFormShellClasses`, `getFormFieldClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartFormProps<T = any>`

The props of `<SmartForm>`.

| Prop                    | Type                          | Default  | Description                                      |
| ----------------------- | ----------------------------- | -------- | ------------------------------------------------ |
| `options`               | `IFormOptions<T>`             | required | The model, the mode and the other form options.  |
| `className?`            | `string`                      | —        | Classes of the body container.                   |
| `onInvokeSubmit?`       | `(value: any) => void`        | —        | The form value, on submit or Enter.              |
| `onValueChange?`        | `(value: T) => void`          | —        | The form value after every change.               |
| `onValuePartialChange?` | `(value: Partial<T>) => void` | —        | The dirty controls' values, `*Confirm` left out. |
| `onValidChange?`        | `(valid: boolean) => void`    | —        | The form validity after every change.            |

### `SmartFormBaseProps<T = any>`

The props of a form body: `SmartFormStandard`, `SmartFormPreset` or an implementation registered as `components.form`.

| Prop              | Type                   | Default  | Description                                                            |
| ----------------- | ---------------------- | -------- | ---------------------------------------------------------------------- |
| `form`            | `SmartFormGroup`       | required | The built form group.                                                  |
| `options`         | `IFormOptions<T>`      | required | The form options (`treeLevel` defaulted to 1).                         |
| `className?`      | `string`               | —        | Classes of the body container.                                         |
| `onInvokeSubmit?` | `(value: any) => void` | —        | Call with the form value to submit (what `useFormBase().submit` does). |

### `IFormOptions<T>`

| Field              | Type                                                 | Default    | Description                                                                                                                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model`            | `T`                                                  | required   | The model instance (a `@Model` class); a new instance builds a new form.                                                                                                                                                                                                     |
| `show`             | `boolean`                                            | required   | Required by the type; `SmartForm` does not read it (pass `true`).                                                                                                                                                                                                            |
| `treeLevel?`       | `number`                                             | —          | Nesting depth; `SmartForm` defaults it to 1 and writes it as `tree-level` / `data-tree-level`.                                                                                                                                                                               |
| `control?`         | `SmartAbstractControl`                               | —          | A ready form; without it the form is built from `model` by the form factory.                                                                                                                                                                                                 |
| `mode?`            | `'create' \| 'update' \| string`                     | `'create'` | Which fields and which mode options the factory uses: `create`, `update`, `multiUpdate` or a custom mode from `customs`. Pass it explicitly: the inputs merge the options of the mode they receive, and without `mode` they get none (the form is still built for `create`). |
| `loading?`         | `boolean`                                            | —          | Disables the whole form while `true`.                                                                                                                                                                                                                                        |
| `uniqueProvider?`  | `(values: Record<keyof T, any>) => Promise<boolean>` | —          | Async check of `unique` fields; resolve `false` to report `invalidUnique`.                                                                                                                                                                                                   |
| `possibilities?`   | `{ [key: string]: SmartPossibility[]; }`             | `{}`       | Options of `radio`, `check`, `enum` or `strings` fields, by field key.                                                                                                                                                                                                       |
| `inputComponents?` | `{ [key: string]: InputComponentType<T>; }`          | `{}`       | Field components by field key, used instead of the type's component.                                                                                                                                                                                                         |
| `fieldOptions?`    | `IFieldOptions`                                      | —          | Declared; `SmartForm` does not read it.                                                                                                                                                                                                                                      |
| `modelOptions?`    | `IModelOptions`                                      | —          | Declared; `SmartForm` does not read it.                                                                                                                                                                                                                                      |

### Related types

- `InputComponentType<T = any>`: `ComponentType<any>` — A field component (takes `SmartInputFieldProps`).

`SmartPossibility`, `SmartAbstractControl`, `SmartFormGroup` are described in the `react-forms` and `react-provider` skills.

## Callbacks

| Callback               | When                                                                                                         | Value                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `onInvokeSubmit`       | Form submit, or Enter in a single-line input (not in a textarea, the rich-text editor, a button or a select) | `form.value` (disabled controls left out)                          |
| `onValueChange`        | After every change, and once when the form is ready                                                          | `form.value`                                                       |
| `onValuePartialChange` | After every change, and once when the form is ready                                                          | The values of the dirty controls, `<key>Confirm` controls left out |
| `onValidChange`        | After every change, and once when the form is ready                                                          | `form.valid`                                                       |

`SmartForm` does not block the submit of an invalid form: check validity yourself (keep `onValidChange` in state, or build the form with `useModelForm` and call `form.markAllAsTouched()` before reading `form.valid`). Only the latest callbacks are used, so inline functions are fine.

## Nested forms

`object` and `array` fields render a nested `SmartForm` one tree level deeper. A nested form renders a `<div>` instead of a `<form>` (HTML does not allow nested forms), and Enter in its inputs submits the outer form.

## Labels

Field labels come from the `modelLabelProvider` of `SmartProvider`, or from the translation of `MODEL.<fieldKey>`: add those keys to `translations` (see `react-provider`).

## Usage

The standard body renders no submit button: the form submits on Enter, and a button of your own reads the value kept from `onValueChange`.

```tsx
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartButton, SmartForm } from '@smartsoft001/react';

@Model({})
export class Contact {
  @Field({
    type: FieldType.text,
    create: { required: true },
    update: { required: true },
    focused: true,
  })
  name!: string;

  @Field({ type: FieldType.email, create: true, update: true })
  email!: string;

  @Field({
    type: FieldType.radio,
    create: true,
    update: true,
    possibilities: { phone: 'phone', email: 'email' },
  })
  preferred!: string;
}

export function ContactForm({
  contact,
  onSave,
}: {
  contact?: Contact;
  onSave: (value: Contact) => Promise<void>;
}) {
  // One model instance per form: a new instance rebuilds the form.
  const [model] = useState(() => contact ?? new Contact());
  const [value, setValue] = useState<Contact | null>(null);
  const [valid, setValid] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (current: Contact | null) => {
    if (!current || !valid) return;
    setSaving(true);
    try {
      await onSave(current);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SmartForm
        options={{
          model,
          mode: contact ? 'update' : 'create',
          show: true,
          loading: saving,
          possibilities: {
            preferred: [
              { id: 'phone', text: 'Phone', checked: false },
              { id: 'email', text: 'Email', checked: false },
            ],
          },
        }}
        onValueChange={setValue}
        onValidChange={setValid}
        onInvokeSubmit={(submitted) => void save(submitted as Contact)}
      />
      <SmartButton
        options={{ click: () => void save(value), loading: saving }}
        disabled={!valid}
      >
        Save
      </SmartButton>
    </>
  );
}
```

The labels are the translations of `MODEL.name`, `MODEL.email` and `MODEL.preferred` (add them to the `translations` of `SmartProvider`, see `react-provider`).

## Replacing the Implementation

`SmartForm` renders the body registered under the `'form'` key of `SmartProvider`'s `components`, and `SmartFormStandard` when nothing is registered. The body gets `SmartFormBaseProps` (the built `form`, the options, `className`, `onInvokeSubmit`); `SmartForm` itself keeps building the form, the `<form>` element, the callbacks and `loading`.

`SmartFormPreset` restyles only the **shell** (vertical rhythm, a `data-role="field"` wrapper with `data-key` per row, `data-role="form"` on the root). The fields keep their look unless the input presets are registered too, so register both:

```tsx
import type { ReactNode } from 'react';

import {
  INPUT_PRESET_FIELD_COMPONENTS,
  SmartFormPreset,
  SmartProvider,
} from '@smartsoft001/react';

const components = { form: SmartFormPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      components={components}
      inputFieldComponents={INPUT_PRESET_FIELD_COMPONENTS}
    >
      {children}
    </SmartProvider>
  );
}
```

`SMART_PRESET_COMPONENTS` registers both at once (see `react-provider`).

### The `useFormBase` hook

What every form body shares: the fields to render, the options every input gets and `submit()`. The body re-renders on every change of the form, so a field added or removed by an `enabled` specification shows up at once. Bodies render a field when `form.controls[field]` exists and is not `smartDisabled`.

```ts
function useFormBase<T>({
  form,
  options,
  onInvokeSubmit,
}: SmartFormBaseProps<T>);
```

| Returns           | Type                                                   | Description                                                                                                                                                |
| ----------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fields`          | `string[]`                                             | The control keys to render, in model order (a control removed and re-added by an `enabled` specification keeps its place; `<key>Confirm` follows `<key>`). |
| `model`           | `T`                                                    | `options.model`.                                                                                                                                           |
| `mode`            | `string`                                               | `options.mode`, `''` when unset.                                                                                                                           |
| `possibilities`   | `{ [key: string]: SmartPossibility[]; }`               | `options.possibilities ?? {}`.                                                                                                                             |
| `inputComponents` | `{ [key: string]: InputComponentType<T>; }`            | `options.inputComponents ?? {}`.                                                                                                                           |
| `treeLevel`       | `number \| undefined`                                  | `options.treeLevel`.                                                                                                                                       |
| `submit`          | `() => void \| undefined`                              | Emits `onInvokeSubmit` with the form value.                                                                                                                |
| `getControl`      | `(field: string) => SmartAbstractControl \| undefined` | The control of `field`.                                                                                                                                    |

A form body receives the built `form` and the options; `useFormBase` gives the fields to render and `submit()`:

```tsx
import type { ReactNode } from 'react';

import {
  SmartFormBaseProps,
  SmartInput,
  SmartProvider,
  useFormBase,
} from '@smartsoft001/react';

export function TwoColumnFormBody<T>(props: SmartFormBaseProps<T>) {
  const {
    fields,
    model,
    mode,
    possibilities,
    inputComponents,
    treeLevel,
    getControl,
    submit,
  } = useFormBase(props);

  return (
    <div
      className={['grid grid-cols-2 gap-4', props.className]
        .filter(Boolean)
        .join(' ')}
    >
      {fields.map((field) => {
        const control = getControl(field);

        if (!control || control.smartDisabled) return null;

        return (
          <SmartInput
            key={field}
            options={{
              control,
              fieldKey: field,
              model,
              mode,
              treeLevel: treeLevel ?? 0,
              possibilities: possibilities[field],
              component: inputComponents[field],
            }}
          />
        );
      })}
      <button type="button" className="col-span-2" onClick={submit}>
        Save
      </button>
    </div>
  );
}

const components = { form: TwoColumnFormBody };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

A body skips controls that are missing or `smartDisabled` (fields an `enabled` specification turned off). It re-renders on every change of the form, so such fields appear and disappear at once.

## Styling

- `SmartFormStandard` stacks the fields with dividers (`smart:dark:` variants included); `className` is appended to the body container.

## File Locations

Source: `packages/shared/react/src/lib/components/form/` in the smartsoft001 repository.

- `form.tsx`: `SmartForm`
- `form.types.ts`: `SmartFormProps`, `SmartFormBaseProps`
- `preset/form-preset.tsx`: `SmartFormPreset`
- `standard/form-standard.tsx`: `SmartFormStandard`
- `use-form-base.ts`: `useFormBase`
- `form.stories.tsx`: Storybook stories
