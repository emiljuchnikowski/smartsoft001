---
name: angular-components-card
description: Card component API, DI token, and base class for @smartsoft001/angular
user-invocable: false
---

# Card Component

Flexible card container with injectable standard rendering. The `<smart-card>` wrapper renders `CardStandardComponent` by default (a neutral Tailwind placeholder with dark mode). Consumers can replace the standard with a custom variant via `CARD_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to render a card container → use `<smart-card>`
- Developer wants a custom visual variant → extend `CardBaseComponent` and provide via `CARD_STANDARD_COMPONENT_TOKEN`
- Developer asks about header/footer sections → set `hasHeader`/`hasFooter` + use `[cardHeader]` / `[cardFooter]` content projection

## Public API

### Wrapper: `smart-card`

| Input       | Type           | Default     | Description           |
| ----------- | -------------- | ----------- | --------------------- |
| `options`   | `ICardOptions` | `undefined` | Card configuration    |
| `hasHeader` | `boolean`      | `false`     | Show header section   |
| `hasFooter` | `boolean`      | `false`     | Show footer section   |
| `class`     | `string`       | `''`        | Extra container class |

### ICardOptions

```typescript
interface ICardOptions {
  title?: string;
  buttons?: Array<IIconButtonOptions>;
  grayFooter?: boolean;
  grayBody?: boolean;
}
```

### Content Projection

| Selector       | Description    |
| -------------- | -------------- |
| `[cardHeader]` | Header content |
| default        | Body content   |
| `[cardFooter]` | Footer content |

## Usage

```html
<!-- Basic -->
<smart-card><p>Content</p></smart-card>

<!-- With title in header -->
<smart-card [options]="{ title: 'Title' }" [hasHeader]="true">
  <p>Body</p>
</smart-card>

<!-- Header + footer + gray footer -->
<smart-card
  [options]="{ grayFooter: true }"
  [hasHeader]="true"
  [hasFooter]="true"
>
  <div cardHeader>Custom Header</div>
  <p>Body</p>
  <div cardFooter>Footer</div>
</smart-card>
```

## Architecture

Three-layer pattern mirroring `<smart-button>`:

1. **`CardBaseComponent`** (`@Directive()`) — shared signals/inputs (`options`, `hasHeader`, `hasFooter`, `class`, `headerTpl`, `bodyTpl`, `footerTpl`) and computed classes (`sharedContainerClasses`, `headerClasses`, `bodyClasses`, `footerClasses`). Handles divider, gray body/footer, and padding rules.
2. **`CardStandardComponent`** (selector: `smart-card-standard`) — default concrete implementation extending the base. Neutral Tailwind style with dark mode (`rounded-lg`, `bg-white`, `shadow-sm`, `dark:bg-gray-800/50`, `dark:outline-white/10`).
3. **`CardComponent`** (selector: `smart-card`) — wrapper. Uses `inject(CARD_STANDARD_COMPONENT_TOKEN, { optional: true })` + `*ngComponentOutlet` to render the injected component, falling back to `<smart-card-standard>`. Content projection (`[cardHeader]`, default, `[cardFooter]`) is wrapped in local `<ng-template>` refs and passed as inputs (`headerTpl`/`bodyTpl`/`footerTpl`) to the active component.

## Overriding with Custom Implementation

```typescript
import { Component } from '@angular/core';
import {
  CardBaseComponent,
  CARD_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'smart-card-my-variant',
  imports: [NgTemplateOutlet],
  template: `...custom template using headerTpl()/bodyTpl()/footerTpl()...`,
})
export class CardMyVariantComponent extends CardBaseComponent {}

// In app bootstrap:
providers: [
  { provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: CardMyVariantComponent },
];
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/card/card.component.ts`
- Default: `packages/shared/angular/src/lib/components/card/standard/standard.component.{ts,html}`
- Base: `packages/shared/angular/src/lib/components/card/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/card/{card,standard/standard,base/base}.component.spec.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CARD_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICardOptions`)

## Tailwind Classes

All classes use `smart:` prefix. `CardStandardComponent` container: `smart:overflow-hidden smart:rounded-lg smart:bg-white smart:shadow-sm`. Dark mode: `smart:dark:bg-gray-800/50 smart:dark:shadow-none smart:dark:outline smart:dark:-outline-offset-1 smart:dark:outline-white/10`. Divider when header/footer present: `smart:divide-y smart:divide-gray-200 smart:dark:divide-white/10`. Gray body/footer: `smart:bg-gray-50 smart:dark:bg-gray-800/50`.
