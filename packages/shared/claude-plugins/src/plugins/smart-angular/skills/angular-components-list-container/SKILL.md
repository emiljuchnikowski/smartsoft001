---
name: angular-components-list-container
description: ListContainer layout component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# ListContainer Component

The `<smart-list-container>` component is a presentational layout wrapper that groups list items with a semantic `role="list"`. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ListContainerBaseComponent` defines the shared API — optional `IListContainerOptions` and `cssClass` (alias `class`). `ListContainerStandardComponent` is a barebones placeholder concrete implementation that projects content via `<ng-content />` inside a `role="list"` div with an optional `data-variant` attribute. `ListContainerComponent` is the public wrapper that renders `ListContainerStandardComponent` by default and accepts a custom replacement via `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the list container layout component
- Developer asks about `<smart-list-container>`, `ListContainerComponent`, `ListContainerStandardComponent`, or `ListContainerBaseComponent`

## Components

### ListContainerComponent (`<smart-list-container>`)

Main wrapper component. Renders `ListContainerStandardComponent` by default. When `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Children placed inside `<smart-list-container>` are projected into the standard list container or, when the token is provided, into the injected component's default `<ng-content />`.

### ListContainerStandardComponent (`<smart-list-container-standard>`)

Barebones placeholder concrete implementation. Renders a `<div role="list">` that:

- exposes the variant value via `data-variant` (omitted when `options` is not provided),
- applies the external `cssClass` directly on that `<div>`,
- projects all children via `<ng-content />`.

It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### ListContainerBaseComponent (abstract)

Abstract base directive for extending custom list container implementations. Exposes `options` as an `InputSignal<IListContainerOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`). Has no outputs or methods.

## API

### Inputs

| Input     | Type                                              | Default | Description                                             |
| --------- | ------------------------------------------------- | ------- | ------------------------------------------------------- |
| `options` | `InputSignal<IListContainerOptions \| undefined>` | -       | Optional configuration (`variant`, `fullWidthOnMobile`) |
| `class`   | `InputSignal<string>`                             | `''`    | External CSS classes (alias for `cssClass`)             |

### IListContainerOptions

| Field               | Type                        | Default | Description                                                                                                                                               |
| ------------------- | --------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`           | `SmartListContainerVariant` | -       | Exposed as the `data-variant` attribute of the `role="list"` element, a hook for your CSS or a custom implementation; the standard adds no styles for it. |
| `fullWidthOnMobile` | `boolean`                   | -       | Not read by the built-in implementation; available to a custom implementation (edge-to-edge on small screens).                                            |

`SmartListContainerVariant` is `'simple-dividers' | 'card-dividers' | 'separate-cards' | 'flat-card-dividers'`.

```typescript
interface IListContainerOptions {
  variant?: SmartListContainerVariant;
  fullWidthOnMobile?: boolean;
}

type SmartListContainerVariant =
  'simple-dividers' | 'card-dividers' | 'separate-cards' | 'flat-card-dividers';
```

There is no preset for this component: register a component of your own through the token for a styled container.

## LIST_CONTAINER_STANDARD_COMPONENT_TOKEN

InjectionToken from `@smartsoft001/angular` that allows replacing the default `ListContainerStandardComponent` with a custom implementation. Provide a `Type<ListContainerBaseComponent>` in your application or component providers.

```typescript
import { LIST_CONTAINER_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: LIST_CONTAINER_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomListContainerComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';

import { ListContainerBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-list-container',
  template: `
    <ul role="list" [class]="containerClasses()">
      <ng-content />
    </ul>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomListContainerComponent extends ListContainerBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-list-container'];
    const variant = this.options()?.variant;
    if (variant) classes.push(`my-list-container--${variant}`);
    if (this.options()?.fullWidthOnMobile) {
      classes.push('my-list-container--full-width-mobile');
    }
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

The inherited `cssClass` (input alias `class`) receives the class passed to `<smart-list-container>`, and the wrapper projects its content into the implementation's default `<ng-content />` (wrapped in one `display: contents` element), so include `<ng-content />` in the template.

## Usage Examples

```html
<!-- Basic -->
<smart-list-container>
  <div role="listitem">Invoice #1042 was paid</div>
  <div role="listitem">Courtney Henry joined the team</div>
</smart-list-container>

<!-- With a variant hook (data-variant="separate-cards") -->
<smart-list-container [options]="{ variant: 'separate-cards' }">
  <div role="listitem">Invoice #1042 was paid</div>
</smart-list-container>

<!-- With external class -->
<smart-list-container class="smart:my-2">
  <div role="listitem">Invoice #1042 was paid</div>
</smart-list-container>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/list-container/list-container.component.ts`
- Standard: `packages/shared/angular/src/lib/components/list-container/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/list-container/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LIST_CONTAINER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IListContainerOptions`)
