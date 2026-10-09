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

### DrawerPresetComponent (`<smart-drawer-preset>`)

Fully-styled variation that extends `DrawerBaseComponent` and is a drop-in replacement for `DrawerStandardComponent`. Register it for `DRAWER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-drawer>` (or every preset at once with `provideSmartPresets()`), or use the `<smart-drawer-preset>` selector directly. It renders the translated Preline **offcanvas** look: a fixed, sliding side panel (`role="dialog"`, `aria-modal="true"`, `tabindex="-1"`) with a header (title + circular close button with the Preline X icon), a `<ng-content />` body, and an optional dimmed backdrop. It consumes `options.position` (`left`/`right`, default `right` → `data-position` + start/end placement), `options.wide` (`max-w-xs` → `max-w-md`), `options.withOverlay` (renders a click-to-close backdrop), and `options.brandedHeader` (blue header bar with inverted title/close styling). Open/close is Angular-driven via the `open` model + `@if` and `close()` (no Preline JS runtime). All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal (not exported from `@smartsoft001/angular`). The header is always rendered, with or without `title`.

> The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` when you use the `<smart-drawer-preset>` selector directly; `class` on `<smart-drawer>` reaches it through the wrapper.
>
> The preset's body is its `<ng-content />`: the wrapper hands the content projected into `<smart-drawer>` to the registered implementation, and the `<smart-drawer-preset>` selector takes projected content directly. It does not consume `options.stickyFooter` (no footer slot in the base API) or `options.variant` (content-type variants are projected content, not built into the offcanvas shell). Top/bottom placements from the Preline reference are not expressible — `IDrawerOptions.position` is `left | right` only.

### DrawerBaseComponent (abstract)

Abstract base directive for extending custom drawer implementations. Exposes `open` as a two-way `ModelSignal<boolean>` (default `false`), `title` as an `InputSignal<string | undefined>`, `options` as an `InputSignal<IDrawerOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), a `closed` output, and a `close()` method that sets `open` to `false` and emits `closed`.

## API

### Inputs

| Input     | Type                                       | Default | Description                                            |
| --------- | ------------------------------------------ | ------- | ------------------------------------------------------ |
| `open`    | `ModelSignal<boolean>`                     | `false` | Whether the drawer is open (two-way bindable)          |
| `title`   | `InputSignal<string \| undefined>`         | -       | Optional drawer title (renders header when set)        |
| `options` | `InputSignal<IDrawerOptions \| undefined>` | -       | Optional configuration                                 |
| `class`   | `InputSignal<string>`                      | `''`    | Classes on the panel (`cssClass` input, alias `class`) |

### Outputs

| Output       | Type                        | Description                                                                        |
| ------------ | --------------------------- | ---------------------------------------------------------------------------------- |
| `closed`     | `OutputEmitterRef<void>`    | Emitted when the drawer closes itself (`close()`: the close button or the overlay) |
| `openChange` | `OutputEmitterRef<boolean>` | The `open` model's change event, for `[(open)]`                                    |

### IDrawerOptions

| Field           | Type                 | Default   | Description                                                                                                              |
| --------------- | -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `position`      | `'left' \| 'right'`  | `'right'` | The side the panel opens on. The standard writes it to the `data-position` attribute; the preset places the panel there. |
| `withOverlay`   | `boolean`            | -         | Renders a backdrop; a click on it closes the drawer (standard and preset).                                               |
| `wide`          | `boolean`            | -         | A wider panel (`max-w-md` instead of `max-w-xs`). Preset only.                                                           |
| `brandedHeader` | `boolean`            | -         | A blue header bar with inverted title and close button. Preset only.                                                     |
| `stickyFooter`  | `boolean`            | -         | Not read by the built-in implementations; available to a custom implementation.                                          |
| `variant`       | `SmartDrawerVariant` | -         | Not read by the built-in implementations; available to a custom implementation.                                          |

`SmartDrawerVariant` is `'empty' | 'create-form' | 'user-profile' | 'contact-list' | 'file-details'`.

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
  'empty' | 'create-form' | 'user-profile' | 'contact-list' | 'file-details';
```

The standard component only consumes `position` (mapped to the `data-position` attribute on the aside, default `'right'`) and `withOverlay` (toggles the backdrop overlay).

## DRAWER_STANDARD_COMPONENT_TOKEN

```typescript
import { DRAWER_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `DrawerStandardComponent` with a custom implementation. Provide a `Type<DrawerBaseComponent>` to override. The wrapper passes `open`, `title`, `options` and the class, hands over the projected content, and re-emits the implementation's `closed` and `open` changes.

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
        <ng-content />
      </aside>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomDrawerComponent extends DrawerBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-drawer'];
    if (this.options()?.wide) classes.push('my-drawer--wide');
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, call `this.close()` from your close affordances: it sets `open` to `false` and emits `closed` for you. Keep the inherited `cssClass` (alias `class`): the wrapper passes the class under the name the component declares.

## Content Projection

`DrawerStandardComponent` uses `<ng-content />` to project arbitrary children. A custom implementation registered via `DRAWER_STANDARD_COMPONENT_TOKEN` receives the same content in its default `<ng-content />` slot, so it can show or hide the slot with `@if (open())` like the standard drawer, and control flow at the root of the projected content keeps working. The content arrives wrapped in one `display: contents` element: selectors on the slot's parent that target its direct children (`space-y-*`, `divide-*`, `> *`) do not reach the projected nodes.

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
- Preset variation: `packages/shared/angular/src/lib/components/drawer/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/drawer/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/drawer/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`DRAWER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IDrawerOptions`, `SmartDrawerVariant`)
