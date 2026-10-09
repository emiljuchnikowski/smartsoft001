---
name: react-components-detail
description: SmartDetail React component API (@smartsoft001/react) — renders the label and read-only value of one model field by its FieldType (text, email, enum, flag, address, color, image, pdf, video, attachment, object, array...), cell pipes and trustHtml, detailFieldComponents / DETAIL_PRESET_FIELD_COMPONENTS, and the useDetail hook for custom detail field components.
user-invocable: false
---

# Detail (`SmartDetail`)

`SmartDetail` shows one field of a model instance read-only: the field's label (the label provider's, or `MODEL.<key>` translated), its info tooltip, and the value rendered by the **detail component of the field's `FieldType`**, or a skeleton while there is no item yet. `SmartDetails` renders one `SmartDetail` per field marked `details`, so most applications use it indirectly; render it yourself to place single fields. Detail components are resolved from `detailFieldComponents` on `SmartProvider` over the library's own (`DETAIL_PRESET_FIELD_COMPONENTS` gives the styled set); a type without one renders `SmartDetailText`.

## When to Use This Skill

- Showing single read-only fields of a record in a layout of your own
- Formatting values through a cell pipe (`ICellPipe`), or rendering trusted HTML (`trustHtml`)
- Choosing or replacing the detail component of a field type (`detailFieldComponents`)
- Writing a custom detail component on `useDetail`

## Exports

All from `@smartsoft001/react`.

| Export                                          | Kind      | What it is                                                                                                                                                       |
| ----------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartDetail`                                   | component | The label of a field and its value, rendered by the detail component of the field type, with the field's info tooltip and a skeleton while there is no item yet. |
| `SmartDetailText`                               | component | The text detail: the value of the field, or what `options.cellPipe` makes of it, rendered as HTML.                                                               |
| `useDetail`                                     | hook      | What every detail field shares: the item, the key of the field and its value, unwrapped from `options`.                                                          |
| `useDetailCellValue`                            | hook      | The value a text-like detail renders: the list cell of `key` in `item`, the cell pipe's result (or the raw value), translated when it is a string.               |
| `getDefaultDetailFieldComponents`               | function  | The library's detail component of every `FieldType` that has one.                                                                                                |
| `DETAIL_PRESET_FIELD_COMPONENTS`                | const     | The preset detail components, keyed by `FieldType`.                                                                                                              |
| `SmartDetail<Type>` / `SmartDetail<Type>Preset` | component | The standard and preset detail component of each field type (see Field types below), e.g. `SmartDetailEmail`, `SmartDetailEmailPreset`.                          |
| `useDetailAddress`                              | hook      | The address of an `address` field (`null` without one) and its `building[/flat]` part.                                                                           |
| `useDetailArray`                                | hook      | `childOptions`: the `SmartDetails` options of each element of an `array` field, typed by the element's class.                                                    |
| `useDetailAttachment`                           | hook      | `fileName` (`fileName` or `name` of the file, `null` without either) and `download()`, which opens the file through the file service.                            |
| `useDetailEnum`                                 | hook      | `values`: the value of an `enum` field, or each of its values when it is an array, as strings.                                                                   |
| `useDetailImage`                                | hook      | `imageUrl`: the file service URL of the file in an `image` field, `null` without one.                                                                            |
| `useDetailObject`                               | hook      | `childOptions`: the `SmartDetails` options of the nested object of an `object` field, `null` without one.                                                        |
| `useDetailPdf`                                  | hook      | `fileName` and `show()`, which opens the PDF through the file service.                                                                                           |
| `useDetailVideo`                                | hook      | `url`: the file service URL of the video in the field, `null` without one.                                                                                       |

## Props and Types

### `SmartDetailProps<T = any>`

| Prop         | Type                             | Default  | Description                                                |
| ------------ | -------------------------------- | -------- | ---------------------------------------------------------- |
| `options`    | `IDetailOptions<T> \| undefined` | required | The field to show: key, item, field options and cell pipe. |
| `type`       | `any`                            | required | The model class, for the label (`useModelLabel`).          |
| `className?` | `string`                         | —        | Forwarded to the field component.                          |

### `SmartDetailFieldProps<T = any>`

The props of every detail field component: `options` and `className`.

| Prop         | Type                | Default | Description                                |
| ------------ | ------------------- | ------- | ------------------------------------------ |
| `options?`   | `IDetailOptions<T>` | —       | The detail options `SmartDetail` received. |
| `className?` | `string`            | —       | The `className` of `SmartDetail`.          |

### `IDetailOptions<T>`

| Field       | Type            | Default  | Description                                                                                                            |
| ----------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| `key`       | `string`        | required | The field key.                                                                                                         |
| `item?`     | `T \| null`     | —        | The record; `null` / `undefined` shows a skeleton.                                                                     |
| `options`   | `IFieldOptions` | required | The field's `@Field` options (`getModelFieldOptions(instance, key)`, or the `options` of `getModelFieldsWithOptions`). |
| `cellPipe?` | `ICellPipe<T>`  | —        | Formats the value; read by the `text` and `phoneNumberPl` details (standard and preset).                               |
| `loading?`  | `boolean`       | —        | Not read by the built-in implementations; available to a custom implementation (`useDetail` returns it).               |

### `ICellPipe<T>`

Formats a value: `transform(item, key, translate?)` returns text (sanitised before it is rendered as HTML) or `trustHtml(html)` (rendered as is).

| Field       | Type                                                                                                | Default  | Description                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `transform` | `(value: T, columnName: string, translate?: (val: string) => string) => string \| SmartTrustedHtml` | required | The text of a cell. Markup in it is sanitised before it is rendered; return `trustHtml(html)` to render markup you vouch for as is. |

### Related types

- `SmartDetailFieldComponents`: `Partial< Record<FieldTypeDef, ComponentType<SmartDetailFieldProps<any>>> >` — Detail components by `FieldType`.

## Field types

| `FieldType`                             | Standard                                                                                                     | Preset                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `text` (and every type without its own) | `SmartDetailText`: the value, or the cell pipe's result, translated when a string, as sanitised HTML         | `SmartDetailTextPreset` (em dash when empty) |
| `email`                                 | `SmartDetailEmail`: a `mailto:` link                                                                         | `SmartDetailEmailPreset`                     |
| `phoneNumberPl`                         | `SmartDetailPhoneNumberPl`: a `tel:` link with the `48` prefix                                               | `SmartDetailPhoneNumberPlPreset`             |
| `enum`                                  | `SmartDetailEnum`: the translated value(s), comma-separated                                                  | `SmartDetailEnumPreset` (a badge each)       |
| `flag`                                  | `SmartDetailFlag`: a check or an x-mark                                                                      | `SmartDetailFlagPreset`                      |
| `color`                                 | `SmartDetailColor`: a colour bar                                                                             | `SmartDetailColorPreset` (swatch and code)   |
| `dateRange`                             | `SmartDetailDateRange`: `start – end`                                                                        | `SmartDetailDateRangePreset`                 |
| `address`                               | `SmartDetailAddress`: street and building / flat, zip code and city                                          | `SmartDetailAddressPreset`                   |
| `image` / `logo`                        | `SmartDetailImage` (the uploaded file's URL) / `SmartDetailLogo` (the URL in the field)                      | `…Preset`                                    |
| `pdf` / `video` / `attachment`          | `SmartDetailPdf` (show button) / `SmartDetailVideo` (mp4 player) / `SmartDetailAttachment` (download button) | `…Preset`                                    |
| `object`                                | `SmartDetailObject`: the nested object's own `SmartDetails`                                                  | `SmartDetailObjectPreset` (in a card)        |
| `array`                                 | `SmartDetailArray`: a `SmartDetails` per element                                                             | `SmartDetailArrayPreset` (a card each)       |

File-based details (`image`, `pdf`, `video`, `attachment`) build their URLs with the file service: give `SmartProvider` a `fileServiceConfig`.

## Sanitised HTML

Text details render the value as HTML **sanitised with DOMPurify**. A cell pipe that returns `trustHtml(html)` opts out for markup you vouch for (`trustHtml`, `sanitizeHtml` and `toInnerHtml` are exported from `@smartsoft001/react`).

## Usage

```tsx
import {
  Field,
  FieldType,
  getModelFieldOptions,
  Model,
} from '@smartsoft001/models';
import { ICellPipe, SmartDetail, trustHtml } from '@smartsoft001/react';

@Model({})
export class Invoice {
  id!: string;

  @Field({ type: FieldType.text, details: true })
  number!: string;

  @Field({
    type: FieldType.email,
    details: true,
    info: 'Where the invoice is sent.',
  })
  email!: string;

  @Field({ type: FieldType.text, details: true })
  total!: number;
}

const money: ICellPipe<Invoice> = {
  transform: (item, key) =>
    key === 'total'
      ? trustHtml(`<strong>${item.total.toFixed(2)} PLN</strong>`)
      : String(item[key as keyof Invoice] ?? ''),
};

export function InvoiceSummary({ invoice }: { invoice: Invoice | null }) {
  const probe = new Invoice();

  return (
    <div className="grid grid-cols-3 gap-4">
      {(['number', 'email', 'total'] as const).map((key) => (
        <SmartDetail
          key={key}
          type={Invoice}
          options={{
            key,
            item: invoice,
            options: getModelFieldOptions(probe, key),
            cellPipe: money,
          }}
        />
      ))}
    </div>
  );
}
```

## Replacing the Implementation

`SmartDetail` has no single registry key: its field components come from `detailFieldComponents` on `SmartProvider`, merged over the library's map. Register the preset set, or a component of your own for one type.

```tsx
import type { ReactNode } from 'react';

import { FieldType } from '@smartsoft001/models';
import {
  DETAIL_PRESET_FIELD_COMPONENTS,
  SmartDetailFieldProps,
  SmartProvider,
  useDetail,
} from '@smartsoft001/react';

function MoneyDetail(props: SmartDetailFieldProps) {
  const { value } = useDetail(props);

  return (
    <span className={props.className}>
      {typeof value === 'number' ? value.toFixed(2) : '—'}
    </span>
  );
}

const detailFieldComponents = {
  ...DETAIL_PRESET_FIELD_COMPONENTS,
  [FieldType.currency]: MoneyDetail,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider detailFieldComponents={detailFieldComponents}>
      {children}
    </SmartProvider>
  );
}
```

`SMART_PRESET_COMPONENTS` registers `DETAIL_PRESET_FIELD_COMPONENTS` together with the other presets. The `object` and `array` details render nested objects through `SmartDetails`, so the `details` registry key applies to them too.

### Hooks

#### `useDetail`

What every detail field shares: the item, the key of the field and its value, unwrapped from `options`.

```ts
function useDetail<T>({ options }: SmartDetailFieldProps<T>);
```

| Returns        | Type                     | Description                             |
| -------------- | ------------------------ | --------------------------------------- |
| `item`         | `NonNullable<T> \| null` | `options.item`, `null` without one.     |
| `key`          | `string \| null`         | `options.key`.                          |
| `value`        | `any`                    | `item[key]`.                            |
| `cellPipe`     | `ICellPipe<T> \| null`   | `options.cellPipe`, `null` without one. |
| `fieldOptions` | `IFieldOptions \| null`  | `options.options`.                      |
| `loading`      | `boolean \| undefined`   | `options.loading`.                      |

#### `useDetailCellValue`

The value a text-like detail renders: the list cell of `key` in `item`, the cell pipe's result (or the raw value), translated when it is a string.

```ts
function useDetailCellValue<T>(props: SmartDetailFieldProps<T>): any;
```

## Styling

- `SmartDetail` renders the label in a muted `smart:text-sm` span and a pulsing skeleton without an item, with `smart:dark:` variants; `className` reaches the field component.

## File Locations

Source: `packages/shared/react/src/lib/components/detail/` in the smartsoft001 repository.

- `address/detail-address.tsx`: `SmartDetailAddress`
- `address/preset/detail-address-preset.tsx`: `SmartDetailAddressPreset`
- `address/use-detail-address.ts`: `useDetailAddress`
- `array/detail-array.tsx`: `SmartDetailArray`
- `array/preset/detail-array-preset.tsx`: `SmartDetailArrayPreset`
- `array/use-detail-array.ts`: `useDetailArray`
- `attachment/detail-attachment.tsx`: `SmartDetailAttachment`
- `attachment/preset/detail-attachment-preset.tsx`: `SmartDetailAttachmentPreset`
- `attachment/use-detail-attachment.ts`: `useDetailAttachment`
- `color/detail-color.tsx`: `SmartDetailColor`
- `color/preset/detail-color-preset.tsx`: `SmartDetailColorPreset`
- `date-range/detail-date-range.tsx`: `SmartDetailDateRange`
- `date-range/preset/detail-date-range-preset.tsx`: `SmartDetailDateRangePreset`
- `default-field-components.ts`: `getDefaultDetailFieldComponents`, `SmartDetailFieldComponents`
- `detail.tsx`: `SmartDetail`
- `detail.types.ts`: `SmartDetailFieldProps`, `SmartDetailProps`
- `email/detail-email.tsx`: `SmartDetailEmail`
- `email/preset/detail-email-preset.tsx`: `SmartDetailEmailPreset`
- `enum/detail-enum.tsx`: `SmartDetailEnum`
- `enum/preset/detail-enum-preset.tsx`: `SmartDetailEnumPreset`
- `enum/use-detail-enum.ts`: `useDetailEnum`
- `flag/detail-flag.tsx`: `SmartDetailFlag`
- `flag/preset/detail-flag-preset.tsx`: `SmartDetailFlagPreset`
- `image/detail-image.tsx`: `SmartDetailImage`
- `image/preset/detail-image-preset.tsx`: `SmartDetailImagePreset`
- `image/use-detail-image.ts`: `useDetailImage`
- `logo/detail-logo.tsx`: `SmartDetailLogo`
- `logo/preset/detail-logo-preset.tsx`: `SmartDetailLogoPreset`
- `object/detail-object.tsx`: `SmartDetailObject`
- `object/preset/detail-object-preset.tsx`: `SmartDetailObjectPreset`
- `object/use-detail-object.ts`: `useDetailObject`
- `pdf/detail-pdf.tsx`: `SmartDetailPdf`
- `pdf/preset/detail-pdf-preset.tsx`: `SmartDetailPdfPreset`
- `pdf/use-detail-pdf.ts`: `useDetailPdf`
- `phone-number-pl/detail-phone-number-pl.tsx`: `SmartDetailPhoneNumberPl`
- `phone-number-pl/preset/detail-phone-number-pl-preset.tsx`: `SmartDetailPhoneNumberPlPreset`
- `preset-fields.ts`: `DETAIL_PRESET_FIELD_COMPONENTS`
- `text/detail-text.tsx`: `SmartDetailText`
- `text/preset/detail-text-preset.tsx`: `SmartDetailTextPreset`
- `use-detail.ts`: `useDetail`, `useDetailCellValue`
- `video/detail-video.tsx`: `SmartDetailVideo`
- `video/preset/detail-video-preset.tsx`: `SmartDetailVideoPreset`
- `video/use-detail-video.ts`: `useDetailVideo`
- `detail.stories.tsx`: Storybook stories
