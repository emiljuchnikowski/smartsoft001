---
name: angular-components-stacked-layout
description: Stacked layout component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Stacked Layout Component

The `<smart-stacked-layout>` component provides a top-to-bottom application shell with a top navigation bar, an optional page header section, and a main content region. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `StackedLayoutBaseComponent` defines the shared API — optional `IStackedLayoutOptions` and `cssClass` (alias `class`). `StackedLayoutStandardComponent` is a barebones placeholder concrete implementation. `StackedLayoutComponent` is the public wrapper that renders `StackedLayoutStandardComponent` by default and accepts a custom replacement via `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the stacked layout component
- Developer asks about `<smart-stacked-layout>`, `StackedLayoutComponent`, `StackedLayoutStandardComponent`, or `StackedLayoutBaseComponent`

## Components

### StackedLayoutComponent (`<smart-stacked-layout>`)

Main wrapper component. Renders `StackedLayoutStandardComponent` by default. When `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it the `options` and `class` inputs. Accepts main content via projected `<ng-content>`, which reaches the `<ng-content />` of whichever implementation renders (the standard, the preset or a custom one).

### StackedLayoutStandardComponent (`<smart-stacked-layout-standard>`)

Barebones native-HTML implementation. Renders a wrapper `<div data-container-width="…">` with a top `<header>` containing a `<nav>`, an optional second `<header>` for the page heading section (`options.headerTpl` when provided, otherwise `<h1 data-role="title">{{ options.title }}</h1>` when `options.title` is set), and a `<main>` element that projects `<ng-content>`. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling.

### StackedLayoutBaseComponent (abstract)

Abstract base directive for extending custom stacked-layout implementations. Exposes `options` as an `InputSignal<IStackedLayoutOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                              | Default | Description                                                  |
| --------- | ------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `options` | `InputSignal<IStackedLayoutOptions \| undefined>` | -       | Optional configuration (title, navTpl, headerTpl, container) |
| `class`   | `InputSignal<string>`                             | `''`    | External CSS classes (alias for `cssClass`)                  |

### IStackedLayoutOptions

| Field            | Type                               | Default | Description                                                                                                                               |
| ---------------- | ---------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `title`          | `string`                           | -       | Page title, rendered as `<h1 data-role="title">` when `headerTpl` is not set.                                                             |
| `navTpl`         | `TemplateRef<unknown>`             | -       | Navigation at the top (inside the `<nav>`).                                                                                               |
| `headerTpl`      | `TemplateRef<unknown>`             | -       | The page header beneath the navigation; wins over `title`.                                                                                |
| `containerWidth` | `SmartStackedLayoutContainerWidth` | `'xl'`  | Width of the header and content containers in the preset (see the mapping below); the standard only exposes it as `data-container-width`. |

`SmartStackedLayoutContainerWidth` is `'sm' | 'md' | 'lg' | 'xl' | 'full'`.

```typescript
type SmartStackedLayoutContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface IStackedLayoutOptions {
  title?: string;
  navTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  containerWidth?: SmartStackedLayoutContainerWidth; // styled by the preset
}
```

## STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN

InjectionToken that allows replacing the default `StackedLayoutStandardComponent` with a custom implementation. Provide a component class extending `StackedLayoutBaseComponent` under `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`; every `<smart-stacked-layout>` below that injector renders it.

```typescript
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomStackedLayoutComponent,
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
import { NgTemplateOutlet } from '@angular/common';

import { StackedLayoutBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-stacked-layout',
  template: `
    <div [class]="containerClasses()">
      <header class="top-bar">
        <nav>
          @if (options()?.navTpl) {
            <ng-container [ngTemplateOutlet]="options()!.navTpl!" />
          }
        </nav>
      </header>
      @if (options()?.headerTpl) {
        <header class="page-header">
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      }
      <main>
        <ng-content />
      </main>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomStackedLayoutComponent extends StackedLayoutBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-stacked-layout'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- accept main content via `<ng-content>` so consumers can project arbitrary page content (the wrapper projects its content into it),
- use `[ngTemplateOutlet]` to render `options().navTpl` and `options().headerTpl`.

## Usage Examples

```html
<!-- Basic with main content -->
<smart-stacked-layout>
  <h1>Hello</h1>
</smart-stacked-layout>

<!-- With navigation template -->
<ng-template #nav>
  <a routerLink="/">Dashboard</a>
  <a routerLink="/team">Team</a>
</ng-template>

<smart-stacked-layout [options]="{ navTpl: nav }">
  <p>Main content</p>
</smart-stacked-layout>

<!-- With page header -->
<ng-template #header>
  <h1>Dashboard</h1>
</ng-template>

<smart-stacked-layout [options]="{ navTpl: nav, headerTpl: header }">
  <p>Main content</p>
</smart-stacked-layout>

<!-- With external class -->
<smart-stacked-layout class="smart:bg-gray-50">
  <p>Main content</p>
</smart-stacked-layout>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/stacked-layout/stacked-layout.component.ts`
- Standard: `packages/shared/angular/src/lib/components/stacked-layout/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/stacked-layout/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/stacked-layout/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IStackedLayoutOptions`)

## HyperUI preset

`StackedLayoutPresetComponent` (`<smart-stacked-layout-preset>`) is the HyperUI-styled drop-in for `StackedLayoutStandardComponent`. It uses the same `IStackedLayoutOptions` API — no interface changes, no new options fields — and delivers the page scaffold in the HyperUI container rhythm.

- **Page root** (`data-role="root"`): full-height gray surface — `smart:min-h-full smart:bg-gray-50 smart:dark:bg-gray-900`. The external `cssClass` is merged here.
- **Header zone**: white bar (`smart:bg-white smart:shadow-sm smart:dark:bg-gray-800 smart:dark:border-b smart:dark:border-gray-700`) whose inner container (`data-role="header"`, `smart:py-4`) renders `navTpl` (`data-role="nav"`), then `headerTpl` if present, else `title` as an `<h1 data-role="title">` fallback.
- **Main content** (`data-role="content"`, `smart:py-8`): the container wraps a bordered content card (`smart:rounded-lg smart:border smart:bg-white smart:p-4 smart:shadow-sm smart:sm:p-6 smart:dark:bg-gray-800`) that projects `<ng-content>` — identical projection semantics to the standard component.

### containerWidth mapping

Both the header and content containers share the base `smart:mx-auto smart:px-4 smart:sm:px-6 smart:lg:px-8` plus a max-width from `options.containerWidth`, as listed below.

| containerWidth       | max-width class    |
| -------------------- | ------------------ |
| `sm`                 | `smart:max-w-3xl`  |
| `md`                 | `smart:max-w-5xl`  |
| `lg`                 | `smart:max-w-6xl`  |
| `xl` (default/unset) | `smart:max-w-7xl`  |
| `full`               | `smart:max-w-none` |

### Token registration

Provide `StackedLayoutPresetComponent` under `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-stacked-layout>`, or register every preset of the library at once with `provideSmartPresets()`. The preset declares `cssClass` without the `class` alias: bind `[cssClass]` when you use `<smart-stacked-layout-preset>` directly; on `<smart-stacked-layout>` pass `class` as usual.

```typescript
import {
  STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
  StackedLayoutPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: StackedLayoutPresetComponent,
  },
];
```

### Documented gaps

The preset delivers the page scaffold only. For "content + image" sections, project `<smart-section-heading>` blocks (with the section-heading preset) into the stacked-layout content region.
