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

Main wrapper. Delegates to `BreadcrumbsStandardComponent` by default. When `BREADCRUMBS_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `itemClick`.

### BreadcrumbsStandardComponent (`<smart-breadcrumbs-standard>`)

Barebones placeholder using native HTML. Renders a `<nav class="breadcrumbs">` (with `aria-label` from `options.ariaLabel` or default `"Breadcrumb"`) containing an `<ol>` of items. Each item renders as `<a class="breadcrumbs-link">` (when `href` provided) or `<button class="breadcrumbs-button">` (otherwise, emitting `itemClick`). Items get `current` class and `aria-current="page"` when `item.current === true`. Supports `iconTpl` (e.g. for the home item) and `srOnlyLabel`. Items are joined by a `<span class="breadcrumbs-separator">` with a `data-separator` attribute reflecting `options.separator` (defaults to `chevron`).

### BreadcrumbsPresetComponent (`<smart-breadcrumbs-preset>`)

Styled variation that extends `BreadcrumbsBaseComponent` and is a drop-in replacement for `BreadcrumbsStandardComponent`. Register it via `BREADCRUMBS_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-breadcrumbs>`, or use the `<smart-breadcrumbs-preset>` selector directly. Translates the Preline breadcrumb: muted links (`text-gray-500`) that brighten to blue on hover/focus, a bold non-link current crumb (`font-semibold text-gray-900`), and a configurable separator SVG between crumbs selected via `options.separator` — `chevron` (default), `slash` (drawn slightly larger), or `arrow`. The `options.layout` field wraps the bar: `contained` (inline padded gray panel with rounded corners) and `full-width-bar` (full-width gray bar with top/bottom borders); the `simple-with-slashes` layout also implies a slash separator when `separator` is unset. Items render as `<a>` (when `href` is set and not current), `<button>` (no href → emits `itemClick`), or a plain `<span>` (when `current`). All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants. Class recipes live in `preset/preset-classes.util.ts` (`getNavClasses`, `getListClasses`, `getItemClasses`, `getLinkClasses`, `getSeparatorClasses`, `resolveSeparator`).

> Because `BreadcrumbsComponent` renders injected components via `NgComponentOutlet` (which passes inputs by canonical name), `BreadcrumbsPresetComponent` overrides `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-breadcrumbs-preset>` selector directly, or just pass `class` on `<smart-breadcrumbs>` (the wrapper forwards it).

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
  input,
  ViewEncapsulation,
} from '@angular/core';

import { BreadcrumbsBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-breadcrumbs',
  template: `…`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomBreadcrumbsComponent extends BreadcrumbsBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
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
    layout: 'simple-with-slashes',
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
