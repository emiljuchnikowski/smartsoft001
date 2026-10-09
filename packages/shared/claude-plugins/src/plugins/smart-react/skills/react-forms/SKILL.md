---
name: react-forms
description: The form engine of @smartsoft001/react without a form library — SmartFormControl / SmartFormGroup / SmartFormArray, SmartValidators and custom validators (error keys, customMessage), useControlState / useControlBinding for binding inputs, FormFactory and useModelForm that build a form from @Model/@Field metadata (modes, required, confirm, unique, enabled specifications, permissions, min/max/length possibilities) and IModelValidatorsProvider.
user-invocable: false
---

# Forms (`@smartsoft001/react`)

The forms of `@smartsoft001/react` do not depend on a form library. A form is a tree of controls (`SmartFormGroup` of `SmartFormControl`s and `SmartFormArray`s) that hold the value, run validators (sync and async), track `touched` / `dirty` and propagate their status to their parents. React reads them through hooks built on `useSyncExternalStore`. `FormFactory` builds such a tree from a model's `@Field` metadata, and `SmartForm` / `SmartInput` render it (see `react-components-form` and `react-components-input`).

## When to Use This Skill

- Building a form from a model (`useModelForm`, `FormFactory`) and reading its value and validity
- Describing fields with `@Field` so the factory creates the right controls and validators (modes, `required`, `confirm`, `unique`, `enabled`, `permissions`, `possibilities`)
- Writing a form or a field by hand with `SmartFormControl` and binding inputs (`useControlBinding`)
- Adding validators: `SmartValidators`, a custom function, an async check, or an `IModelValidatorsProvider`
- Understanding which error keys produce which input messages

## Controls

| Class                 | Constructor                                                         | Value                                          |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| `SmartFormControl<T>` | `new SmartFormControl(value = null, validators?, asyncValidators?)` | Its own value. `reset()` falls back to `null`. |
| `SmartFormGroup<T>`   | `new SmartFormGroup(controls = {}, validators?, asyncValidators?)`  | An object of its enabled children's values.    |
| `SmartFormArray<T>`   | `new SmartFormArray(controls = [], validators?, asyncValidators?)`  | An array of its enabled children's values.     |

Members shared by every control (`SmartAbstractControl`):

- State: `value`, `status` (`'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'`), `errors`, `valid`, `invalid`, `pending`, `disabled`, `enabled`, `touched` / `untouched`, `dirty` / `pristine`, `parent`, `root`.
- Changes: `setValue(value, { onlySelf?, emitEvent? })`, `patchValue`, `reset`, `getRawValue()` (includes disabled children), `updateValueAndValidity()`.
- Flags: `markAsTouched()`, `markAllAsTouched()`, `markAsUntouched()`, `markAsDirty()`, `markAsPristine()`, `disable()`, `enable()`.
- Validators: `setValidators`, `addValidators`, `removeValidators`, `hasValidator`, `clearValidators`, the same for async ones; `setErrors`, `getError(code, path?)`, `hasError(code, path?)`.
- Children: `get(path)` (`'address.city'` or `['items', 0]`); groups also `controls`, `addControl`, `removeControl`, `setControl`, `contains`; arrays `at`, `push`, `insert`, `removeAt`, `move`, `clear`, `length`.
- Events: `valueChanges`, `statusChanges` and `changes` are `SmartEmitter`s: `subscribe(listener)` returns `{ unsubscribe() }`.

Rules: a change recomputes the control's value and status, then its parent's, up to the root, so a group is `INVALID` while any child is and `PENDING` while any child waits for an async validator. Async validators run only once the sync ones pass; a newer run discards an older result, and a rejected validator marks the control invalid (`{ asyncValidator: true }`). A disabled control has no errors, does not count towards its parent's status and is left out of its parent's `value`.

## Validators

```ts
type SmartValidatorFn = (
  control: SmartAbstractControl,
) => SmartValidationErrors | null | undefined | void;
type SmartAsyncValidatorFn = (
  control: SmartAbstractControl,
) => Promise<SmartValidationErrors | null | undefined | void>;
```

`SmartValidators` has `required`, `requiredTrue`, `email`, `min(n)`, `max(n)`, `minLength(n)`, `maxLength(n)`, `pattern(re)` and `nullValidator`. They report the error keys the input messages read:

| Error key                            | Reported by                                                                        | Message (translation key)                                         |
| ------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `required`                           | `SmartValidators.required` / `requiredTrue`, `required: true` fields               | `INPUT.ERRORS.required`                                           |
| `confirm`                            | the `<key>Confirm` control of a `confirm` field                                    | `INPUT.ERRORS.confirm`                                            |
| `email`                              | `SmartValidators.email`, `email` fields                                            | `INPUT.ERRORS.invalidEmailFormat`                                 |
| `min` / `max`                        | `SmartValidators.min` / `max`, `possibilities.min` / `max`                         | `INPUT.ERRORS.invalidMin` / `invalidMax` + the limit              |
| `minlength` / `maxlength`            | `SmartValidators.minLength` / `maxLength`, `possibilities.minLength` / `maxLength` | `INPUT.ERRORS.invalidMinLength` / `invalidMaxLength` + the length |
| `phoneNumber`, `pesel`, `invalidNip` | the field types `phoneNumber`, `pesel`, `nip`                                      | `INPUT.ERRORS.invalid…Format` / `invalidNip`                      |
| `invalidUnique`                      | a `unique` field whose `uniqueProvider` resolved `false`                           | `INPUT.ERRORS.invalidUnique`                                      |
| `customMessage`                      | your validator: `{ customMessage: 'text' }`                                        | the text itself                                                   |

`pattern` reports `{ pattern: … }`, which has no message of its own: return `customMessage` from your own validator to show one.

```ts
import {
  SmartFormControl,
  SmartFormGroup,
  SmartValidatorFn,
  SmartValidators,
} from '@smartsoft001/react';

const noSpaces: SmartValidatorFn = (control) =>
  /\s/.test(String(control.value ?? ''))
    ? { customMessage: 'No spaces, please.' }
    : null;

export const signup = new SmartFormGroup({
  login: new SmartFormControl(
    '',
    [SmartValidators.required, SmartValidators.minLength(3), noSpaces],
    async (control) => {
      const taken = await fetch(
        `/api/logins/${encodeURIComponent(String(control.value))}`,
      ).then((r) => r.ok);
      return taken ? { customMessage: 'This login is taken.' } : null;
    },
  ),
  age: new SmartFormControl<number | null>(null, [SmartValidators.min(18)]),
});
```

## Binding inputs

- `useControlState(control)` returns the live `SmartControlState` (`value`, `status`, `errors`, `valid`, `invalid`, `pending`, `disabled`, `touched`, `dirty`, `required`) and re-renders on every change. `required` is `true` when the control's validators report `required` for an empty value (`isControlRequired`), which is how the inputs decide to show an asterisk.
- `useControlBinding(control)` adds `onChange(value)` (marks dirty, then sets the value, as a user edit) and `onBlur()` (marks touched).
- `useControlVersion(control)` only re-renders and returns a version number.

```tsx
import { SmartAbstractControl, useControlBinding } from '@smartsoft001/react';

export function BoundTextInput({
  control,
  label,
}: {
  control: SmartAbstractControl<string | null>;
  label: string;
}) {
  const { value, onChange, onBlur, errors, touched, required, disabled } =
    useControlBinding(control);

  return (
    <label>
      {label}
      {required && ' *'}
      <input
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {touched && errors?.['required'] && <small>Required</small>}
    </label>
  );
}
```

## Building a form from a model

```tsx
import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartButton, SmartForm, useModelForm } from '@smartsoft001/react';

@Model({})
export class Signup {
  @Field({
    type: FieldType.text,
    create: { required: true },
    possibilities: { minLength: 3, maxLength: 30 },
  })
  name!: string;

  @Field({ type: FieldType.email, create: { required: true }, unique: true })
  email!: string;

  @Field({
    type: FieldType.password,
    create: { required: true, confirm: true },
  })
  password!: string;

  @Field({ type: FieldType.flag, create: true })
  company!: boolean;

  // Only in the form while `company` is true.
  @Field({
    type: FieldType.nip,
    create: { required: true, enabled: { criteria: { company: true } } },
  })
  nip!: string;
}

const model = new Signup();

export function SignupForm({
  isEmailFree,
  onSignup,
}: {
  isEmailFree: (email: string) => Promise<boolean>;
  onSignup: (value: Signup) => void;
}) {
  const form = useModelForm(model, {
    mode: 'create',
    uniqueProvider: async (values) =>
      isEmailFree(String(values['email']).replace(/'/g, '')),
  });

  if (!form) return null; // the factory builds asynchronously

  return (
    <>
      <SmartForm
        options={{ model, mode: 'create', show: true, control: form }}
      />
      <SmartButton
        options={{
          click: () => {
            form.markAllAsTouched();
            if (form.valid) onSignup(form.value as Signup);
          },
        }}
      >
        Sign up
      </SmartButton>
    </>
  );
}
```

`useModelForm(model, { mode?, uniqueProvider?, control? })` asks the provider's `FormFactory` (`useFormFactory()`) for the form, keeps it in state and rebuilds it when the model or the mode changes; it is `null` until the first build settles. `FormFactory` also works outside React: `new FormFactory({ authService: { expectPermissions: () => true } }).create(model, { mode: 'create' })` resolves with the `SmartFormGroup`.

### What the factory reads

| `@Field` option                                      | Effect on the form                                                                                                                                                                                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create` / `update` (`true` or an object)            | The field is in the `create` / `update` form; an object is merged over the field's options for that mode.                                                                                                                                                            |
| `update: { multi: true }`                            | The field is in the `multiUpdate` form.                                                                                                                                                                                                                              |
| `customs: [{ mode, ... }]`                           | The field is in a custom mode's form.                                                                                                                                                                                                                                |
| `required`                                           | `SmartValidators.required` (an `address` group gets it on city, street, building number and zip code).                                                                                                                                                               |
| `type`                                               | `email`, `phoneNumber`, `pesel` add their checks; `object` becomes a nested group of the `classType` model, `array` an array of groups, `address` a group of its five parts (zip code checked). The `nip` and `phoneNumberPl` inputs add their checks when rendered. |
| `possibilities: { minLength, maxLength, min, max }`  | The matching `SmartValidators`.                                                                                                                                                                                                                                      |
| `confirm`                                            | A `<key>Confirm` control that must match (`confirm` error), re-checked when the original changes.                                                                                                                                                                    |
| `unique` (`true` or `{ withFields }`)                | An async check through `uniqueProvider(values)`: `values` holds the field (quoted with `'` unless it is an `int`) and the `withFields`.                                                                                                                              |
| `permissions`                                        | The field is left out when the user has none of them (`AuthService.expectPermissions`).                                                                                                                                                                              |
| `enabled` (a specification `{ criteria }`)           | The control is added and removed as the form value changes; `$root.<path>` in the criteria refers to the root form of a nested one. A removed control is marked `smartDisabled`.                                                                                     |
| `defaltValue` (spelled so in `@smartsoft001/models`) | A function giving the initial value when the model has none.                                                                                                                                                                                                         |
| `focused`                                            | The input autofocuses.                                                                                                                                                                                                                                               |

### Replacing validators per field

An `IModelValidatorsProvider` on `SmartProvider` (`modelValidatorsProvider`) is asked for every field, and what it returns **replaces** the derived validators, so return `options.base` to keep them:

```ts
import {
  IModelValidators,
  IModelValidatorsOptions,
  IModelValidatorsProvider,
  SmartValidatorFn,
  SmartValidators,
} from '@smartsoft001/react';

const toArray = (
  v: SmartValidatorFn | SmartValidatorFn[] | null | undefined,
): SmartValidatorFn[] => (Array.isArray(v) ? v : v ? [v] : []);

export class AppValidatorsProvider extends IModelValidatorsProvider {
  async get(options: IModelValidatorsOptions): Promise<IModelValidators> {
    // `options.type` is the model class (e.g. compare it with `Signup`), `options.instance` the model instance.
    if (options.type?.name === 'Signup' && options.key === 'name') {
      return {
        ...options.base,
        validators: [
          ...toArray(options.base?.validators),
          SmartValidators.pattern(/^[A-Za-z ]+$/),
        ],
      };
    }
    return options.base ?? {};
  }
}
```

## Exports

| Export                                                                                                                                          | What it is                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `SmartAbstractControl`, `SmartFormControl`, `SmartFormGroup`, `SmartFormArray`                                                                  | The controls.                                           |
| `SmartValidators`, `isControlRequired`                                                                                                          | Built-in validators; whether a control is required.     |
| `SmartValidatorFn`, `SmartAsyncValidatorFn`, `SmartValidationErrors`, `SmartValidatorResult`, `SmartControlStatus`, `SmartControlUpdateOptions` | Validator and control types.                            |
| `SmartEmitter`, `SmartSubscription`                                                                                                             | The event source of the controls.                       |
| `useControlState`, `useControlBinding`, `useControlVersion`, `SmartControlState`, `SmartControlBinding`                                         | React bindings.                                         |
| `FormFactory`, `IFormFactoryOptions`, `IFormFactoryDependencies`, `SmartUniqueProvider`                                                         | The model form builder.                                 |
| `useModelForm`, `IUseModelFormOptions`, `useFormFactory`                                                                                        | Building a form in a component; the provider's factory. |
| `IModelValidatorsProvider`, `IModelValidatorsOptions`, `IModelValidators`                                                                       | Validators of model fields from code.                   |

## File Locations

Source: `packages/shared/react/src/lib/` in the smartsoft001 repository.

- `forms/`: `abstract-control.ts`, `form-control.ts`, `form-group.ts`, `form-array.ts`, `validators.ts`, `hooks.ts`, `emitter.ts`
- `factories/form/`: `form.factory.ts`, `use-model-form.ts`
- `providers/model-validators.provider.ts`
- `components/input/error/input-error-messages.ts`: the order and texts of the messages
