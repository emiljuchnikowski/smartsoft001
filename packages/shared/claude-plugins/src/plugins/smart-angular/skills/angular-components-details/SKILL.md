---
name: angular-components-details
description: Details component API with InjectionToken pattern for custom implementations. Renders a list of model fields via <smart-detail>.
user-invocable: false
---

# Details Component

The `<smart-details>` component renders a list of model fields decorated with `@Field({ details: true })`. It is a wrapper that delegates to `DetailsStandardComponent` by default and can be replaced via `DETAILS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to render a read-only summary of an entity using model decorators
- Developer asks about `<smart-details>` or `DetailsComponent`
- Developer wants to provide a custom layout for the standard details rendering

## Components

### DetailsComponent (`<smart-details>`)

Main wrapper. Renders `DetailsStandardComponent` by default. When `DETAILS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passing `options` and the `class` value as inputs (under `class` when the component keeps the base's alias, `cssClass` when it redeclares the input).

### DetailsStandardComponent (`<smart-details-standard>`)

Default concrete implementation. Generic Tailwind-styled `<dl>` placeholder that iterates over `fields` and renders each via `<smart-detail>`.

### DetailsBaseComponent (abstract)

Abstract base directive. Extend it to build custom details implementations. It exposes:

- `fields`: the fields of `options.type` marked `@Field({ details })`, without those whose `details.permissions` the user lacks and those whose `enabled` specification (`details.enabled`, else the field's `enabled`) the item fails; a specification can refer to the outermost details' item as `$root`
- `type`: `options.type`
- `item`: a `Signal` of `options.item()` converted to an instance of `options.type`
- `loading`: `options.loading`
- `cellPipe`: a `WritableSignal` of `options.cellPipe` (`null` without one)
- `componentFactories`: `options.componentFactories` (`null` without them), created in the `#topTpl` / `#bottomTpl` view containers of the template

## API

### Inputs

| Input     | Type                                           | Default     | Description                                                |
| --------- | ---------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `options` | `InputSignal<IDetailsOptions<T> \| undefined>` | `undefined` | Details configuration                                      |
| `class`   | `InputSignal<string>`                          | `''`        | Classes on the container (`cssClass` input, alias `class`) |

### IDetailsOptions

| Field                | Type                             | Default  | Description                                                                                                       |
| -------------------- | -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `type`               | `any`                            | required | The `@Model` class whose `details` fields are shown.                                                              |
| `item`               | `Signal<T>`                      | required | The record (a plain object is converted to `type`); while it returns nothing the fields show skeletons.           |
| `cellPipe`           | `ICellPipe<T>`                   | -        | Formats the values of the `text` and `phoneNumberPl` fields (see `angular-components-detail`).                    |
| `componentFactories` | `IDetailsComponentFactories<T>`  | -        | Components created above (`top`) and below (`bottom`) the fields.                                                 |
| `loading`            | `Signal<boolean>`                | -        | Passed to every `<smart-detail>`; not read by the built-in implementations; available to a custom implementation. |
| `title`              | `string`                         | -        | Not read by `<smart-details>`; `DetailsPage` uses it as the page title.                                           |
| `itemHandler`        | `((id: string) => void) \| null` | -        | Not read by `<smart-details>`; `DetailsPage` adds a forward button that calls it with the item's `id`.            |
| `removeHandler`      | `((item: T) => void) \| null`    | -        | Not read by `<smart-details>`; `DetailsPage` adds a remove button that calls it with the item.                    |

`IDetailsComponentFactories<T>` has two optional fields, `top` and `bottom`, each a `Type<any>` created without inputs.

```typescript
interface IDetailsOptions<T extends IEntity<string>> {
  title?: string;
  cellPipe?: ICellPipe<T>;
  type: any; // Model class (decorated with @Model)
  item: Signal<T>;
  loading?: Signal<boolean>;
  itemHandler?: ((id: string) => void) | null;
  removeHandler?: ((item: T) => void) | null;
  componentFactories?: IDetailsComponentFactories<T>;
}
```

### DETAILS_STANDARD_COMPONENT_TOKEN

```typescript
import { DETAILS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DetailsStandardComponent` with a custom implementation. Provide a `Type<DetailsBaseComponent<T>>`. There is no details preset: the field values follow the detail field components (`DETAIL_PRESET_FIELD_COMPONENTS`, registered by `provideSmartPresets()`).

```typescript
providers: [
  {
    provide: DETAILS_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomDetailsComponent,
  },
];
```

## Extending the Base Class

```typescript
import { Component, ViewEncapsulation } from '@angular/core';
import { DetailsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-details',
  template: `
    <dl [class]="cssClass()">
      @for (field of fields; track field.key) {
        <div class="my-row">
          <dt>{{ field.key }}</dt>
          <dd>{{ item?.()?.[field.key] }}</dd>
        </div>
      }
    </dl>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MyCustomDetailsComponent extends DetailsBaseComponent<any> {}
```

## Usage Examples

```html
<!-- Default details -->
<smart-details
  [options]="{ type: UserModel, item: userSignal }"
></smart-details>

<!-- With external CSS class -->
<smart-details
  class="smart:bg-yellow-50 smart:p-4"
  [options]="{ type: UserModel, item: userSignal }"
></smart-details>

<!-- Skeletons while the item is not loaded yet -->
<smart-details
  [options]="{ type: UserModel, item: userOrUndefinedSignal }"
></smart-details>
```

## Field Rendering

Each field is rendered via `<smart-detail>`. The actual rendering of a single field by `FieldType` (text, email, address, image, attachment, …) is dispatched inside `<smart-detail>` itself. See the `angular-components-detail` skill for per-field details.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/details/details.component.ts`
- Standard: `packages/shared/angular/src/lib/components/details/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/details/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DETAILS_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDetailsOptions`)
- Stories: `packages/shared/angular/src/lib/components/details/details.component.stories.ts`
