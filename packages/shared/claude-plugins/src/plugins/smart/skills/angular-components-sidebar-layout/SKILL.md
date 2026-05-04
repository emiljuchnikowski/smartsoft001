---
name: angular-components-sidebar-layout
description: Sidebar layout component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Sidebar Layout Component

The `<smart-sidebar-layout>` component provides a two-column application shell with a sidebar (left or right) and a main content region, with an optional top header. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SidebarLayoutBaseComponent` defines the shared API — optional `ISidebarLayoutOptions` and `cssClass` (alias `class`). `SidebarLayoutStandardComponent` is a barebones placeholder concrete implementation. `SidebarLayoutComponent` is the public wrapper that renders `SidebarLayoutStandardComponent` by default and accepts a custom replacement via `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the sidebar layout component
- Developer asks about `<smart-sidebar-layout>`, `SidebarLayoutComponent`, `SidebarLayoutStandardComponent`, or `SidebarLayoutBaseComponent`

## Components

### SidebarLayoutComponent (`<smart-sidebar-layout>`)

Main wrapper component. Renders `SidebarLayoutStandardComponent` by default. When `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Accepts main content via projected `<ng-content>`.

### SidebarLayoutStandardComponent (`<smart-sidebar-layout-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` containing an optional `<header>` (when `options.headerTpl` is provided), an `<aside>` for the sidebar, and a `<main>` element that projects `<ng-content>`. The order of `<aside>` and `<main>` swaps based on `options.sidebarPosition` (`'left'` default or `'right'`). The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### SidebarLayoutBaseComponent (abstract)

Abstract base directive for extending custom sidebar-layout implementations. Exposes `options` as an `InputSignal<ISidebarLayoutOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                              | Default | Description                                                 |
| --------- | ------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `options` | `InputSignal<ISidebarLayoutOptions \| undefined>` | -       | Optional configuration (sidebar template, position, header) |
| `class`   | `InputSignal<string>`                             | `''`    | External CSS classes (alias for `cssClass`)                 |

### ISidebarLayoutOptions

```typescript
type SmartSidebarLayoutMobileBreakpoint = 'sm' | 'md' | 'lg';

interface ISidebarLayoutOptions {
  title?: string;
  sidebarTpl?: TemplateRef<unknown>;
  headerTpl?: TemplateRef<unknown>;
  sidebarPosition?: 'left' | 'right';
  mobileBreakpoint?: SmartSidebarLayoutMobileBreakpoint;
  condensed?: boolean;
}
```

The default `SidebarLayoutStandardComponent` consumes `sidebarTpl`, `headerTpl`, and `sidebarPosition`. `title`, `mobileBreakpoint`, and `condensed` are reserved for custom implementations registered via `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN` and are ignored by `SidebarLayoutStandardComponent`.

## SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN

```typescript
import { SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `SidebarLayoutStandardComponent` with a custom implementation. Provide a `Type<SidebarLayoutBaseComponent>` to override.

```typescript
// In your app module or component providers:
providers: [
  {
    provide: SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSidebarLayoutComponent,
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

import { SidebarLayoutBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-sidebar-layout',
  template: `
    <div [class]="containerClasses()">
      @if (options()?.headerTpl) {
        <header>
          <ng-container [ngTemplateOutlet]="options()!.headerTpl!" />
        </header>
      }
      <aside>
        @if (options()?.sidebarTpl) {
          <ng-container [ngTemplateOutlet]="options()!.sidebarTpl!" />
        }
      </aside>
      <main>
        <ng-content />
      </main>
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSidebarLayoutComponent extends SidebarLayoutBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-sidebar-layout'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`,
- accept main content via `<ng-content>`,
- read `options().sidebarPosition` to swap aside/main DOM order if needed.

## Usage Examples

```html
<!-- Basic with main content -->
<smart-sidebar-layout>
  <h1>Hello</h1>
</smart-sidebar-layout>

<!-- With sidebar template -->
<ng-template #sidebar>
  <a routerLink="/">Dashboard</a>
  <a routerLink="/team">Team</a>
</ng-template>

<smart-sidebar-layout [options]="{ sidebarTpl: sidebar }">
  <p>Main content</p>
</smart-sidebar-layout>

<!-- Right-positioned sidebar -->
<smart-sidebar-layout
  [options]="{ sidebarTpl: sidebar, sidebarPosition: 'right' }"
>
  <p>Main content</p>
</smart-sidebar-layout>

<!-- With top header -->
<ng-template #header>
  <h1>Dashboard</h1>
</ng-template>

<smart-sidebar-layout [options]="{ sidebarTpl: sidebar, headerTpl: header }">
  <p>Main content</p>
</smart-sidebar-layout>

<!-- With external class -->
<smart-sidebar-layout class="smart:bg-gray-50">
  <p>Main content</p>
</smart-sidebar-layout>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/sidebar-layout/sidebar-layout.component.ts`
- Standard: `packages/shared/angular/src/lib/components/sidebar-layout/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/sidebar-layout/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SIDEBAR_LAYOUT_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISidebarLayoutOptions`)
