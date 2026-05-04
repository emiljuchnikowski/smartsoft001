---
name: angular-components-tabs
description: Tabs component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Tabs Component

The `<smart-tabs>` component renders a tabbed navigation strip (anchor-based for routing or button-based for in-page selection) with a `<select>` fallback for mobile. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `TabsBaseComponent` defines the shared API — `options` (`ITabsOptions`), `selectedId` (two-way `ModelSignal<string | null>`), `cssClass` (alias `class`), and the `tabChange` output. `TabsStandardComponent` is a barebones placeholder using native `<nav>`, `<ul>`, `<a>`, `<button>` and `<select>` elements. `TabsComponent` is the public wrapper that renders `TabsStandardComponent` by default and accepts a custom replacement via `TABS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the tabs component
- Developer asks about `<smart-tabs>`, `TabsComponent`, `TabsStandardComponent`, or `TabsBaseComponent`

## Components

### TabsComponent (`<smart-tabs>`)

Main wrapper. Delegates to `TabsStandardComponent` by default. When `TABS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `tabChange` and forwards two-way `selectedId`.

### TabsStandardComponent (`<smart-tabs-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, an optional mobile `<select>` (rendered when `options.showMobileSelect` is `true` or unset and `items` is non-empty), and a `<nav class="tabs-desktop">` containing a `<ul class="tabs-list">` of items. Each item renders as `<a class="tab-link">` when `href` is provided, otherwise `<button class="tab-button">` emitting `tabChange` and updating `selectedId`. Adds `current` class and `aria-current="page"` when `item.id === selectedId()`. Supports optional `iconTpl` and `badge` per item.

### TabsBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<ITabsOptions | undefined>`
- `selectedId: ModelSignal<string | null>` (default `null`)
- `cssClass: InputSignal<string>` (alias `class`)
- `tabChange: OutputEmitterRef<ITabChange>`

`ITabChange = { tabId: string }`.

## API

### Inputs

| Input        | Type                                     | Default | Description                                 |
| ------------ | ---------------------------------------- | ------- | ------------------------------------------- |
| `options`    | `InputSignal<ITabsOptions \| undefined>` | -       | Tabs configuration                          |
| `selectedId` | `ModelSignal<string \| null>`            | `null`  | Two-way bindable currently selected tab id  |
| `class`      | `InputSignal<string>`                    | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                           | Description                               |
| ----------- | ------------------------------ | ----------------------------------------- |
| `tabChange` | `OutputEmitterRef<ITabChange>` | Emitted when a button-type tab is clicked |

### ITabsOptions

```typescript
type SmartTabsLayout =
  | 'underline'
  | 'underline-with-icons'
  | 'underline-with-badges'
  | 'underline-full-width'
  | 'pills'
  | 'pills-on-gray'
  | 'pills-with-brand-color'
  | 'bar-with-underline'
  | 'simple';

interface ITabsOptions {
  layout?: SmartTabsLayout;
  items?: ITabItem[];
  ariaLabel?: string;
  showMobileSelect?: boolean; // default true
}

interface ITabItem {
  id: string;
  label?: string;
  href?: string;
  badge?: string | number;
  iconTpl?: TemplateRef<unknown>;
}
```

## TABS_STANDARD_COMPONENT_TOKEN

```typescript
import { TABS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: TABS_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomTabsComponent,
  },
];
```

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { TabsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-tabs',
  template: `
    <nav>
      @for (item of options()?.items ?? []; track item.id) {
        <button
          type="button"
          [class.current]="selectedId() === item.id"
          (click)="selectedId.set(item.id); tabChange.emit({ tabId: item.id })"
        >
          {{ item.label }}
        </button>
      }
    </nav>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomTabsComponent extends TabsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

## Usage Examples

```html
<!-- Anchor-based tabs (route navigation) -->
<smart-tabs
  [selectedId]="'team'"
  [options]="{
    items: [
      { id: 'account', label: 'My Account', href: '/account' },
      { id: 'company', label: 'Company', href: '/company' },
      { id: 'team', label: 'Team Members', href: '/team' },
      { id: 'billing', label: 'Billing', href: '/billing' },
    ],
  }"
/>

<!-- Button-based tabs with two-way binding -->
<smart-tabs
  [(selectedId)]="active"
  [options]="{
    layout: 'pills',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'settings', label: 'Settings' },
    ],
  }"
  (tabChange)="onTab($event)"
/>

<!-- With badges -->
<smart-tabs
  [options]="{
    layout: 'underline-with-badges',
    items: [
      { id: 'applied', label: 'Applied', badge: 52 },
      { id: 'interview', label: 'Interview', badge: 4 },
      { id: 'offer', label: 'Offer' },
    ],
  }"
  [(selectedId)]="active"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/tabs/tabs.component.ts`
- Standard: `packages/shared/angular/src/lib/components/tabs/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/tabs/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TABS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITabsOptions`, `ITabItem`, `SmartTabsLayout`)
