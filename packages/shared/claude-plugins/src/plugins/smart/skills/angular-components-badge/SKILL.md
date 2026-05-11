---
name: angular-components-badge
description: Badge component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Badge Component

The `<smart-badge>` component renders a small inline status / label indicator. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `BadgeBaseComponent` defines the shared API — `text` (required), `color`, `size`, optional `IBadgeOptions`, `cssClass` (alias `class`), a `removed` output, and a `remove()` method that emits `removed`. `BadgeStandardComponent` is a barebones placeholder concrete implementation. `BadgeComponent` is the public wrapper that renders `BadgeStandardComponent` by default and accepts a custom replacement via `BADGE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the badge component
- Developer asks about `<smart-badge>`, `BadgeComponent`, `BadgeStandardComponent`, or `BadgeBaseComponent`

## Components

### BadgeComponent (`<smart-badge>`)

Main wrapper component. Renders `BadgeStandardComponent` by default. When `BADGE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `removed` from the default standard child.

### BadgeStandardComponent (`<smart-badge-standard>`)

Barebones placeholder concrete implementation. Renders a `<span>` host with `data-color` and `data-size` attributes, an optional leading dot when `options.withDot` is true, the badge `text`, and an optional remove button when `options.withRemove` is true that emits the `removed` output on click. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### BadgeBaseComponent (abstract)

Abstract base directive for extending custom badge implementations. Exposes `text` as a required `InputSignal<string>`, `color` as an `InputSignal<SmartBadgeColor>` (default `'gray'`), `size` as an `InputSignal<'sm' | 'md'>` (default `'md'`), `options` as an `InputSignal<IBadgeOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), `removed` as an `OutputEmitterRef<void>`, and a `remove()` method that emits the `removed` output.

## API

### Inputs

| Input     | Type                                      | Default  | Description                                 |
| --------- | ----------------------------------------- | -------- | ------------------------------------------- |
| `text`    | `InputSignal<string>` (required)          | -        | Badge label text                            |
| `color`   | `InputSignal<SmartBadgeColor>`            | `'gray'` | Semantic color of the badge                 |
| `size`    | `InputSignal<'sm' \| 'md'>`               | `'md'`   | Visual size variant                         |
| `options` | `InputSignal<IBadgeOptions \| undefined>` | -        | Optional configuration (variant, dot, etc.) |
| `class`   | `InputSignal<string>`                     | `''`     | External CSS classes (alias for `cssClass`) |

### Outputs

| Output    | Type                     | Description                                                      |
| --------- | ------------------------ | ---------------------------------------------------------------- |
| `removed` | `OutputEmitterRef<void>` | Emits when the user clicks the remove button (with `withRemove`) |

### SmartBadgeColor

```typescript
type SmartBadgeColor =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';
```

### IBadgeOptions

```typescript
interface IBadgeOptions {
  variant?: 'border' | 'flat';
  pill?: boolean;
  withDot?: boolean;
  withRemove?: boolean;
}
```

The standard component only consumes `withDot` (renders a leading bullet) and `withRemove` (renders a remove button that emits `removed`). The remaining properties — `variant` and `pill` — are reserved for custom implementations registered through `BADGE_STANDARD_COMPONENT_TOKEN` and are ignored by `BadgeStandardComponent`.

## BADGE_STANDARD_COMPONENT_TOKEN

```typescript
import { BADGE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `BadgeStandardComponent` with a custom implementation. Provide a `Type<BadgeBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: BADGE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomBadgeComponent,
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

import { BadgeBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-badge',
  template: `
    <span [class]="containerClasses()" [attr.data-color]="color()">
      @if (options()?.withDot) {
        <span aria-hidden="true" class="my-badge-dot">&bull;</span>
      }
      <span class="my-badge-text">{{ text() }}</span>
      @if (options()?.withRemove) {
        <button type="button" aria-label="Remove" (click)="remove()">
          &times;
        </button>
      }
    </span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomBadgeComponent extends BadgeBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-badge-container'];
    if (this.options()?.pill) classes.push('my-badge-pill');
    if (this.options()?.variant === 'border') classes.push('my-badge-border');
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `BADGE_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- call `this.remove()` from your remove button click handler so the `removed` output is emitted consistently.

## Usage Examples

```html
<!-- Basic -->
<smart-badge text="New" />

<!-- Colored -->
<smart-badge text="Active" color="green" />

<!-- Small size -->
<smart-badge text="Beta" size="sm" />

<!-- With leading dot -->
<smart-badge text="Online" color="green" [options]="{ withDot: true }" />

<!-- Removable (handle removed output) -->
<smart-badge
  text="Tag"
  [options]="{ withRemove: true }"
  (removed)="onTagRemoved()"
/>

<!-- With external class -->
<smart-badge text="Note" class="smart:my-2" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/badge/badge.component.ts`
- Standard: `packages/shared/angular/src/lib/components/badge/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/badge/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BADGE_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IBadgeOptions`, `SmartBadgeColor`)
