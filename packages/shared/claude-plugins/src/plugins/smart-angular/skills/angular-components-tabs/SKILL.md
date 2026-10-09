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

Main wrapper. Delegates to `TabsStandardComponent` by default. When `TABS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it `options`, `selectedId` and `class`. Re-emits `tabChange` and forwards two-way `selectedId` of whichever implementation renders (the standard, the preset or a custom one).

### TabsStandardComponent (`<smart-tabs-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, an optional mobile `<select>` in `.tabs-mobile` (rendered when `options.showMobileSelect` is `true` or unset and `items` is non-empty; `aria-label` from `options.ariaLabel`, default `"Select a tab"`; one option per item with its `label`, or its `id` without one; a change emits `tabChange` and updates `selectedId`), and a `<nav class="tabs-desktop">` (`aria-label` from `options.ariaLabel`, default `"Tabs"`) containing a `<ul class="tabs-list">` of items. Each item renders as a plain `<a class="tab-link" href>` when `href` is provided (a click follows the link without changing the selection), otherwise `<button class="tab-button">` emitting `tabChange` and updating `selectedId`. Adds the `current` class and `aria-current="page"` when `item.id === selectedId()` (no item is current while `selectedId` is `null`). Supports optional `iconTpl` and `badge` per item. The standard does not read `options.layout` and adds no styles: the class hooks are for your CSS.

### TabsPresetComponent (`<smart-tabs-preset>`)

Styled variation that extends `TabsBaseComponent` and is a drop-in replacement for `TabsStandardComponent`. Register it via `TABS_STANDARD_COMPONENT_TOKEN` (or every preset at once with `provideSmartPresets()`) to restyle every `<smart-tabs>`, or use the `<smart-tabs-preset>` selector directly. It renders the translated Preline tab nav for every `SmartTabsLayout` (`underline`, `underline-with-icons`, `underline-with-badges`, `underline-full-width`, `pills`, `pills-on-gray`, `pills-with-brand-color`, `bar-with-underline`, `simple`), selected through `options.layout` (default `'underline'`). Honors `options.items` (rendering `<a role="tab">` when `href` is set, otherwise `<button role="tab">`), `options.ariaLabel`, per-item `iconTpl` and `badge`, and `options.showMobileSelect` (default `true` → renders a `<select>` shown only below `sm` and hides the nav below `sm`). The active tab is driven by the `selectedId` model (falling back to the first item); a click on a tab — a link included — or a change of the mobile select sets `selectedId` and emits `tabChange`. Preline's Tabs JS plugin is **not** used. ARIA (`role=tablist/tab`, `aria-selected`, `aria-controls`, `aria-orientation`) is kept on the markup. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the per-layout class recipes are internal to the preset and not exported.

> `TabsPresetComponent` declares `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-tabs-preset>` selector directly, or just pass `class` on `<smart-tabs>` (the wrapper forwards it). With the preset registered through the token, `(tabChange)` and `[(selectedId)]` on `<smart-tabs>` work as with the standard.

### TabsBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<ITabsOptions | undefined>`
- `selectedId: ModelSignal<string | null>` (default `null`)
- `cssClass: InputSignal<string>` (alias `class`)
- `tabChange: OutputEmitterRef<ITabChange>`

## API

### Inputs

| Input        | Type                                     | Default | Description                                 |
| ------------ | ---------------------------------------- | ------- | ------------------------------------------- |
| `options`    | `InputSignal<ITabsOptions \| undefined>` | -       | Tabs configuration                          |
| `selectedId` | `ModelSignal<string \| null>`            | `null`  | Two-way bindable currently selected tab id  |
| `class`      | `InputSignal<string>`                    | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                           | Description                                                                                                    |
| ----------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `tabChange` | `OutputEmitterRef<ITabChange>` | Emitted when a tab is chosen: a button click or a mobile select change (and, in the preset, a link click too). |

### ITabsOptions

| Field              | Type              | Default       | Description                                                                                                     |
| ------------------ | ----------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `items`            | `ITabItem[]`      | `[]`          | The tabs.                                                                                                       |
| `ariaLabel`        | `string`          | `'Tabs'`      | Accessible name of the strip; the standard mobile select uses it too, with `'Select a tab'` as its own default. |
| `showMobileSelect` | `boolean`         | `true`        | Renders a `<select>` of the tabs; the preset shows it below `sm` and the strip from `sm` up.                    |
| `layout`           | `SmartTabsLayout` | `'underline'` | Preset only: the look (see the preset section). The standard ignores it.                                        |

`SmartTabsLayout` is `'underline' | 'underline-with-icons' | 'underline-with-badges' | 'underline-full-width' | 'pills' | 'pills-on-gray' | 'pills-with-brand-color' | 'bar-with-underline' | 'simple'`.

### ITabItem

| Field     | Type                   | Default  | Description                                                                                            |
| --------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `id`      | `string`               | required | Identifies the tab (`selectedId`, `tabId`, and the preset's `aria-controls`; give your panel that id). |
| `label`   | `string`               | -        | Tab text (the mobile select falls back to the `id`).                                                   |
| `href`    | `string`               | -        | Renders the tab as a plain `<a href>`; the standard follows the link without changing the selection.   |
| `badge`   | `string \| number`     | -        | A count or text badge.                                                                                 |
| `iconTpl` | `TemplateRef<unknown>` | -        | Icon before the label.                                                                                 |

### ITabChange

| Field   | Type     | Default  | Description                 |
| ------- | -------- | -------- | --------------------------- |
| `tabId` | `string` | required | The `id` of the chosen tab. |

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
  layout?: SmartTabsLayout; // preset only
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

Provide a component class extending `TabsBaseComponent` under `TABS_STANDARD_COMPONENT_TOKEN`; every `<smart-tabs>` below that injector renders it.

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
  // `options()`, `selectedId` (a model the wrapper binds two-way), `cssClass()`
  // and `tabChange` (re-emitted by the wrapper) are inherited.
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

### Using the preset variation

```typescript
// Register globally (or in a feature's providers) to restyle every <smart-tabs>:
import {
  TABS_STANDARD_COMPONENT_TOKEN,
  TabsPresetComponent,
} from '@smartsoft001/angular';

providers: [
  { provide: TABS_STANDARD_COMPONENT_TOKEN, useValue: TabsPresetComponent },
];
```

```html
<!-- Then drive the look via options.layout -->
<smart-tabs
  [(selectedId)]="active"
  [options]="{
    layout: 'pills-with-brand-color',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'settings', label: 'Settings' },
    ],
  }"
/>

<!-- Or use the variation selector directly (note [cssClass], not class) -->
<smart-tabs-preset
  [(selectedId)]="active"
  [options]="{ layout: 'underline', items: items }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/tabs/tabs.component.ts`
- Standard: `packages/shared/angular/src/lib/components/tabs/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/tabs/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/tabs/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/tabs/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/tabs/tabs.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`TABS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ITabsOptions`, `ITabItem`, `SmartTabsLayout`)
