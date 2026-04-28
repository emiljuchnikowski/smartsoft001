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

Main wrapper component. Renders `StackedLayoutStandardComponent` by default. When `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Accepts main content via projected `<ng-content>`.

### StackedLayoutStandardComponent (`<smart-stacked-layout-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` with a top `<header>` containing a `<nav>`, an optional second `<header>` for the page heading section (rendered when `options.headerTpl` is provided), and a `<main>` element that projects `<ng-content>`. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### StackedLayoutBaseComponent (abstract)

Abstract base directive for extending custom stacked-layout implementations. Exposes `options` as an `InputSignal<IStackedLayoutOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                              | Default | Description                                                  |
| --------- | ------------------------------------------------- | ------- | ------------------------------------------------------------ |
| `options` | `InputSignal<IStackedLayoutOptions \| undefined>` | -       | Optional configuration (title, navTpl, headerTpl, container) |
| `class`   | `InputSignal<string>`                             | `''`    | External CSS classes (alias for `cssClass`)                  |

### IStackedLayoutOptions

```typescript
type SmartStackedLayoutContainerWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface IStackedLayoutOptions {
  title?: string;
  navTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  containerWidth?: SmartStackedLayoutContainerWidth;
}
```

The default `StackedLayoutStandardComponent` consumes `navTpl` (rendered inside the top `<nav>`) and `headerTpl` (rendered as a secondary `<header>` block beneath the navigation). `title` and `containerWidth` are reserved for custom implementations registered via `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN` and are ignored by `StackedLayoutStandardComponent`.

## STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN

```typescript
import { STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `StackedLayoutStandardComponent` with a custom implementation. Provide a `Type<StackedLayoutBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-stacked-layout'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- accept main content via `<ng-content>` so consumers can project arbitrary page content,
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
- Base class: `packages/shared/angular/src/lib/components/stacked-layout/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`STACKED_LAYOUT_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IStackedLayoutOptions`)
