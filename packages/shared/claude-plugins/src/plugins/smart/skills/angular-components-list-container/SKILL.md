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

Main wrapper component. Renders `ListContainerStandardComponent` by default. When `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Supports content projection through `<ng-content />` in the default branch, so children placed inside `<smart-list-container>` are rendered inside the standard list container.

### ListContainerStandardComponent (`<smart-list-container-standard>`)

Barebones placeholder concrete implementation. Renders a `<div role="list">` that:

- exposes the variant value via `data-variant` (omitted when `options` is not provided),
- applies the external `cssClass` directly on the host div,
- projects all children via `<ng-content />`.

It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### ListContainerBaseComponent (abstract)

Abstract base directive for extending custom list container implementations. Exposes `options` as an `InputSignal<IListContainerOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`). Has no outputs or methods.

## API

### Inputs

| Input     | Type                                              | Default | Description                                         |
| --------- | ------------------------------------------------- | ------- | --------------------------------------------------- |
| `options` | `InputSignal<IListContainerOptions \| undefined>` | -       | Optional configuration (variant, fullWidthOnMobile) |
| `class`   | `InputSignal<string>`                             | `''`    | External CSS classes (alias for `cssClass`)         |

### IListContainerOptions

```typescript
interface IListContainerOptions {
  variant?: SmartListContainerVariant;
  fullWidthOnMobile?: boolean;
}

type SmartListContainerVariant =
  | 'simple'
  | 'card'
  | 'separate-cards'
  | 'flat-card-dividers';
```

The standard component only consumes `variant` (placeholder behavior — applied as the `data-variant` attribute on the list root). The `fullWidthOnMobile` flag is reserved for custom implementations registered through `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN` and is ignored by `ListContainerStandardComponent`.

## LIST_CONTAINER_STANDARD_COMPONENT_TOKEN

```typescript
import { LIST_CONTAINER_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ListContainerStandardComponent` with a custom implementation. Provide a `Type<ListContainerBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ListContainerBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-list-container',
  template: `
    <div role="list" [class]="containerClasses()">
      <ng-content />
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomListContainerComponent extends ListContainerBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `LIST_CONTAINER_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- include `<ng-content />` in your template so consumers can project list items.

## Usage Examples

```html
<!-- Basic -->
<smart-list-container>
  <smart-list-item />
  <smart-list-item />
</smart-list-container>

<!-- With variant -->
<smart-list-container [options]="{ variant: 'separate-cards' }">
  <smart-list-item />
</smart-list-container>

<!-- Full width on mobile (consumed by custom implementations) -->
<smart-list-container [options]="{ variant: 'card', fullWidthOnMobile: true }">
  <smart-list-item />
</smart-list-container>

<!-- With external class -->
<smart-list-container class="smart:my-2">
  <smart-list-item />
</smart-list-container>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/list-container/list-container.component.ts`
- Standard: `packages/shared/angular/src/lib/components/list-container/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/list-container/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LIST_CONTAINER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IListContainerOptions`)
