---
name: angular-components-container
description: Container layout component API, DI token, and base class for @smartsoft001/angular
user-invocable: false
---

# Container Component

Layout primitive that constrains/wraps page content. The `<smart-container>` wrapper renders `ContainerStandardComponent` by default (a neutral `<div>` that exposes `data-mode` / `data-padding` attributes for downstream styling). Consumers can replace the standard with a custom variant via `CONTAINER_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants a layout container that wraps page content → use `<smart-container>`
- Developer needs constrained/full-width modes or controlled padding → set `[options]`
- Developer wants a custom visual variant → extend `ContainerBaseComponent` and provide via `CONTAINER_STANDARD_COMPONENT_TOKEN`

## Public API

### Wrapper: `smart-container`

| Input     | Type                | Default     | Description                |
| --------- | ------------------- | ----------- | -------------------------- |
| `options` | `IContainerOptions` | `undefined` | Layout configuration       |
| `class`   | `string`            | `''`        | Extra CSS class on wrapper |

### IContainerOptions

```typescript
interface IContainerOptions {
  mode?: 'full-width' | 'constrained' | 'container';
  padding?: 'none' | 'mobile' | 'always';
  narrow?: boolean;
}
```

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

<!-- Narrow variant with extra class -->
<smart-container
  [options]="{ mode: 'constrained', narrow: true }"
  class="my-section"
>
  <p>Content</p>
</smart-container>
```

## Architecture

Three-layer pattern mirroring `<smart-toggle>`:

1. **`ContainerBaseComponent`** (`@Directive()`) — shared signals/inputs (`options`, `cssClass` via `class` alias) and the `smartType = 'container'` discriminator. No outputs, no methods.
2. **`ContainerStandardComponent`** (selector: `smart-container-standard`) — default concrete implementation extending the base. Renders a single `<div>` with `[class]`, `[attr.data-mode]`, `[attr.data-padding]`, and `<ng-content />`.
3. **`ContainerComponent`** (selector: `smart-container`) — wrapper. Uses `inject(CONTAINER_STANDARD_COMPONENT_TOKEN, { optional: true })` + `*ngComponentOutlet` to render the injected component, falling back to `<smart-container-standard>` with `<ng-content />` inside it so default-mode projection works.

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
    <!-- NOTE: ng-content does NOT work here when injected via the token -->
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

## Content Projection Limitation (IMPORTANT)

The wrapper uses `*ngComponentOutlet` to render any token-provided implementation. **`NgComponentOutlet` does not forward content projection** — children placed between `<smart-container>...</smart-container>` are dropped when an injected component is active.

Consequences for custom implementations:

- The default `ContainerStandardComponent` works fine because the wrapper places `<ng-content />` directly inside `<smart-container-standard>` in the default branch.
- A custom component provided via `CONTAINER_STANDARD_COMPONENT_TOKEN` **must not rely on `<ng-content />`**. Instead, drive the rendered content through inputs (e.g. `options`, additional input signals on the custom subclass, or a `TemplateRef` input).
- If you genuinely need projected children with a custom variant, expose a `bodyTpl: input<TemplateRef>()` style input and render it with `<ng-container *ngTemplateOutlet="bodyTpl()" />`.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/container/container.component.ts`
- Default: `packages/shared/angular/src/lib/components/container/standard/standard.component.{ts,html}`
- Base: `packages/shared/angular/src/lib/components/container/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/container/{container,standard/standard,base/base}.component.spec.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CONTAINER_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IContainerOptions`)
