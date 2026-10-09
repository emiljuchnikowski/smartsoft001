---
name: angular-components-container
description: Container layout component API, DI token, and base class for @smartsoft001/angular
user-invocable: false
---

# Container Component

Layout primitive that constrains/wraps page content. The `<smart-container>` wrapper renders `ContainerStandardComponent` by default (a neutral `<div>` that exposes `data-mode` / `data-padding` attributes for downstream styling). `ContainerPresetComponent` maps the options to real Tailwind layout utilities. Consumers can replace the standard with the preset or a custom variant via `CONTAINER_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants a layout container that wraps page content → use `<smart-container>`
- Developer needs constrained/full-width modes or controlled padding → set `[options]`
- Developer wants a custom visual variant → extend `ContainerBaseComponent` and provide via `CONTAINER_STANDARD_COMPONENT_TOKEN`

## Public API

### Wrapper: `smart-container`

| Input     | Type                | Default     | Description                                                             |
| --------- | ------------------- | ----------- | ----------------------------------------------------------------------- |
| `options` | `IContainerOptions` | `undefined` | Layout configuration                                                    |
| `class`   | `string`            | `''`        | Extra CSS classes on the container `<div>` of the active implementation |

### IContainerOptions

| Field     | Type                                           | Default     | Description                                                                                                                                                             |
| --------- | ---------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`    | `'full-width' \| 'constrained' \| 'container'` | `undefined` | The standard writes it to `data-mode`. In the preset: `container` centres at `max-w-7xl`, `constrained` at `max-w-5xl`, `full-width` (also when unset) spans the width. |
| `padding` | `'none' \| 'mobile' \| 'always'`               | `undefined` | The standard writes it to `data-padding`. In the preset: `always` pads at every breakpoint, `mobile` only below `sm`, `none` (also when unset) not at all.              |
| `narrow`  | `boolean`                                      | `undefined` | Preset only (the standard ignores it): tightens the width to `max-w-3xl`, centred, whatever the mode.                                                                   |

### Content Projection

| Selector | Description                              |
| -------- | ---------------------------------------- |
| default  | Body content rendered inside the wrapper |

## Usage

```html
<!-- Basic -->
<smart-container>
  <p>Content</p>
</smart-container>

<!-- Constrained mode with mobile-only padding -->
<smart-container [options]="{ mode: 'constrained', padding: 'mobile' }">
  <p>Content</p>
</smart-container>

<!-- Narrow column (preset) with an extra class -->
<smart-container
  [options]="{ mode: 'constrained', narrow: true }"
  class="my-section"
>
  <p>Content</p>
</smart-container>
```

## Architecture

Three-layer pattern mirroring `<smart-toggle>`:

1. **`ContainerBaseComponent`** (`@Directive()`) — shared inputs (`options`, `cssClass` with the `class` alias) and the `smartType = 'container'` discriminator. No outputs, no methods.
2. **`ContainerStandardComponent`** (selector: `smart-container-standard`) — default concrete implementation extending the base. Renders a single `<div>` with `[class]`, `[attr.data-mode]`, `[attr.data-padding]`, and `<ng-content />`.
3. **`ContainerComponent`** (selector: `smart-container`) — wrapper. Uses `inject(CONTAINER_STANDARD_COMPONENT_TOKEN, { optional: true })` + `*ngComponentOutlet` to render the injected component, falling back to `<smart-container-standard>`. It passes `options` and `class` to the injected component and captures the projected content once, so it reaches whichever renders: the standard component, or the injected component's default `<ng-content />`.

## Overriding with Custom Implementation

```typescript
import { Component } from '@angular/core';
import {
  ContainerBaseComponent,
  CONTAINER_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';

@Component({
  selector: 'smart-container-my-variant',
  template: `<section [class]="cssClass()">
    <ng-content />
  </section>`,
})
export class ContainerMyVariantComponent extends ContainerBaseComponent {}

// In app bootstrap:
providers: [
  {
    provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
    useValue: ContainerMyVariantComponent,
  },
];
```

A subclass of `ContainerBaseComponent` registered under `CONTAINER_STANDARD_COMPONENT_TOKEN` replaces the standard component in every `<smart-container>` of that injector. It reads `options()` and `cssClass()` (the wrapper's `class`) and renders the children in its default `<ng-content />`.

## Content Projection

The wrapper uses `*ngComponentOutlet` to render any token-provided implementation and passes the children placed between `<smart-container>...</smart-container>` to it as outlet content, so they render in the injected component's default `<ng-content />` slot.

Consequences for custom implementations:

- The default `ContainerStandardComponent` receives the children through its `<ng-content />` as before.
- A custom component provided via `CONTAINER_STANDARD_COMPONENT_TOKEN` gets them in its first `<ng-content />` (put the default slot first if it also has `select` slots).
- The children arrive wrapped in one `display: contents` element. Layout (flex, grid, `gap`) is unaffected, but selectors on the slot's parent that target its direct children (`space-y-*`, `divide-*`, `> *`) do not reach them.

## Preset

`ContainerPresetComponent` (selector `smart-container-preset`) is a styled drop-in for the neutral standard component. It `extends ContainerStandardComponent` and maps `IContainerOptions` to real Tailwind layout utilities (all `smart:`-prefixed) on a single root `<div data-role="container">` that preserves `<ng-content />`. No new options fields are introduced.

Class mapping (computed by an internal helper of the preset, not exported):

| Option                       | Classes                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `mode: 'container'`          | `smart:mx-auto smart:max-w-7xl`                                                               |
| `mode: 'constrained'`        | `smart:mx-auto smart:max-w-5xl`                                                               |
| `mode: 'full-width'` / unset | `smart:w-full`                                                                                |
| `narrow: true`               | tightens max-width to `smart:max-w-3xl` (wins over the mode max-width, stays `smart:mx-auto`) |
| `padding: 'always'`          | `smart:px-4 smart:sm:px-6 smart:lg:px-8`                                                      |
| `padding: 'mobile'`          | `smart:px-4 smart:sm:px-0`                                                                    |
| `padding: 'none'` / unset    | no padding classes                                                                            |

The extra classes (`class` on the wrapper, or `class` / `[cssClass]` on `<smart-container-preset>` used directly) are appended after the mapped classes.

Register it through `CONTAINER_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-container>`, or register every preset at once with `provideSmartPresets()`.

```typescript
providers: [
  {
    provide: CONTAINER_STANDARD_COMPONENT_TOKEN,
    useValue: ContainerPresetComponent,
  },
];
```

Projected children render both through `<smart-container>` with the preset registered on the token and with `<smart-container-preset>` used directly (see "Content Projection" above). Story: `container.component.stories.ts` → `Preset`.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/container/container.component.ts`
- Default: `packages/shared/angular/src/lib/components/container/standard/standard.component.{ts,html}`
- Preset: `packages/shared/angular/src/lib/components/container/preset/preset.component.ts` + `preset/preset-classes.util.ts` (internal)
- Base: `packages/shared/angular/src/lib/components/container/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/container/{container,standard/standard,base/base,preset/preset}.component.spec.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CONTAINER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IContainerOptions`)
