---
name: react-components-input
description: SmartInput React component API (@smartsoft001/react) — renders one model field of a form by its FieldType (text, email, int, enum, radio, check, date, dateRange, file, image, object, array, address, password...), the standard and preset field components, inputFieldComponents / INPUT_PRESET_FIELD_COMPONENTS, the 'input-error' registry key, validation messages and the useInput hook for custom field components.
user-invocable: false
---

# Input (`SmartInput`)

`SmartInput` renders one field of a model-driven form: it reads the field's `@Field` options for the form's mode, picks the **field component of the field's `FieldType`** (or `options.component`), and renders it with the field's info tooltip, a loader while an async validator runs, and the validation messages once the control is touched. `SmartForm` renders one `SmartInput` per control, so most applications use it indirectly; render it yourself when you lay out a form's fields by hand. Field components are resolved from `inputFieldComponents` on `SmartProvider` over the library's defaults (`INPUT_PRESET_FIELD_COMPONENTS` gives the styled set), and the messages render through `components['input-error']`.

## When to Use This Skill

- Laying out the inputs of a model-driven form yourself (one `SmartInput` per control)
- Choosing or replacing the editor of a field type (`inputFieldComponents`) or of one field (`IFormOptions.inputComponents`, `options.component`)
- Writing a custom field component on `useInput`
- Understanding what each `FieldType` renders, which ones upload files, and which add their own validators
- Restyling the validation messages (`input-error` key, `SmartInputErrorPreset`)

## Exports

All from `@smartsoft001/react`.

| Export                           | Kind      | What it is                                                                                                                                                                                                                                           |
| -------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartInput`                     | component | Renders the field component of the control's field type (or `options.component`), with the field's info tooltip, a loader while an async validator runs, and the validation messages once the control is touched.                                    |
| `SmartInputError`                | component | The messages of a field's validation errors.                                                                                                                                                                                                         |
| `SmartInputErrorPreset`          | component | Styled validation messages (preset), each with an alert icon and `role="alert"`.                                                                                                                                                                     |
| `SmartRichTextEditor`            | component | A dependency-free rich-text editor: a menu bar over a `contentEditable` element whose HTML is the value.                                                                                                                                             |
| `useInputFile`                   | hook      | The upload behaviour of the file fields: picking a file checks it against the input's `accept` list, uploads it through the file service with progress, and sets the attachment the API returns as the value.                                        |
| `useInputPossibilities`          | hook      | The options of a field with possibilities: the ones the model possibilities provider returns, asked again 500 ms after the form's value last changed so they can depend on other fields, or else the ones in the input options.                      |
| `useInput`                       | hook      | What every field component shares: the control and its live state, whether it is required, the translated label and the handlers that bind an element to the control (a change sets the value and marks the control dirty, a blur marks it touched). |
| `getDefaultInputFieldComponents` | function  | The standard field component of every `FieldType` (the map `SmartInput` falls back to).                                                                                                                                                              |
| `getInputErrorMessages`          | function  | The messages a field shows for its validation errors, in a fixed order.                                                                                                                                                                              |
| `resolveInputFieldOptions`       | function  | The options of the field an input renders, merged with the options of the form's mode: a `<key>Confirm` control takes the options of `<key>`, and an array model is read through its first item.                                                     |
| `INPUT_PRESET_FIELD_COMPONENTS`  | const     | The Preline-styled field presets, by `FieldType`.                                                                                                                                                                                                    |
| `LONG_TEXT_TOOLBAR`              | const     | The full menu of `SmartRichTextEditor` (its default `toolbar`), typed `SmartRichTextToolbar`.                                                                                                                                                        |

Every field component of the table under "Field types" is exported too (`SmartInputText`, `SmartInputTextPreset`, ...), with the hooks their standard and preset variants share. Use them in a custom field component of the same type.

| Hook / function                  | What it is                                                                                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useInputAddressPart`            | Binds the input of one part of an `address` group to its control (value, dirty on change, touched on blur, disabled with the part) and gives an `id` for its label.              |
| `useInputArray`                  | The `array` field: the item forms, `add()`, `remove(index)`, `move(from, to)`, `getItemDragProps(index)` and `isStatic` (`possibilities.static`).                                |
| `useInputCheck`                  | The `check` field: the possibilities (provider, input options, else the model field's), kept checked in line with the value, and `toggle(item)`.                                 |
| `syncInputCheckPossibilities`    | The possibilities with `checked` set from a value (what `useInputCheck` uses).                                                                                                   |
| `useInputColor`                  | The `color` field: the shown colour, picking and clearing (`null`).                                                                                                              |
| `useInputImage`                  | `useInput` and `useInputFile` plus the preview URL of the `image` field and the `logo` preset.                                                                                   |
| `useInputInts`                   | The `ints` field: one row per number plus a trailing row to add one.                                                                                                             |
| `useInputNip`                    | `useInput` plus the `invalidNip` validator added to the control.                                                                                                                 |
| `useInputObject`                 | The `object` field: the options of the nested form, one tree level deeper.                                                                                                       |
| `useInputPassword`               | The `password` field: the strength rating and the `passwordStrength` validator it drives.                                                                                        |
| `useInputPhoneNumberPl`          | `useInput` plus the `minLength(9)` / `maxLength(9)` validators.                                                                                                                  |
| `useInputRadio`                  | The `radio` field: the possibilities (provider, input options, else the model field's object map).                                                                               |
| `getModelFieldPossibilitiesList` | The model field's `possibilities` object map as a list (the fallback of the radio and enum preset fields).                                                                       |
| `useInputVideo`                  | `useInput` and `useInputFile` plus the player of the `video` fields.                                                                                                             |
| `useInputFileDropZone`           | The drop zone of the `pdf`, `video` and `attachment` presets (click / Enter / Space opens the picker, a drop uploads like a picked file); options `UseInputFileDropZoneOptions`. |
| `toNumberValue`                  | The value of a number `<input>`: empty is `null`, else `parseFloat`.                                                                                                             |

The preset's class helpers (`getInputEmailPresetClasses`, `getInputEmailPresetLabelClasses`, `getInputNipPresetClasses`, `getInputNipPresetLabelClasses`, `getInputPhoneNumberPlPresetClasses`, `getInputPhoneNumberPlPresetLabelClasses`, `getInputPhoneNumberPlPresetWrapperClasses`, `getInputPhoneNumberPlPresetPrefixClasses`, `getInputPhoneNumberPresetClasses`, `getInputPhoneNumberPresetLabelClasses`, `getInputTextPresetClasses`, `getInputTextPresetLabelClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartInputProps<T = any>`

The props of `<SmartInput>`.

| Prop         | Type              | Default | Description                                                                                 |
| ------------ | ----------------- | ------- | ------------------------------------------------------------------------------------------- |
| `options?`   | `InputOptions<T>` | —       | The field to render: control, model, field key, mode, tree level, possibilities, component. |
| `className?` | `string`          | —       | Passed to the field component (usually appended to its input).                              |

### `SmartInputErrorProps`

| Prop      | Type                            | Default | Description           |
| --------- | ------------------------------- | ------- | --------------------- |
| `errors?` | `SmartValidationErrors \| null` | —       | The control's errors. |

### `SmartInputFieldProps<T = any>`

The props every field component receives from `<SmartInput>`: the input options (control, model, field key, mode, tree level, possibilities) and the field's options for the current mode.

| Prop            | Type              | Default | Description                                                       |
| --------------- | ----------------- | ------- | ----------------------------------------------------------------- |
| `options?`      | `InputOptions<T>` | —       | The input options `SmartInput` received.                          |
| `fieldOptions?` | `IFieldOptions`   | —       | The field's `@Field` options merged with the options of the mode. |
| `className?`    | `string`          | —       | The `className` of `SmartInput`.                                  |

### `SmartRichTextEditorProps`

Props of the rich-text editor of `longText` fields.

| Prop           | Type                     | Default             | Description                                                                                               |
| -------------- | ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------- |
| `value?`       | `string \| null`         | —                   | The HTML to edit; rendered sanitised when it does not come from here.                                     |
| `placeholder?` | `string`                 | —                   | Placeholder of the empty editor.                                                                          |
| `disabled?`    | `boolean`                | `false`             | Makes the editor read-only.                                                                               |
| `toolbar?`     | `SmartRichTextToolbar`   | `LONG_TEXT_TOOLBAR` | The menu groups; the full menu (formatting, lists, headings, link, image, colours, alignment) by default. |
| `labelledBy?`  | `string`                 | —                   | The id of the element labelling the editor.                                                               |
| `onChange?`    | `(html: string) => void` | —                   | Called with the HTML of the content after every change.                                                   |
| `onBlur?`      | `() => void`             | —                   | Called when the editor loses the focus.                                                                   |

`SmartRichTextToolbar` is `SmartRichTextToolbarItem[][]`, one array per group of the menu. An item is a `SmartRichTextToggle` (`'bold'`, `'italic'`, `'underline'`, `'strike'`, `'code'`, `'blockquote'`, `'ordered_list'`, `'bullet_list'`, `'align_left'`, `'align_center'`, `'align_right'`, `'align_justify'`), a `SmartRichTextColorKind` (`'text_color'`, `'background_color'`), `'link'`, `'image'` or `{ heading: SmartRichTextHeading[] }` (`'h1'` to `'h6'`). All these types are exported.

### `IInputOptions`

| Field            | Type                      | Default                           | Description                                                                                                                                                                                                                            |
| ---------------- | ------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `treeLevel`      | `number`                  | required                          | Nesting depth (0 at the top; nested object / array forms go one deeper).                                                                                                                                                               |
| `control`        | `SmartAbstractControl`    | required                          | The control of the field (`form.controls[fieldKey]`).                                                                                                                                                                                  |
| `possibilities?` | `SmartPossibility[]`      | —                                 | The options of a `radio`, `check` or preset `enum` field: the model possibilities provider's win over them, they win over the field's own `possibilities`. The standard `enum` (the enum's keys) and the other types do not read them. |
| `component?`     | `InputComponentType<any>` | the component of the field's type | A field component used instead of the type's one.                                                                                                                                                                                      |

### `IInputFromFieldOptions<T>`

| Field      | Type                             | Default  | Description                                                                 |
| ---------- | -------------------------------- | -------- | --------------------------------------------------------------------------- |
| `model`    | `T`                              | required | The model instance the form was built from (its `@Field` metadata is read). |
| `fieldKey` | `string`                         | required | The field's key (a `<key>Confirm` key reads the options of `<key>`).        |
| `mode?`    | `'create' \| 'update' \| string` | —        | The form mode whose options are merged (`create`, `update`, ...).           |

### Related types

- `InputOptions<T>`: `IInputOptions & IInputFromFieldOptions<T>` — What `SmartInput` takes: `IInputOptions & IInputFromFieldOptions<T>`.

`SmartPossibility`, `SmartAbstractControl` are described in the `react-forms` and `react-provider` skills.

## Field types

`SmartInput` picks the component by `fieldOptions.type` (from `@smartsoft001/models`' `FieldType`). The standard component is the default; the preset one is what `INPUT_PRESET_FIELD_COMPONENTS` registers. Where the two behave differently, it is noted.

| `FieldType`                    | Standard                                                     | Preset                          | Notes                                                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`                         | `SmartInputText`                                             | `SmartInputTextPreset`          | Text input.                                                                                                                                                            |
| `longText`                     | `SmartInputLongText`                                         | `SmartInputLongTextPreset`      | Rich-text editor (`SmartRichTextEditor`); the value is HTML, shown sanitised.                                                                                          |
| `email`                        | `SmartInputEmail`                                            | `SmartInputEmailPreset`         | `type="email"`; the form factory adds the `email` check.                                                                                                               |
| `password`                     | `SmartInputPassword`                                         | `SmartInputPasswordPreset`      | With `possibilities: { strength: true }` a strength meter sets the `passwordStrength` error until the password is strong. `confirm: true` adds a `<key>Confirm` field. |
| `int` / `float` / `currency`   | `SmartInputInt` / `SmartInputFloat` / `SmartInputCurrency`   | `…Preset`                       | Number inputs (`step` 1 / 0.01 / 0.01); empty sets `null`.                                                                                                             |
| `ints`                         | `SmartInputInts`                                             | `SmartInputIntsPreset`          | A list of numbers, one row each plus a row to add.                                                                                                                     |
| `strings`                      | `SmartInputStrings`                                          | `SmartInputStringsPreset`       | A list of strings (the preset as chips).                                                                                                                               |
| `flag`                         | `SmartInputFlag`                                             | `SmartInputFlagPreset`          | Checkbox bound to a boolean.                                                                                                                                           |
| `radio`                        | `SmartInputRadio`                                            | `SmartInputRadioPreset`         | One radio per possibility; the value is its `id`.                                                                                                                      |
| `check`                        | `SmartInputCheck`                                            | `SmartInputCheckPreset`         | One checkbox per possibility; the value is the list of checked ids.                                                                                                    |
| `enum`                         | `SmartInputEnum`                                             | `SmartInputEnumPreset`          | **Differs**: the standard renders checkboxes of the enum's keys (value: list of keys); the preset renders a `<select>` (value: one possibility `id`).                  |
| `date`                         | `SmartInputDate`                                             | `SmartInputDatePreset`          | Native `type="date"`, `YYYY-MM-DD`.                                                                                                                                    |
| `dateWithEdit`                 | `SmartInputDateWithEdit`                                     | `SmartInputDateWithEditPreset`  | `SmartDateEdit` (digit inputs) bound to the control.                                                                                                                   |
| `dateRange`                    | `SmartInputDateRange`                                        | `SmartInputDateRangePreset`     | `IDateRange` value; the standard uses `SmartDateRange`, the preset two native date inputs.                                                                             |
| `nip`                          | `SmartInputNip`                                              | `SmartInputNipPreset`           | Adds the NIP check (`invalidNip`) to the control.                                                                                                                      |
| `pesel`                        | `SmartInputPesel`                                            | `SmartInputPeselPreset`         | The form factory adds the `pesel` check; **differs**: the preset adds its own `invalidPesel` check to the control too (same message).                                  |
| `phoneNumber`                  | `SmartInputPhoneNumber`                                      | `SmartInputPhoneNumberPreset`   | `type="tel"`; the form factory adds the `phoneNumber` check.                                                                                                           |
| `phoneNumberPl`                | `SmartInputPhoneNumberPl`                                    | `SmartInputPhoneNumberPlPreset` | Exactly 9 characters (`minlength` / `maxlength`); the preset shows a `+48` addon.                                                                                      |
| `color`                        | `SmartInputColor`                                            | `SmartInputColorPreset`         | Native colour picker with a clear button.                                                                                                                              |
| `file`                         | `SmartInputFile`                                             | `SmartInputFilePreset`          | **Differs**: the standard keeps the picked `File` as the value (no upload); the preset uploads it through the file service.                                            |
| `attachment` / `pdf` / `video` | `SmartInputAttachment` / `SmartInputPdf` / `SmartInputVideo` | `…Preset` (drop zones)          | Upload through the file service; the value is the attachment the API returns.                                                                                          |
| `image`                        | `SmartInputImage`                                            | `SmartInputImagePreset`         | `.jpg,.png,.jpeg` upload with a preview.                                                                                                                               |
| `logo`                         | `SmartInputLogo`                                             | `SmartInputLogoPreset`          | **Differs**: the standard stores a base64 `data:` URL (no upload); the preset uploads like `image`.                                                                    |
| `object`                       | `SmartInputObject`                                           | `SmartInputObjectPreset`        | A nested `SmartForm` for the field's group (`classType` model), one tree level deeper.                                                                                 |
| `array`                        | `SmartInputArray`                                            | `SmartInputArrayPreset`         | A nested `SmartForm` per item, an add button and drag-and-drop reordering (remove button in the preset only; `possibilities.static` disables changes).                 |
| `address`                      | `SmartInputAddress`                                          | `SmartInputAddressPreset`       | A labelled input per part (city, zip code, street, building and flat number).                                                                                          |

`dateTime` has no input component: a `dateTime` field renders nothing unless you register one under `inputFieldComponents[FieldType.dateTime]` or pass `component`.

Uploading fields need a file service: give `SmartProvider` a `fileServiceConfig` (`{ apiUrl }`) or a `fileService`; without one, a picked file is not uploaded. Files go to `<apiUrl>/attachments`.

## Labels, info and messages

- The label is the label provider's (`modelLabelProvider` on `SmartProvider`) or the translation of `MODEL.<key>` (see `react-provider`).
- A field with `info: '...'` shows a `SmartInfo` tooltip; a field with `hide: true` (for the mode) renders nothing.
- Messages are shown once the control is touched, from its errors, in a fixed order: `required` (which hides `confirm`), `confirm`, `invalidNip`, `invalidUnique`, `email`, `phoneNumber`, `pesel` or `invalidPesel` (one message), `minlength`, `maxlength`, `min`, `max`, and `customMessage` (its value is shown as is). The texts come from `INPUT.ERRORS.*` translations. `getInputErrorMessages(errors, t)` returns that list for a custom message component.

## Choosing the component of a field

1. `options.component` on `SmartInput` (`SmartForm` fills it from `IFormOptions.inputComponents[fieldKey]`, and CRUD screens from `CrudFullConfig.inputComponents`);
2. else `inputFieldComponents[type]` registered on `SmartProvider`;
3. else the library's standard component for the type (`getDefaultInputFieldComponents()`).

## Usage

Rendering the inputs of a form by hand (with `useModelForm` building the form from the model):

```tsx
import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartButton, SmartInput, useModelForm } from '@smartsoft001/react';

@Model({})
export class Address {
  @Field({
    type: FieldType.text,
    create: { required: true },
    info: 'As on the doorbell.',
  })
  name!: string;

  @Field({ type: FieldType.phoneNumberPl, create: true })
  phone!: string;

  @Field({
    type: FieldType.radio,
    create: true,
    possibilities: { home: 'home', office: 'office' },
  })
  kind!: string;
}

const model = new Address();

export function AddressFields({
  onSave,
}: {
  onSave: (value: Address) => void;
}) {
  const form = useModelForm(model, { mode: 'create' });

  if (!form) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <SmartInput
        options={{
          control: form.controls['name'],
          fieldKey: 'name',
          model,
          mode: 'create',
          treeLevel: 0,
        }}
      />
      <SmartInput
        options={{
          control: form.controls['phone'],
          fieldKey: 'phone',
          model,
          mode: 'create',
          treeLevel: 0,
        }}
      />
      <SmartInput
        options={{
          control: form.controls['kind'],
          fieldKey: 'kind',
          model,
          mode: 'create',
          treeLevel: 0,
          possibilities: [
            { id: 'home', text: 'Home', checked: false },
            { id: 'office', text: 'Office', checked: false },
          ],
        }}
      />
      <SmartButton
        options={{
          click: () => {
            form.markAllAsTouched();
            if (form.valid) onSave(form.value as Address);
          },
        }}
      >
        Save
      </SmartButton>
    </div>
  );
}
```

The styled field set, for every form of the application:

```tsx
import type { ReactNode } from 'react';

import {
  INPUT_PRESET_FIELD_COMPONENTS,
  SmartInputErrorPreset,
  SmartProvider,
} from '@smartsoft001/react';

const components = { 'input-error': SmartInputErrorPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider
      inputFieldComponents={INPUT_PRESET_FIELD_COMPONENTS}
      components={components}
      fileServiceConfig={{ apiUrl: '/api' }}
    >
      {children}
    </SmartProvider>
  );
}
```

## Replacing the Implementation

- **Per field type, application-wide**: `inputFieldComponents` on `SmartProvider` maps a `FieldType` to a component taking `SmartInputFieldProps`. Spread the preset map to override only some types: `{ ...INPUT_PRESET_FIELD_COMPONENTS, [FieldType.text]: MyText }`.
- **Per field of one form**: `IFormOptions.inputComponents` (`{ [fieldKey]: Component }`), or `options.component` when you render `SmartInput` yourself.
- **Validation messages**: the `input-error` registry key (`components={{ 'input-error': SmartInputErrorPreset }}`); the component receives `{ errors }`.
- `SMART_PRESET_COMPONENTS` registers the preset field map and `SmartInputErrorPreset` together with the other presets.

### Hooks

#### `useInputFile`

The upload behaviour of the file fields: picking a file checks it against the input's `accept` list, uploads it through the file service with progress, and sets the attachment the API returns as the value. Also the options of the add, show and delete buttons the file fields render.

```ts
function useInputFile<T = any>({ options }: SmartInputFieldProps<T>);
```

| Returns               | Type                                             | Description                                                                                                                    |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `inputRef`            | `RefObject<HTMLInputElement \| null>`            | Attach to the hidden file input.                                                                                               |
| `loading`             | `boolean`                                        | `true` while a file uploads.                                                                                                   |
| `percent`             | `number \| undefined`                            | Upload progress (0–100), `undefined` when unknown.                                                                             |
| `file`                | `File \| null`                                   | The picked `File`.                                                                                                             |
| `onFileChange`        | `(event: ChangeEvent<HTMLInputElement>) => void` | The input's `change` handler: checks `accept`, uploads through the file service and sets the returned attachment as the value. |
| `addButtonOptions`    | `IButtonOptions`                                 | `IButtonOptions` of the add / change button (opens the picker).                                                                |
| `showButtonOptions`   | `IButtonOptions`                                 | `IButtonOptions` of the download / show button.                                                                                |
| `deleteButtonOptions` | `IButtonOptions`                                 | `IButtonOptions` of the delete button.                                                                                         |

#### `useInputPossibilities`

The options of a field with possibilities: the ones the model possibilities provider returns, asked again 500 ms after the form's value last changed so they can depend on other fields, or else the ones in the input options. `null` when there are none; the field then falls back to its model's `possibilities`.

```ts
function useInputPossibilities<T = any>({
  options,
}: SmartInputFieldProps<T>): SmartPossibility[] | null;
```

#### `useInput`

What every field component shares: the control and its live state, whether it is required, the translated label and the handlers that bind an element to the control (a change sets the value and marks the control dirty, a blur marks it touched).

```ts
function useInput<T = any>({ options, fieldOptions }: SmartInputFieldProps<T>);
```

| Returns         | Type                                | Description                                                                       |
| --------------- | ----------------------------------- | --------------------------------------------------------------------------------- |
| `control`       | `SmartAbstractControl<any> \| null` | The field's control (`options.control`).                                          |
| `state`         | `SmartControlState<any> \| null`    | The control's live state (`useControlState`).                                     |
| `value`         | `any`                               | The control's value.                                                              |
| `required`      | `boolean`                           | Whether the control reports `required` for an empty value (show a required mark). |
| `disabled`      | `boolean`                           | Whether the control is disabled.                                                  |
| `label`         | `string`                            | The field label: the label provider's, or `MODEL.<key>` translated.               |
| `fieldKey`      | `string`                            | `options.fieldKey`.                                                               |
| `model`         | `T \| undefined`                    | `options.model`.                                                                  |
| `mode`          | `string \| undefined`               | `options.mode`.                                                                   |
| `treeLevel`     | `number`                            | `options.treeLevel` (0 by default).                                               |
| `fieldOptions`  | `IFieldOptions \| undefined`        | The merged field options.                                                         |
| `setValue`      | `(value: unknown) => void`          | Sets the value as the user would: the control becomes dirty.                      |
| `markAsTouched` | `() => void \| undefined`           | Marks the control as touched, as leaving the field does.                          |
| `autoFocus`     | `boolean`                           | Autofocus as `fieldOptions.focused` asks.                                         |

A custom field component takes `SmartInputFieldProps` and binds an element to the control through `useInput`:

```tsx
import type { ReactNode } from 'react';

import { FieldType } from '@smartsoft001/models';
import {
  INPUT_PRESET_FIELD_COMPONENTS,
  SmartInputFieldProps,
  SmartProvider,
  useInput,
} from '@smartsoft001/react';

export function SlugInput(props: SmartInputFieldProps) {
  const {
    value,
    label,
    required,
    disabled,
    fieldKey,
    autoFocus,
    setValue,
    markAsTouched,
  } = useInput(props);

  return (
    <label className="block">
      <span>
        {label}
        {required && ' *'}
      </span>
      <input
        id={fieldKey}
        className={props.className}
        value={value ?? ''}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(event) =>
          setValue(
            event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
          )
        }
        onBlur={markAsTouched}
      />
    </label>
  );
}

const inputFieldComponents = {
  ...INPUT_PRESET_FIELD_COMPONENTS,
  [FieldType.text]: SlugInput,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider inputFieldComponents={inputFieldComponents}>
      {children}
    </SmartProvider>
  );
}
```

`useInputPossibilities` gives a custom `radio` / `check` / `enum` component the options from the possibilities provider or the input options, and `useInputFile` the upload logic of the file fields.

## Styling

- Standard field components are lightly styled Tailwind inputs with `smart:dark:` variants; the preset set is the Preline look. `className` reaches the field component (usually its input).

## File Locations

Source: `packages/shared/react/src/lib/components/input/` in the smartsoft001 repository.

- `input.tsx`, `input.types.ts`: `SmartInput`, `SmartInputProps`, `SmartInputFieldProps`
- `default-field-components.ts`, `preset-fields.ts`: the standard and preset field maps
- `field-options.ts`: `resolveInputFieldOptions`
- `base/`: `useInput`, `useInputPossibilities`, `useInputFile`
- `<type>/`: the field components of each type (`text/`, `enum/`, `object/`, `array/`, ...), each with a `preset/` folder and, where they have one, a `use-input-<type>.ts` hook
- `error/`: `SmartInputError`, `SmartInputErrorPreset`, `getInputErrorMessages`
- `input.stories.tsx`: Storybook stories
