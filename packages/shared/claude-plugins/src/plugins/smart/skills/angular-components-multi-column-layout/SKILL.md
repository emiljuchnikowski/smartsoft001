---
name: angular-components-multi-column-layout
description: Multi-column layout component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Multi-Column Layout Component

The `<smart-multi-column-layout>` component provides a three-column application shell — a left navigation `<aside>`, a main content region, and a right secondary `<aside>`, with an optional top header. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `MultiColumnLayoutBaseComponent` defines the shared API — optional `IMultiColumnLayoutOptions` and `cssClass` (alias `class`). `MultiColumnLayoutStandardComponent` is a barebones placeholder concrete implementation. `MultiColumnLayoutComponent` is the public wrapper that renders `MultiColumnLayoutStandardComponent` by default and accepts a custom replacement via `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the multi-column layout component
- Developer asks about `<smart-multi-column-layout>`, `MultiColumnLayoutComponent`, `MultiColumnLayoutStandardComponent`, or `MultiColumnLayoutBaseComponent`

## Components

### MultiColumnLayoutComponent (`<smart-multi-column-layout>`)

Main wrapper component. Renders `MultiColumnLayoutStandardComponent` by default. When `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Accepts main content via projected `<ng-content>`.

### MultiColumnLayoutStandardComponent (`<smart-multi-column-layout-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<header>` (when `options.headerTpl` is provided), an `<aside class="nav">`, a `<main>` element that projects `<ng-content>`, and an `<aside class="secondary">`. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### MultiColumnLayoutBaseComponent (abstract)

Abstract base directive for extending custom multi-column-layout implementations. Exposes `options` as an `InputSignal<IMultiColumnLayoutOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                                  | Default | Description                                            |
| --------- | ----------------------------------------------------- | ------- | ------------------------------------------------------ |
| `options` | `InputSignal<IMultiColumnLayoutOptions \| undefined>` | -       | Optional configuration (nav, secondary, header, width) |
| `class`   | `InputSignal<string>`                                 | `''`    | External CSS classes (alias for `cssClass`)            |

### IMultiColumnLayoutOptions

```typescript
type SmartMultiColumnLayoutWidth = 'full' | 'constrained';
type SmartMultiColumnLayoutSecondaryWidth = 'sm' | 'md' | 'lg';

interface IMultiColumnLayoutOptions {
  title?: string;
  navTpl?: TemplateRef<unknown>;
  secondaryTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  width?: SmartMultiColumnLayoutWidth;
  secondaryWidth?: SmartMultiColumnLayoutSecondaryWidth;
}
```

The default `MultiColumnLayoutStandardComponent` consumes `navTpl`, `secondaryTpl`, and `headerTpl`. `title`, `width`, and `secondaryWidth` are reserved for custom implementations registered via `MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`.

## MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN

```typescript
import { MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `MultiColumnLayoutStandardComponent` with a custom implementation. Provide a `Type<MultiColumnLayoutBaseComponent>` to override.

```typescript
providers: [
  {
    provide: MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomMultiColumnLayoutComponent,
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

import { MultiColumnLayoutBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-multi-column-layout',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.headerTpl) {
        <header>
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      }
      <aside class="nav">
        @if (options()?.navTpl) {
          <ng-container [ngTemplateOutlet]="options()!.navTpl!" />
        }
      </aside>
      <main>
        <ng-content />
      </main>
      <aside class="secondary">
        @if (options()?.secondaryTpl) {
          <ng-container [ngTemplateOutlet]="options()!.secondaryTpl!" />
        }
      </aside>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomMultiColumnLayoutComponent extends MultiColumnLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-multi-column-layout'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Basic with main content -->
<smart-multi-column-layout>
  <h1>Hello</h1>
</smart-multi-column-layout>

<!-- With nav and secondary -->
<ng-template #nav>
  <a routerLink="/">Inbox</a>
  <a routerLink="/sent">Sent</a>
</ng-template>

<ng-template #secondary>
  <p>Filters</p>
</ng-template>

<smart-multi-column-layout [options]="{ navTpl: nav, secondaryTpl: secondary }">
  <p>Email content</p>
</smart-multi-column-layout>

<!-- With top header -->
<ng-template #header>
  <h1>Inbox</h1>
</ng-template>

<smart-multi-column-layout
  [options]="{ navTpl: nav, secondaryTpl: secondary, headerTpl: header }"
>
  <p>Email content</p>
</smart-multi-column-layout>

<!-- With external class -->
<smart-multi-column-layout class="smart:bg-gray-50">
  <p>Content</p>
</smart-multi-column-layout>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/multi-column-layout/multi-column-layout.component.ts`
- Standard: `packages/shared/angular/src/lib/components/multi-column-layout/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/multi-column-layout/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`MULTI_COLUMN_LAYOUT_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`IMultiColumnLayoutOptions`)
