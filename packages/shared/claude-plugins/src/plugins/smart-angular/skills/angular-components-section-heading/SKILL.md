---
name: angular-components-section-heading
description: Section heading component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Section Heading Component

The `<smart-section-heading>` component provides a heading region for sections within a page (positioned between `<smart-page-heading>` and `<smart-card-heading>` in size and scope), with optional slots for label, description, actions, tabs, an input group (search), and a badge. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `SectionHeadingBaseComponent` defines the shared API — optional `ISectionHeadingOptions` and `cssClass` (alias `class`). `SectionHeadingStandardComponent` is a barebones placeholder concrete implementation. `SectionHeadingComponent` is the public wrapper that renders `SectionHeadingStandardComponent` by default and accepts a custom replacement via `SECTION_HEADING_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the section heading component
- Developer asks about `<smart-section-heading>`, `SectionHeadingComponent`, `SectionHeadingStandardComponent`, or `SectionHeadingBaseComponent`

## Components

### SectionHeadingComponent (`<smart-section-heading>`)

Main wrapper component. Renders `SectionHeadingStandardComponent` by default. When `SECTION_HEADING_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### SectionHeadingStandardComponent (`<smart-section-heading-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` with a header row containing `<h3>` (title) with optional inline `<span class="label">`, a description paragraph, and the `badge`/`inputGroup`/`actions` slot on the right. A separate `tabs` row sits beneath the header. Each section is rendered only when its corresponding template/string is provided. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### SectionHeadingBaseComponent (abstract)

Abstract base directive for extending custom section-heading implementations. Exposes `options` as an `InputSignal<ISectionHeadingOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                               | Default | Description                                                 |
| --------- | -------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `options` | `InputSignal<ISectionHeadingOptions \| undefined>` | -       | Optional configuration (title, description, slot templates) |
| `class`   | `InputSignal<string>`                              | `''`    | External CSS classes (alias for `cssClass`)                 |

### ISectionHeadingOptions

```typescript
interface ISectionHeadingOptions {
  title?: string;
  description?: string;
  label?: string;
  actionsTpl?: TemplateRef<unknown>;
  tabsTpl?: TemplateRef<unknown>;
  inputGroupTpl?: TemplateRef<unknown>;
  badgeTpl?: TemplateRef<unknown>;
}
```

All properties are optional. The default `SectionHeadingStandardComponent` consumes every property; a section is rendered only when its template/string is provided.

## SECTION_HEADING_STANDARD_COMPONENT_TOKEN

```typescript
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `SectionHeadingStandardComponent` with a custom implementation. Provide a `Type<SectionHeadingBaseComponent>` to override.

```typescript
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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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
  <button>Add</button>
</ng-template>

<smart-section-heading
  [options]="{ title: 'Applicants', actionsTpl: actions }"
/>

<!-- With tabs and search -->
<ng-template #tabs>
  <a>All</a>
  <a>Active</a>
</ng-template>

<ng-template #search>
  <smart-searchbar />
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
- Base class: `packages/shared/angular/src/lib/components/section-heading/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`SECTION_HEADING_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ISectionHeadingOptions`)

## HyperUI preset

`SectionHeadingPresetComponent` (`smart-section-heading-preset`) is a HyperUI-styled "content with image" variation. It renders an eyebrow row (label + `badgeTpl`), an `<h2>` title, a description `<p>`, `actionsTpl` below the text, and an optional image column fed by `imageTpl`. Vanilla Tailwind classes are prefixed with `smart:` and ship explicit `smart:dark:*` variants (gray-900 ↔ white for the title, gray-700 ↔ gray-300 for text). Every zone exposes a `data-role` hook: `section`, `grid`, `text`, `image`, `eyebrow`, `actions`.

### New `ISectionHeadingOptions` fields

- `imageTpl?: TemplateRef<unknown>` — the image column. The zone is only rendered when this is provided (`@if`); the template owns the `<img>` and its classes.
- `presentation?: { layout?: 'half' | 'narrow' | 'wide' | 'vertical' }` — layout selector (default `half`). Consumed only by the preset; the standard component ignores it.

| Layout     | Grid                                    | Notes                               |
| ---------- | --------------------------------------- | ----------------------------------- |
| `half`     | `md:grid-cols-2`, text \| image         | Default. Balanced two-column split. |
| `narrow`   | `md:grid-cols-4`, text (1) \| image (3) | Narrow copy, wide image.            |
| `wide`     | `md:grid-cols-4`, image (3) \| text (1) | Image rendered **first**.           |
| `vertical` | `space-y-*` stack (no grid)             | Copy on top, image underneath.      |

### Register the preset

```ts
import { SectionHeadingPresetComponent } from '@smartsoft001/angular';
import { SECTION_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: SECTION_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: SectionHeadingPresetComponent,
  },
];
```

Registering the token restyles every `<smart-section-heading>`; alternatively use `<smart-section-heading-preset>` directly.

### Gaps

`tabsTpl` and `inputGroupTpl` are **not** styled by this preset (they are only rendered by the standard component). Use the standard component when those slots are needed.
