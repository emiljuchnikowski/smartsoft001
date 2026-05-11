---
name: angular-components-drawer
description: Drawer component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Drawer Component

The `<smart-drawer>` component provides a side panel overlay (left/right) with optional header, close button, and backdrop. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `DrawerBaseComponent` defines the shared API — `open` (two-way `ModelSignal<boolean>`), `title`, optional `IDrawerOptions`, `cssClass` (alias `class`), a `closed` output, and a `close()` method that sets `open` to `false` and emits `closed`. `DrawerStandardComponent` is a barebones placeholder concrete implementation. `DrawerComponent` is the public wrapper that renders `DrawerStandardComponent` by default and accepts a custom replacement via `DRAWER_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the drawer component
- Developer asks about `<smart-drawer>`, `DrawerComponent`, `DrawerStandardComponent`, or `DrawerBaseComponent`

## Components

### DrawerComponent (`<smart-drawer>`)

Main wrapper component. Renders `DrawerStandardComponent` by default. When `DRAWER_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### DrawerStandardComponent (`<smart-drawer-standard>`)

Barebones placeholder concrete implementation. When `open()` is `true`, renders an optional overlay `<div class="drawer-overlay">` (when `options.withOverlay`) and an `<aside role="dialog" aria-modal="true">` with a `data-position` attribute (`left` or `right`, default `right`). When a `title` is provided, the aside includes a `<header>` with an `<h2 id="smart-drawer-title">` and a close `<button aria-label="Close">`. Projected content is rendered via `<ng-content />`. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### DrawerBaseComponent (abstract)

Abstract base directive for extending custom drawer implementations. Exposes `open` as a two-way `ModelSignal<boolean>` (default `false`), `title` as an `InputSignal<string | undefined>`, `options` as an `InputSignal<IDrawerOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), a `closed` output, and a `close()` method that sets `open` to `false` and emits `closed`.

## API

### Inputs

| Input     | Type                                       | Default | Description                                     |
| --------- | ------------------------------------------ | ------- | ----------------------------------------------- |
| `open`    | `ModelSignal<boolean>`                     | `false` | Whether the drawer is open (two-way bindable)   |
| `title`   | `InputSignal<string \| undefined>`         | -       | Optional drawer title (renders header when set) |
| `options` | `InputSignal<IDrawerOptions \| undefined>` | -       | Optional configuration                          |
| `class`   | `InputSignal<string>`                      | `''`    | External CSS classes (alias for `cssClass`)     |

### Outputs

| Output   | Type           | Description                                                |
| -------- | -------------- | ---------------------------------------------------------- |
| `closed` | `output<void>` | Emitted when the drawer is closed (programmatic or button) |

### IDrawerOptions

```typescript
interface IDrawerOptions {
  position?: 'left' | 'right';
  wide?: boolean;
  withOverlay?: boolean;
  brandedHeader?: boolean;
  stickyFooter?: boolean;
  variant?: SmartDrawerVariant;
}

type SmartDrawerVariant =
  | 'empty'
  | 'create-form'
  | 'user-profile'
  | 'contact-list'
  | 'file-details';
```

The standard component only consumes `position` (mapped to the `data-position` attribute on the aside, default `'right'`) and `withOverlay` (toggles the backdrop overlay). The remaining properties — `wide`, `brandedHeader`, `stickyFooter`, and `variant` — are reserved for custom implementations registered through `DRAWER_STANDARD_COMPONENT_TOKEN` and are ignored by `DrawerStandardComponent`.

## DRAWER_STANDARD_COMPONENT_TOKEN

```typescript
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DrawerStandardComponent` with a custom implementation. Provide a `Type<DrawerBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: DRAWER_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomDrawerComponent,
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

import { DrawerBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-drawer',
  template: `
    @if (open()) {
      @if (options()?.withOverlay) {
        <div class="my-drawer-overlay" (click)="close()"></div>
      }
      <aside
        role="dialog"
        aria-modal="true"
        [class]="containerClasses()"
        [attr.data-position]="options()?.position ?? 'right'"
      >
        @if (title()) {
          <header [class.branded]="options()?.brandedHeader">
            <h2>{{ title() }}</h2>
            <button type="button" aria-label="Close" (click)="close()">
              &times;
            </button>
          </header>
        }
        <!-- Custom implementations should expose data inputs instead of ng-content -->
      </aside>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomDrawerComponent extends DrawerBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-drawer'];
    if (this.options()?.wide) classes.push('my-drawer--wide');
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `DRAWER_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- call `this.close()` from your close affordances — it sets `open` to `false` and emits `closed` for you.

### Content Projection Limitation

`DrawerStandardComponent` uses `<ng-content />` to project arbitrary children, but **`NgComponentOutlet` does not propagate projected content** to dynamically rendered components. When supplying a custom implementation via `DRAWER_STANDARD_COMPONENT_TOKEN`, do **not** rely on `<ng-content />`. Instead, expose data inputs (e.g. additional `input()` properties) on your subclass and render them inside the component template. Consumers then pass structured data to `<smart-drawer>` rather than projected DOM nodes.

## Accessibility

- The aside is rendered with `role="dialog"` and `aria-modal="true"` so assistive technologies treat it as a modal dialog.
- When a `title` is provided, the aside is labelled via `aria-labelledby="smart-drawer-title"` (matching the `<h2 id="smart-drawer-title">` inside the header). Without a title, no label is set — supply one through `class`-scoped styling or wrap the drawer in a labelled landmark if needed.
- The header close button has `aria-label="Close"`.
- Positioning is exposed declaratively via the `data-position="left|right"` attribute on the aside, allowing CSS to style left- vs right-anchored drawers without runtime branching. Default is `right`.
- The overlay (when `options.withOverlay` is `true`) closes the drawer on click.

## Usage Examples

```html
<!-- Basic -->
<smart-drawer [(open)]="isOpen">
  <p>Drawer content</p>
</smart-drawer>

<!-- With title and close button -->
<smart-drawer [(open)]="isOpen" title="Settings">
  <p>Drawer content</p>
</smart-drawer>

<!-- Left-positioned with overlay -->
<smart-drawer
  [(open)]="isOpen"
  title="Menu"
  [options]="{ position: 'left', withOverlay: true }"
>
  <nav>...</nav>
</smart-drawer>

<!-- Listening for close -->
<smart-drawer [(open)]="isOpen" (closed)="onDrawerClosed()"> ... </smart-drawer>

<!-- With external class -->
<smart-drawer [(open)]="isOpen" class="smart:max-w-md">...</smart-drawer>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/drawer/drawer.component.ts`
- Standard: `packages/shared/angular/src/lib/components/drawer/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/drawer/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DRAWER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDrawerOptions`, `SmartDrawerVariant`)
