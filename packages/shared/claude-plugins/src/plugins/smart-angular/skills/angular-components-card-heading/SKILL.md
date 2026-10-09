---
name: angular-components-card-heading
description: Card heading component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Card Heading Component

The `<smart-card-heading>` component provides a small composable heading region for cards, with optional slots for avatar, title, description, meta, and actions. It can be used standalone or passed as the `headerTpl` value to `<smart-card>`. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `CardHeadingBaseComponent` defines the shared API — optional `ICardHeadingOptions` and `cssClass` (alias `class`). `CardHeadingStandardComponent` is a barebones placeholder concrete implementation. `CardHeadingComponent` is the public wrapper that renders `CardHeadingStandardComponent` by default and accepts a custom replacement via `CARD_HEADING_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the card heading component
- Developer asks about `<smart-card-heading>`, `CardHeadingComponent`, `CardHeadingStandardComponent`, or `CardHeadingBaseComponent`

## Components

### CardHeadingComponent (`<smart-card-heading>`)

Main wrapper component. Renders `CardHeadingStandardComponent` by default. When `CARD_HEADING_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### CardHeadingStandardComponent (`<smart-card-heading-standard>`)

Barebones placeholder concrete implementation. Renders a wrapper `<div>` with an optional avatar slot, a content area containing `<h3>` (title) + `<p class="description">` (description) + optional meta slot, and an optional actions slot. Each section is rendered only when its corresponding template/string is provided. The external `cssClass` is applied to the wrapper. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### CardHeadingBaseComponent (abstract)

Abstract base directive for extending custom card-heading implementations. Exposes `options` as an `InputSignal<ICardHeadingOptions | undefined>` and `cssClass` as an `InputSignal<string>` (with alias `class`).

## API

### Inputs

| Input     | Type                                            | Default | Description                                                 |
| --------- | ----------------------------------------------- | ------- | ----------------------------------------------------------- |
| `options` | `InputSignal<ICardHeadingOptions \| undefined>` | -       | Optional configuration (title, description, slot templates) |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`)                 |

### ICardHeadingOptions

```typescript
interface ICardHeadingOptions {
  title?: string;
  description?: string;
  avatarTpl?: TemplateRef<unknown>;
  actionsTpl?: TemplateRef<unknown>;
  metaTpl?: TemplateRef<unknown>;
}
```

All properties are optional. The default `CardHeadingStandardComponent` consumes every property; a section is rendered only when its template/string is provided.

## CARD_HEADING_STANDARD_COMPONENT_TOKEN

```typescript
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `CardHeadingStandardComponent` with a custom implementation. Provide a `Type<CardHeadingBaseComponent>` to override.

```typescript
providers: [
  {
    provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomCardHeadingComponent,
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

import { CardHeadingBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-card-heading',
  template: `
    <div [class]="containerClasses()">
      <div class="content">
        @if (options()?.title) {
          <h3>{{ options()!.title }}</h3>
        }
        @if (options()?.description) {
          <p>{{ options()!.description }}</p>
        }
      </div>
      @if (options()?.actionsTpl) {
        <div class="actions">
          <ng-container [ngTemplateOutlet]="options()!.actionsTpl!" />
        </div>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomCardHeadingComponent extends CardHeadingBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-card-heading'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

## Usage Examples

```html
<!-- Title only -->
<smart-card-heading [options]="{ title: 'Job Postings' }" />

<!-- Title and description -->
<smart-card-heading
  [options]="{ title: 'Job Postings', description: 'Currently open' }"
/>

<!-- With actions -->
<ng-template #actions>
  <button>View all</button>
</ng-template>

<smart-card-heading
  [options]="{ title: 'Job Postings', actionsTpl: actions }"
/>

<!-- Inside a smart-card via headerTpl -->
<ng-template #cardHeader>
  <smart-card-heading [options]="{ title: 'Job Postings' }" />
</ng-template>

<smart-card [options]="{ headerTpl: cardHeader }">
  <p>Card body content</p>
</smart-card>
```

## HyperUI preset

`CardHeadingPresetComponent` (`<smart-card-heading-preset>`) is a HyperUI-styled
drop-in replacement for the standard component. It extends
`CardHeadingStandardComponent`, is `OnPush` + `ViewEncapsulation.None`, and
restyles the heading into one of four card looks selected by
`options.presentation.variant`. All utilities are `smart:`-prefixed with
explicit `smart:dark:*` variants. Content flows from the shared
`ICardHeadingOptions` slots; the root element carries `data-role="card"` and
per-variant zones expose `data-role` hooks (`avatar`, `title`, `description`,
`meta`, `actions`, plus `title-hover` for the outline variant).

Because the wrapper forwards inputs canonically through `NgComponentOutlet`, the
preset does `override cssClass = input<string>('')` (dropping the inherited
`class` alias) and merges it into the root card classes.

| Variant   | Look                                                              | Slots used                                                   |
| --------- | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| `author`  | Bordered, rounded card; avatar to the side, meta `<dl>` (default) | title, description, avatarTpl, metaTpl, actionsTpl           |
| `stacked` | Large top image, title + description stacked underneath           | title, description, avatarTpl, metaTpl, actionsTpl           |
| `overlay` | Full-bleed image on a black backdrop, content revealed on hover   | title, description, avatarTpl, metaTpl (eyebrow), actionsTpl |
| `outline` | Dashed offset border, title flips to description/action on hover  | title, description, avatarTpl, actionsTpl                    |

`presentation.variant` defaults to `author` (also the fallback for an unknown
value).

### Register the preset

```typescript
import { CARD_HEADING_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
import { CardHeadingPresetComponent } from '@smartsoft001/angular';

providers: [
  {
    provide: CARD_HEADING_STANDARD_COMPONENT_TOKEN,
    useValue: CardHeadingPresetComponent,
  },
];
```

### Gaps (out of scope)

HyperUI card templates 5–9 are not implemented — they need domain fields absent
from `ICardHeadingOptions`:

- **Property card** — price, address, list of numeric specs (beds/baths/area).
- **Profile with social + project links** — dedicated social-icon and
  project-link collections (dark profile card).
- **Shaped image** — a decorative clip-path/image-shape treatment with no
  content-driven data channel.
- **Podcast post** — episode number, duration, and audio/player metadata.
- **Forum post** — author, reply count, tag list, and activity timestamps.

Adding any of these would require extending `ICardHeadingOptions` (e.g.
structured `stats`, `links`, or `badges` collections) before a faithful preset
variant can be built.

## File Locations

- Preset: `packages/shared/angular/src/lib/components/card-heading/preset/preset.component.ts`
- Preset classes: `packages/shared/angular/src/lib/components/card-heading/preset/preset-classes.util.ts`
- Wrapper: `packages/shared/angular/src/lib/components/card-heading/card-heading.component.ts`
- Standard: `packages/shared/angular/src/lib/components/card-heading/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/card-heading/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CARD_HEADING_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICardHeadingOptions`)
