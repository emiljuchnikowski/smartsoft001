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

Main wrapper. Renders `DetailsStandardComponent` by default. When `DETAILS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passing `options` and `class` as inputs.

### DetailsStandardComponent (`<smart-details-standard>`)

Default concrete implementation. Generic Tailwind-styled `<dl>` placeholder that iterates over `fields` and renders each via `<smart-detail>`.

### DetailsBaseComponent (abstract)

Abstract base directive. Computes `fields` from model decorators (with permission and specification filters), exposes the typed `item` signal, and tracks `cellPipe`/`componentFactories`. Extend it to build custom details implementations.

## API

### Inputs

| Input     | Type                                     | Default     | Description                           |
| --------- | ---------------------------------------- | ----------- | ------------------------------------- |
| `options` | `InputSignal<IDetailsOptions<T>>`        | `undefined` | Details configuration                 |
| `class`   | `InputSignal<string>` (alias `cssClass`) | `''`        | External CSS classes on the container |

### IDetailsOptions

```typescript
interface IDetailsOptions<T> {
  type: any; // Model class (decorated with @Model)
  item: Signal<T | undefined>;
  loading?: Signal<boolean>;
  cellPipe?: ICellPipe<T>;
  componentFactories?: IDetailsComponentFactories<T>;
}
```

### DETAILS_STANDARD_COMPONENT_TOKEN

```typescript
import { DETAILS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DetailsStandardComponent` with a custom implementation. Provide a `Type<DetailsBaseComponent<T>>`.

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

<!-- With loading skeleton -->
<smart-details
  [options]="{ type: UserModel, item: userSignal, loading: loadingSignal }"
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
