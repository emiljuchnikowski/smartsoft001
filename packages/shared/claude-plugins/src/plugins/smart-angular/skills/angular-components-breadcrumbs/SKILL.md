---
name: angular-components-breadcrumbs
description: Breadcrumbs component API with InjectionToken pattern, configurable separators (chevron/slash/arrow) and four layout variants.
user-invocable: false
---

# Breadcrumbs Component

The `<smart-breadcrumbs>` component renders a list of navigation items separated by visual delimiters (chevron, slash, or arrow shape). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `BreadcrumbsBaseComponent` defines the shared API — `options` (`IBreadcrumbsOptions`), `cssClass` (alias `class`), and the `itemClick` output. `BreadcrumbsStandardComponent` is a barebones placeholder using native `<nav>`, `<ol>`, `<li>`, `<a>`, and `<button>` elements. `BreadcrumbsComponent` is the public wrapper that renders `BreadcrumbsStandardComponent` by default and accepts a custom replacement via `BREADCRUMBS_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the breadcrumbs component
- Developer asks about `<smart-breadcrumbs>`, `BreadcrumbsComponent`, `BreadcrumbsStandardComponent`, or `BreadcrumbsBaseComponent`

## Components

### BreadcrumbsComponent (`<smart-breadcrumbs>`)

Main wrapper. Delegates to `BreadcrumbsStandardComponent` by default. When `BREADCRUMBS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and passes it `options` and `class`. Re-emits `itemClick` from whichever component it renders.

### BreadcrumbsStandardComponent (`<smart-breadcrumbs-standard>`)

Barebones placeholder using native HTML. Renders a `<nav class="breadcrumbs">` (with `aria-label` from `options.ariaLabel` or default `"Breadcrumb"`) containing an `<ol>` of items. Each item renders as `<a class="breadcrumbs-link">` (when `href` provided) or `<button class="breadcrumbs-button">` (otherwise, emitting `itemClick`). Items get `current` class and `aria-current="page"` when `item.current === true`. Supports `iconTpl` (e.g. for the home item) and `srOnlyLabel`. Items are joined by a `<span class="breadcrumbs-separator">` with a `data-separator` attribute reflecting `options.separator` (defaults to `chevron`). It ignores `options.layout`.

### BreadcrumbsPresetComponent (`<smart-breadcrumbs-preset>`)

Styled variation that extends `BreadcrumbsBaseComponent` and is a drop-in replacement for `BreadcrumbsStandardComponent`. Register it via `BREADCRUMBS_STANDARD_COMPONENT_TOKEN` (`{ provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN, useValue: BreadcrumbsPresetComponent }`) to restyle every `<smart-breadcrumbs>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-breadcrumbs-preset>` selector directly. Translates the Preline breadcrumb: muted links (`text-gray-600`) that brighten to blue on hover/focus, a bold non-link current crumb (`font-semibold text-gray-900`), and a configurable separator SVG between crumbs selected via `options.separator` — `chevron` (default), `slash` (drawn slightly larger), or `arrow`. The `options.layout` field wraps the bar: `contained` (inline padded gray panel with rounded corners) and `full-width-bar` (full-width gray bar with top/bottom borders); the `simple-with-slashes` layout also implies a slash separator when `separator` is unset; `simple-with-chevrons` changes nothing (no wrapper, and the chevron is already the default separator). Items render as `<a>` (when `href` is set and not current), `<button>` (no href → emits `itemClick`), or a plain `<span>` (when `current`). All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal to the preset (not exported).

Used directly, `<smart-breadcrumbs-preset>` takes the extra classes as `class` or `[cssClass]`; on `<smart-breadcrumbs>` pass `class` and the wrapper forwards it.

### BreadcrumbsBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IBreadcrumbsOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `itemClick: OutputEmitterRef<IBreadcrumbsItemClick>`

`IBreadcrumbsItemClick = { itemId: string }`.

## API

### Inputs

| Input     | Type                                            | Default | Description                                 |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IBreadcrumbsOptions \| undefined>` | -       | Breadcrumbs configuration                   |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output      | Type                                      | Description                                      |
| ----------- | ----------------------------------------- | ------------------------------------------------ |
| `itemClick` | `OutputEmitterRef<IBreadcrumbsItemClick>` | Emitted when a button-type breadcrumb is clicked |

### IBreadcrumbsOptions

| Field       | Type                        | Default        | Description                                                                                                                                                                                    |
| ----------- | --------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout`    | `SmartBreadcrumbsLayout`    | `undefined`    | Preset only: `contained` or `full-width-bar` wrap the trail in a gray bar; `simple-with-slashes` implies the slash separator; `simple-with-chevrons` changes nothing. The standard ignores it. |
| `ariaLabel` | `string`                    | `'Breadcrumb'` | Accessible name of the `nav`.                                                                                                                                                                  |
| `separator` | `SmartBreadcrumbsSeparator` | `'chevron'`    | Glyph between items: `'chevron'`, `'slash'` or `'arrow'`, drawn by the preset; the standard exposes it as `data-separator`.                                                                    |
| `items`     | `IBreadcrumbItem[]`         | required       | The trail, first to last.                                                                                                                                                                      |

### IBreadcrumbItem

| Field         | Type                   | Default     | Description                                                                                      |
| ------------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `id`          | `string`               | required    | Reported as `itemId` by `itemClick`.                                                             |
| `label`       | `string`               | `undefined` | Visible text.                                                                                    |
| `href`        | `string`               | `undefined` | Renders the item as a link; without it the item is a button that emits `itemClick`.              |
| `iconTpl`     | `TemplateRef<unknown>` | `undefined` | Icon before the label (e.g. a home icon).                                                        |
| `srOnlyLabel` | `string`               | `undefined` | Text for screen readers only, for an icon-only item.                                             |
| `current`     | `boolean`              | `undefined` | Marks the current page (`aria-current="page"`); the preset renders it as plain text, not a link. |

`SmartBreadcrumbsLayout` is `'contained' | 'full-width-bar' | 'simple-with-chevrons' | 'simple-with-slashes'`; `SmartBreadcrumbsSeparator` is `'chevron' | 'slash' | 'arrow'`.

```typescript
type SmartBreadcrumbsLayout =
  | 'contained'
  | 'full-width-bar'
  | 'simple-with-chevrons'
  | 'simple-with-slashes';

type SmartBreadcrumbsSeparator = 'chevron' | 'slash' | 'arrow';

interface IBreadcrumbsOptions {
  layout?: SmartBreadcrumbsLayout;
  ariaLabel?: string;
  separator?: SmartBreadcrumbsSeparator;
  items: IBreadcrumbItem[];
}

interface IBreadcrumbItem {
  id: string;
  label?: string;
  href?: string;
  iconTpl?: TemplateRef<unknown>;
  srOnlyLabel?: string;
  current?: boolean;
}
```

## BREADCRUMBS_STANDARD_COMPONENT_TOKEN

InjectionToken that replaces the default `BreadcrumbsStandardComponent` with a custom implementation: provide a `Type<BreadcrumbsBaseComponent>`. The wrapper passes it `options` and `class` and re-emits its `itemClick`.

```typescript
import { BREADCRUMBS_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: BREADCRUMBS_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomBreadcrumbsComponent,
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

import { BreadcrumbsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-breadcrumbs',
  template: `…`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomBreadcrumbsComponent extends BreadcrumbsBaseComponent {}
```

## Usage Examples

```html
<!-- Simple chain with home icon and current page -->
<smart-breadcrumbs
  [options]="{
    items: [
      { id: 'home', href: '/', iconTpl: homeIcon, srOnlyLabel: 'Home' },
      { id: 'projects', label: 'Projects', href: '/projects' },
      { id: 'nero', label: 'Project Nero', href: '/projects/nero', current: true },
    ],
  }"
/>

<!-- With slash separators -->
<smart-breadcrumbs
  [options]="{
    separator: 'slash',
    items: items,
  }"
/>

<!-- Button-style item with click handler -->
<smart-breadcrumbs
  [options]="{ items: [{ id: 'a', label: 'Step A' }] }"
  (itemClick)="onClick($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/breadcrumbs/breadcrumbs.component.ts`
- Standard: `packages/shared/angular/src/lib/components/breadcrumbs/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/breadcrumbs/preset/preset.component.ts`
- Preset class recipes: `packages/shared/angular/src/lib/components/breadcrumbs/preset/preset-classes.util.ts`
- Stories: `packages/shared/angular/src/lib/components/breadcrumbs/breadcrumbs.component.stories.ts`
- Base class: `packages/shared/angular/src/lib/components/breadcrumbs/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`BREADCRUMBS_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IBreadcrumbsOptions`, `IBreadcrumbItem`, `SmartBreadcrumbsLayout`, `SmartBreadcrumbsSeparator`)
