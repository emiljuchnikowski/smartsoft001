---
name: angular-components-loader
description: Loader component API, a spinner shown while show is true, sized and coloured through inputs, with a styled preset and an InjectionToken pattern for custom implementations.
user-invocable: false
---

# Loader Component

`<smart-loader>` renders a spinner while something loads. It takes a size and a colour, hides itself until `show` is true, and can be replaced application-wide through an injection token.

`size` and `color` use the shared `SmartSize` / `SmartColor` scales. `<smart-list>` renders it while its provider loads and `<smart-input>` while an async validator runs, so a loader registered through `LOADER_STANDARD_COMPONENT_TOKEN` changes those too. It follows the Base + Standard + Wrapper pattern: `LoaderBaseComponent` owns the inputs and the spinner classes, `LoaderStandardComponent` is the default rendering, `LoaderPresetComponent` the styled one.

## When to Use This Skill

- Showing that something is loading in place of, or next to, content
- Changing the spinner used across the library (`LOADER_STANDARD_COMPONENT_TOKEN`)
- Developer asks about `<smart-loader>`, `LoaderComponent`, `LoaderStandardComponent`, `LoaderPresetComponent` or `LoaderBaseComponent`

## Components

### LoaderComponent (`<smart-loader>`)

The wrapper. Renders `LoaderStandardComponent` by default. When `LOADER_STANDARD_COMPONENT_TOKEN` is provided, it renders the injected component through `NgComponentOutlet` and forwards `show`, `size`, `color` and `class` to it, resolved to the names that component declares, so a custom implementation extending `LoaderBaseComponent` receives the class in its inherited `cssClass` input; an input the component does not declare is left out. Its host element is `display: contents` (`smart:contents`), so it adds no box of its own.

### LoaderStandardComponent (`<smart-loader-standard>`)

The default implementation: while `show` is true, an SVG spinner (`role="status"`, `aria-label="loading"`) that gets its size class from `size` and its text colour from `color`, with `class` appended. It renders nothing while `show` is false.

### LoaderPresetComponent (`<smart-loader-preset>`)

A styled, drop-in variation that renders the Preline default spinner (a bordered ring with a transparent top border). Register it through `LOADER_STANDARD_COMPONENT_TOKEN` (or register every preset at once with `provideSmartPresets()`) to restyle every `<smart-loader>`, or use its selector directly. The preset declares `cssClass` without the `class` alias: through `<smart-loader>` the class still reaches it; used directly, `<smart-loader-preset>` takes extra classes as `[cssClass]`.

The ring is `smart:border-3 smart:border-current smart:border-t-transparent smart:rounded-full`, spinning, sized like the standard and coloured `smart:text-<color>-600` with an explicit `smart:dark:` shade for every colour (`-400` for `slate`, `gray`, `zinc`, `neutral` and `stone`, `-500` for the others). It keeps `role="status"` and `aria-label="loading"` and adds a `smart:sr-only` "Loading..." text. The class recipe (`preset/preset-classes.util.ts`) is internal, not exported from `@smartsoft001/angular`.

### LoaderBaseComponent (abstract)

The base directive the variations extend. It owns the inputs and the `spinnerClasses` signal that turns `size` and `color` into Tailwind classes, so a custom implementation only has to provide a template.

| Member           | Type                            | Description                                                                                     |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `spinnerClasses` | `Signal<string[]>`              | `smart:animate-spin`, the size class, `smart:text-<color>-600`, then `cssClass` when it is set. |
| `smartType`      | `DynamicComponentType` (static) | `'loader'`.                                                                                     |

## API

### Inputs

| Input   | Type                      | Default    | Description                                                                             |
| ------- | ------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `show`  | `InputSignal<boolean>`    | `false`    | Whether the spinner is visible                                                          |
| `size`  | `InputSignal<SmartSize>`  | `'md'`     | One of `xs`, `sm`, `md`, `lg`, `xl`; maps to `smart:size-4`, `-5`, `-6`, `-8` and `-10` |
| `color` | `InputSignal<SmartColor>` | `'indigo'` | Any colour of the shared palette; maps to a `smart:text-*-600` class                    |
| `class` | `InputSignal<string>`     | `''`       | Extra CSS classes on the spinner (`cssClass` input, alias `class`)                      |

The loader emits no outputs.

### LOADER_STANDARD_COMPONENT_TOKEN

An injection token from `@smartsoft001/angular`. Provide a `Type<LoaderBaseComponent>` (for example `LoaderPresetComponent` or your own subclass) in your application or component providers to replace the default spinner everywhere `<smart-loader>` is used; `provideSmartPresets()` provides `LoaderPresetComponent` for it together with every other preset.

```typescript
import {
  LOADER_STANDARD_COMPONENT_TOKEN,
  LoaderPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: LOADER_STANDARD_COMPONENT_TOKEN,
    useValue: LoaderPresetComponent,
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
import { LoaderBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-dots-loader',
  template: `
    @if (show()) {
      <span role="status" aria-label="loading" [class]="classes()">…</span>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyDotsLoaderComponent extends LoaderBaseComponent {
  classes = computed(() => this.spinnerClasses().join(' '));
}
```

Register `MyDotsLoaderComponent` through `LOADER_STANDARD_COMPONENT_TOKEN` and every `<smart-loader>` in that injector renders it, `<smart-list>` and `<smart-input>` included.

## Usage Examples

```html
<!-- Default spinner -->
<smart-loader [show]="loading()"></smart-loader>

<!-- Size and colour -->
<smart-loader [show]="saving()" size="sm" color="blue"></smart-loader>

<!-- The preset, used directly -->
<smart-loader-preset [show]="saving()" size="lg"></smart-loader-preset>

<!-- With external class -->
<smart-loader class="smart:mx-auto" [show]="loading()"></smart-loader>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/loader/loader.component.ts`
- Standard: `packages/shared/angular/src/lib/components/loader/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/loader/preset/preset.component.ts` (classes: `preset/preset-classes.util.ts`, internal)
- Base class: `packages/shared/angular/src/lib/components/loader/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/loader/loader.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`LOADER_STANDARD_COMPONENT_TOKEN`)
- Usage example: `docs/examples/angular/src/components/loader/usage.example.ts` and `usage.example.html`
