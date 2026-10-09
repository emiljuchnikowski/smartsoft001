---
name: angular-components-section-heading
description: Section heading component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Section Heading Component

The `<smart-section-heading>` component provides a heading region for sections within a page (positioned between `<smart-page-heading>` and `<smart-card-heading>` in size and scope), with a title and optional slots for a label, a description, actions, tabs, an input group (search), a badge and, in the preset, an image. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SectionHeadingBaseComponent` defines the shared API — optional `ISectionHeadingOptions` and `cssClass` (alias `class`). `SectionHeadingStandardComponent` is a barebones placeholder concrete implementation. `SectionHeadingComponent` is the public wrapper that renders `SectionHeadingStandardComponent` by default and accepts a custom replacement via `SECTION_HEADING_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the section heading component
- Developer asks about `<smart-section-heading>`, `SectionHeadingComponent`, `SectionHeadingStandardComponent`, or `SectionHeadingBaseComponent`

## Components

### SectionHeadingComponent (`<smart-section-heading>`)

Main wrapper component. Renders `SectionHeadingStandardComponent` by default. When `SECTION_HEADING_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet` and hands it the `options` and `class` inputs.

### SectionHeadingStandardComponent (`<smart-section-heading-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` (with the external `cssClass`) holding a header row: an `<h3>` with the `title` and, inside it, an optional `<span class="label">` with the `label`; a `<p class="description">`; then the `badgeTpl`, `inputGroupTpl` and `actionsTpl` slots (`.badge`, `.input-group`, `.actions`). A separate `.tabs` row with `tabsTpl` sits beneath the header. Each part is rendered only when its option is set; the `label` is rendered only together with a `title`. The standard does not read `imageTpl` or `presentation`. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### SectionHeadingBaseComponent (abstract)

Abstract base directive for extending custom section-heading implementations. Exposes `options` as an `InputSignal<ISectionHeadingOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                               | Default | Description                                                 |
| --------- | -------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `options` | `InputSignal<ISectionHeadingOptions \| undefined>` | -       | Optional configuration (title, description, slot templates) |
| `class`   | `InputSignal<string>`                              | `''`    | External CSS classes (alias for `cssClass`)                 |

### ISectionHeadingOptions

All properties are optional.

| Field           | Type                                                      | Default | Description                                                                                                |
| --------------- | --------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `title`         | `string`                                                  | -       | The heading (`<h3>` in the standard, `<h2>` in the preset).                                                |
| `description`   | `string`                                                  | -       | Text under the heading.                                                                                    |
| `label`         | `string`                                                  | -       | Standard: inline `<span class="label">` inside the title (needs `title`). Preset: eyebrow above the title. |
| `actionsTpl`    | `TemplateRef<unknown>`                                    | -       | Action buttons.                                                                                            |
| `badgeTpl`      | `TemplateRef<unknown>`                                    | -       | A badge: in the header row (standard) or next to the eyebrow label (preset).                               |
| `tabsTpl`       | `TemplateRef<unknown>`                                    | -       | Standard only: tabs under the header. The preset does not render it.                                       |
| `inputGroupTpl` | `TemplateRef<unknown>`                                    | -       | Standard only: a search or input group in the header row. The preset does not render it.                   |
| `imageTpl`      | `TemplateRef<unknown>`                                    | -       | Preset only: the image column (the template owns the `<img>`).                                             |
| `presentation`  | `{ layout?: 'half' \| 'narrow' \| 'wide' \| 'vertical' }` | -       | Preset only: the layout, `half` by default (see the preset section).                                       |

```typescript
interface ISectionHeadingOptions {
  title?: string;
  description?: string;
  label?: string;
  actionsTpl?: TemplateRef<unknown>;
  tabsTpl?: TemplateRef<unknown>; // standard only
  inputGroupTpl?: TemplateRef<unknown>; // standard only
  badgeTpl?: TemplateRef<unknown>;
  imageTpl?: TemplateRef<unknown>; // preset only
  presentation?: { layout?: 'half' | 'narrow' | 'wide' | 'vertical' }; // preset only
}
```

## SECTION_HEADING_STANDARD_COMPONENT_TOKEN

InjectionToken that allows replacing the default `SectionHeadingStandardComponent` with a custom implementation. Provide a component class extending `SectionHeadingBaseComponent` under `SECTION_HEADING_STANDARD_COMPONENT_TOKEN`; every `<smart-section-heading>` below that injector renders it.

```typescript
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomSectionHeadingComponent,
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

import { SectionHeadingBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-section-heading',
  template: `
    <div [class]="containerClasses()">
      <div class="header">
        @if (options()?.title) {
          <h3>{{ options()!.title }}</h3>
        }
        @if (options()?.actionsTpl) {
          <div class="actions">
            <ng-container [ngTemplateOutlet]="options()!.actionsTpl!" />
          </div>
        }
      </div>
      @if (options()?.tabsTpl) {
        <div class="tabs">
          <ng-container [ngTemplateOutlet]="options()!.tabsTpl!" />
        </div>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomSectionHeadingComponent extends SectionHeadingBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-section-heading'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Title only -->
<smart-section-heading [options]="{ title: 'Applicants' }" />

<!-- Title with label -->
<smart-section-heading
  [options]="{ title: 'Applicants', label: 'in Engineering' }"
/>

<!-- Title and description -->
<smart-section-heading
  [options]="{
    title: 'Applicants',
    description: 'Users currently active',
  }"
/>

<!-- With actions -->
<ng-template #actions>
  <smart-button [options]="addButton">Add</smart-button>
</ng-template>

<smart-section-heading
  [options]="{ title: 'Applicants', actionsTpl: actions }"
/>

<!-- With tabs and search (standard only) -->
<ng-template #tabs>
  <a>All</a>
  <a>Active</a>
</ng-template>

<ng-template #search>
  <smart-searchbar [(text)]="query" />
</ng-template>

<smart-section-heading
  [options]="{
    title: 'Applicants',
    tabsTpl: tabs,
    inputGroupTpl: search,
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/section-heading/section-heading.component.ts`
- Standard: `packages/shared/angular/src/lib/components/section-heading/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/section-heading/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/section-heading/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SECTION_HEADING_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISectionHeadingOptions`)

## HyperUI preset

`SectionHeadingPresetComponent` (`smart-section-heading-preset`) is a HyperUI-styled "content with image" variation. It renders an eyebrow row (`label` + `badgeTpl`), an `<h2>` title, a description `<p>`, `actionsTpl` below the text, and an optional image column fed by `imageTpl`. Vanilla Tailwind classes are prefixed with `smart:` and ship explicit `smart:dark:*` variants (gray-900 ↔ white for the title, gray-700 ↔ gray-300 for text). Every zone exposes a `data-role` hook: `section`, `grid`, `text`, `image`, `eyebrow`, `actions`.

The preset adds two options the standard ignores.

- `imageTpl` — the image column. The zone is only rendered when this is provided; the template owns the `<img>` and its classes.
- `presentation.layout` — `'half' | 'narrow' | 'wide' | 'vertical'` (default `half`), described in the table below.

| Layout     | Grid                                    | Notes                               |
| ---------- | --------------------------------------- | ----------------------------------- |
| `half`     | `md:grid-cols-2`, text \| image         | Default. Balanced two-column split. |
| `narrow`   | `md:grid-cols-4`, text (1) \| image (3) | Narrow copy, wide image.            |
| `wide`     | `md:grid-cols-4`, image (3) \| text (1) | Image rendered **first**.           |
| `vertical` | `space-y-*` stack (no grid)             | Copy on top, image underneath.      |

### Register the preset

Provide `SectionHeadingPresetComponent` under `SECTION_HEADING_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-section-heading>`, or register every preset of the library at once with `provideSmartPresets()`. Alternatively use `<smart-section-heading-preset>` directly; it declares `cssClass` without the `class` alias, so bind `[cssClass]` there (on `<smart-section-heading>` pass `class` as usual).

```ts
import {
  SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
  SectionHeadingPresetComponent,
} from '@smartsoft001/angular';

providers: [
  {
    provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: SectionHeadingPresetComponent,
  },
];
```

### Gaps

`tabsTpl` and `inputGroupTpl` are **not** rendered by this preset (only the standard component renders them). Use the standard component when those slots are needed.
