---
name: react-components-details
description: SmartDetails React component API (@smartsoft001/react) — read-only view of a model record built from @Field({ details }) metadata (IDetailsOptions with type, item, cellPipe, loading, top/bottom components), field permissions and enabled specifications, the 'details' registry key, useDetails, SmartDetailsPage and useDetailsModal for showing details in a modal.
user-invocable: false
---

# Details (`SmartDetails`)

`SmartDetails` shows a record read-only. It reads the fields of `options.type` marked `@Field({ details: ... })`, leaves out those whose `details.permissions` the user lacks and those whose `enabled` specification the item fails, converts `options.item` to an instance of the type, and renders one `SmartDetail` per field (a description list), between the optional `componentFactories.top` and `bottom` components. CRUD item pages render it in their details mode. `SmartDetailsPage` and `useDetailsModal` show the same view in a modal.

## When to Use This Skill

- A read-only view of a record whose model has `@Field({ details: true })` fields
- Hiding fields by permission or by a specification on the item (`details.permissions`, `details.enabled`)
- Adding content above or below the fields (`componentFactories`)
- Showing the details of a record in a modal (`useDetailsModal` + `SmartDetailsPage`)
- Restyling the details view (the `details` registry key) or building one on `useDetails`

## Exports

All from `@smartsoft001/react`.

| Export                 | Kind      | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartDetails`         | component | Renders the implementation registered as `components.details` on `SmartProvider`, `SmartDetailsStandard` by default.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `SmartDetailsStandard` | component | The default details rendering: a description list with a `<SmartDetail>` per field, between the `componentFactories.top` and `componentFactories.bottom` components.                                                                                                                                                                                                                                                                                                                                                 |
| `useDetailsModal`      | hook      | Returns a handler for an element's `onClick` that opens `options.component` in a modal with `{ value: options.params }` as props (e.g. `SmartDetailsPage` with `IDetailsOptions`), and resolves once the modal is closed.                                                                                                                                                                                                                                                                                            |
| `useDetails`           | hook      | The logic every details variant shares: - `fields`: the fields of `options.type` marked `@Field({ details })`, without those whose `details.permissions` the user lacks and those whose `enabled` specification (`details.enabled`, else the field's `enabled`) the item fails; a specification can refer to the outermost details' item as `$root`; - `item`: `options.item` as an instance of `options.type` (a plain API object is converted); - `loading`, `cellPipe` and `componentFactories` from the options. |

## Props and Types

### `SmartDetailsProps<T extends IEntity<string> = any>`

| Prop         | Type                 | Default | Description                                |
| ------------ | -------------------- | ------- | ------------------------------------------ |
| `options?`   | `IDetailsOptions<T>` | —       | The model type, the record and the extras. |
| `className?` | `string`             | —       | Classes on the root element.               |

### `IDetailsModalOptions`

What `useDetailsModal` opens: a component and its params.

| Field       | Type                    | Default    | Description                                                      |
| ----------- | ----------------------- | ---------- | ---------------------------------------------------------------- |
| `component` | `ComponentType<any>`    | required   | Rendered in the modal, with `params` as its `value` prop.        |
| `params`    | `any`                   | required   | Passed to the component as its `value` prop.                     |
| `mode?`     | `'bottom' \| 'default'` | `'bottom'` | Passed to `ModalService.show` (the modal host does not read it). |

### `IDetailsOptions<T extends IEntity<string>>`

| Field                 | Type                             | Default  | Description                                                                                                    |
| --------------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `title?`              | `string`                         | —        | Not rendered by `SmartDetails`; `useDetailsPageOptions` uses it as a page title.                               |
| `cellPipe?`           | `ICellPipe<T>`                   | —        | Formats the values of text-like fields (see `react-components-detail`).                                        |
| `type`                | `any`                            | required | The `@Model` class whose `details` fields are shown.                                                           |
| `item`                | `T \| null \| undefined`         | required | The record (a plain API object is converted to `type`); without one the fields show skeletons.                 |
| `loading?`            | `boolean`                        | —        | Passed to every `SmartDetail`; not read by the built-in implementations; available to a custom implementation. |
| `itemHandler?`        | `((id: string) => void) \| null` | —        | Not rendered by `SmartDetails`; `useDetailsPageOptions` turns it into a "go to item" button.                   |
| `removeHandler?`      | `((item: T) => void) \| null`    | —        | Not rendered by `SmartDetails`; `useDetailsPageOptions` turns it into a remove button.                         |
| `componentFactories?` | `IDetailsComponentFactories<T>`  | —        | Components rendered above (`top`) and below (`bottom`) the fields.                                             |

### `UseDetailsModalCallbacks`

Callbacks of `useDetailsModal`.

| Field          | Type         | Default | Description               |
| -------------- | ------------ | ------- | ------------------------- |
| `onShowed?`    | `() => void` | —       | Once the modal is open.   |
| `onDismissed?` | `() => void` | —       | Once the modal is closed. |

### `SmartDetailsField`

A field `useDetails` shows.

| Field     | Type            | Default  | Description                   |
| --------- | --------------- | -------- | ----------------------------- |
| `key`     | `string`        | required | The field key.                |
| `options` | `IFieldOptions` | required | The field's `@Field` options. |

### `ICellPipe<T>`

Formats a value: `transform(item, key, translate?)` returns text (sanitised) or `trustHtml(html)` (rendered as is).

| Field       | Type                                                                                                | Default  | Description                                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `transform` | `(value: T, columnName: string, translate?: (val: string) => string) => string \| SmartTrustedHtml` | required | The text of a cell. Markup in it is sanitised before it is rendered; return `trustHtml(html)` to render markup you vouch for as is. |

### `IDetailsComponentFactories<T>`

| Field     | Type                 | Default | Description                           |
| --------- | -------------------- | ------- | ------------------------------------- |
| `top?`    | `ComponentType<any>` | —       | Rendered above the fields (no props). |
| `bottom?` | `ComponentType<any>` | —       | Rendered below the fields (no props). |

## Which fields are shown

- Fields with `details: true` or `details: { ... }` in `@Field`, in declaration order.
- `details.permissions`: the field is left out when the signed-in user has none of them (`AuthService.expectPermissions`).
- `details.enabled` (else the field's `enabled`): a specification evaluated against the item; a nested details view can refer to the outermost item as `$root`.

## In a modal

`useDetailsModal({ component, params, mode? }, { onShowed?, onDismissed? })` returns a click handler that opens `component` in a modal through `ModalService`, with `{ value: params }` as its props, and resolves once the modal closed. `SmartDetailsPage` is the component made for it: it renders `SmartDetails` of `value` full width, with the application style applied. `useDetailsPageOptions(value)` returns page options (title, a remove button for `removeHandler`, a forward button for `itemHandler`) for a page layout of your own around it.

## Usage

```tsx
import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  SmartButton,
  SmartDetails,
  SmartDetailsPage,
  useDetailsModal,
} from '@smartsoft001/react';

@Model({ titleKey: 'name' })
export class Customer {
  id!: string;

  @Field({ type: FieldType.text, details: true })
  name!: string;

  @Field({ type: FieldType.email, details: true })
  email!: string;

  @Field({ type: FieldType.text, details: { permissions: ['admin'] } })
  creditLimit!: number;
}

export function CustomerDetails({ customer }: { customer: Customer | null }) {
  return (
    <SmartDetails
      options={{
        type: Customer,
        item: customer,
        componentFactories: { top: () => <h2>Customer</h2> },
      }}
    />
  );
}

export function CustomerPreviewButton({ customer }: { customer: Customer }) {
  const open = useDetailsModal({
    component: SmartDetailsPage,
    params: { type: Customer, item: customer },
    mode: 'default',
  });

  return (
    <SmartButton options={{ click: () => void open() }}>Preview</SmartButton>
  );
}
```

## Replacing the Implementation

`SmartDetails` renders the component registered under the `'details'` key of `SmartProvider`'s `components`, and `SmartDetailsStandard` when nothing is registered there. Every `SmartDetails` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartDetailsProps`, as shown below, as `components={{ details: MyDetails }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### Hooks

#### `useDetailsModal`

Returns a handler for an element's `onClick` that opens `options.component` in a modal with `{ value: options.params }` as props (e.g. `SmartDetailsPage` with `IDetailsOptions`), and resolves once the modal is closed. Without `options` or `options.component` it does nothing.

```ts
function useDetailsModal(
  options: IDetailsModalOptions | null | undefined,
  { onShowed, onDismissed }: UseDetailsModalCallbacks = {},
): () => Promise<void>;
```

#### `useDetails`

The logic every details variant shares:

- `fields`: the fields of `options.type` marked `@Field({ details })`, without those whose `details.permissions` the user lacks and those whose `enabled` specification (`details.enabled`, else the field's `enabled`) the item fails; a specification can refer to the outermost details' item as `$root`;
- `item`: `options.item` as an instance of `options.type` (a plain API object is converted);
- `loading`, `cellPipe` and `componentFactories` from the options. The item becomes the `DetailsService` root while rendering, before nested details evaluate their specifications (the service keeps the first root, so the outermost details win; React effects would run the innermost first).

```ts
function useDetails<T extends IEntity<string>>({
  options,
}: SmartDetailsProps<T>);
```

| Returns              | Type                                    | Description                                           |
| -------------------- | --------------------------------------- | ----------------------------------------------------- |
| `fields`             | `SmartDetailsField[] \| null`           | The fields to show (`null` before they are resolved). |
| `type`               | `any`                                   | `options.type`.                                       |
| `item`               | `T \| null \| undefined`                | The record as an instance of `options.type`.          |
| `loading`            | `boolean \| undefined`                  | `options.loading`.                                    |
| `cellPipe`           | `ICellPipe<T> \| null`                  | `options.cellPipe`, `null` without one.               |
| `componentFactories` | `IDetailsComponentFactories<T> \| null` | `options.componentFactories`, `null` without them.    |

```tsx
import type { IEntity } from '@smartsoft001/domain-core';
import {
  SmartDetail,
  SmartDetailsProps,
  useDetails,
} from '@smartsoft001/react';

export function CardDetails<T extends IEntity<string>>(
  props: SmartDetailsProps<T>,
) {
  const { fields, type, item, loading, cellPipe } = useDetails(props);

  return (
    <div
      className={['grid grid-cols-2 gap-6', props.className]
        .filter(Boolean)
        .join(' ')}
    >
      {fields?.map((field) => (
        <div key={field.key} className="rounded-lg border p-4">
          <SmartDetail
            type={type}
            options={{
              key: field.key,
              options: field.options,
              item,
              cellPipe: cellPipe ?? undefined,
              loading,
            }}
          />
        </div>
      ))}
    </div>
  );
}
```

Registered as `components={{ details: CardDetails }}`, it also renders nested `object` / `array` details and the details mode of CRUD item pages.

## Styling

- `SmartDetailsStandard` is a divided description list with a top border and `smart:dark:` variants; the field values follow the registered detail field components (`DETAIL_PRESET_FIELD_COMPONENTS` for the preset look).

## File Locations

Source: `packages/shared/react/src/lib/components/details/` in the smartsoft001 repository.

- `details.tsx`: `SmartDetails`
- `details.types.ts`: `SmartDetailsProps`
- `standard/details-standard.tsx`: `SmartDetailsStandard`
- `use-details-modal.ts`: `useDetailsModal`, `IDetailsModalOptions`, `UseDetailsModalCallbacks`
- `use-details.ts`: `useDetails`, `SmartDetailsField`
- `details.stories.tsx`: Storybook stories
