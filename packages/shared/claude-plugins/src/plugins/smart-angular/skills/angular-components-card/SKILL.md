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

| Input       | Type           | Default     | Description                                                                                        |
| ----------- | -------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `options`   | `ICardOptions` | `undefined` | Card configuration                                                                                 |
| `hasHeader` | `boolean`      | `false`     | Renders the header section. The `[cardHeader]` content and `options.title` show only while `true`. |
| `hasFooter` | `boolean`      | `false`     | Renders the footer section. The `[cardFooter]` content shows only while `true`.                    |
| `class`     | `string`       | `''`        | Extra container class                                                                              |

### ICardOptions

| Field        | Type                        | Default     | Description                                                                                                                                                                        |
| ------------ | --------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`      | `string`                    | `undefined` | Rendered as an `<h3>` at the start of the header, when `hasHeader` is `true`.                                                                                                      |
| `buttons`    | `Array<IIconButtonOptions>` | `undefined` | Deprecated: not read by the built-in implementations (standard or preset); available to a custom implementation. Put actions in the `[cardHeader]` / `[cardFooter]` slots instead. |
| `grayFooter` | `boolean`                   | `undefined` | Gray background on the footer.                                                                                                                                                     |
| `grayBody`   | `boolean`                   | `undefined` | Gray background on the body.                                                                                                                                                       |

```typescript
interface ICardOptions {
  title?: string;
  /** @deprecated Never rendered by any variant; use the [cardHeader] / [cardFooter] slots. */
  buttons?: Array<IIconButtonOptions>;
  grayFooter?: boolean;
  grayBody?: boolean;
}
```

`IIconButtonOptions` (`icon`, `text`, `handler`, `component`, `type`, `disabled$: Observable<boolean>`, `number`) is shared with the page buttons; the card does not render it.

### Content Projection

| Selector       | Description                           |
| -------------- | ------------------------------------- |
| `[cardHeader]` | Header content (with `hasHeader` set) |
| default        | Body content                          |
| `[cardFooter]` | Footer content (with `hasFooter` set) |

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

1. **`CardBaseComponent`** (`@Directive()`) — shared inputs (`options`, `hasHeader`, `hasFooter`, `cssClass` with the `class` alias, the optional `headerTpl` / `footerTpl` and the required `bodyTpl`, all `TemplateRef<unknown>`) and computed classes (`sharedContainerClasses`, `headerClasses`, `bodyClasses`, `footerClasses`). Handles divider, gray body/footer, and padding rules.
2. **`CardStandardComponent`** (selector: `smart-card-standard`) — default concrete implementation extending the base. Neutral Tailwind style with dark mode (`rounded-lg`, `bg-white`, `shadow-sm`, `dark:bg-gray-800/50`, `dark:outline-white/10`).
3. **`CardComponent`** (selector: `smart-card`) — wrapper. Uses `inject(CARD_STANDARD_COMPONENT_TOKEN, { optional: true })` + `*ngComponentOutlet` to render the injected component, falling back to `<smart-card-standard>`. Content projection (`[cardHeader]`, default, `[cardFooter]`) is wrapped in local `<ng-template>` refs and passed as inputs (`headerTpl`/`bodyTpl`/`footerTpl`) to the active component, together with `options`, `hasHeader`, `hasFooter` and `class`.

## Extending the Base Class

```typescript
import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import {
  CardBaseComponent,
  CARD_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';

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

Register the subclass under `CARD_STANDARD_COMPONENT_TOKEN`; every `<smart-card>` in that injector then renders it with the projected sections as `headerTpl` / `bodyTpl` / `footerTpl`.

## CardPresetComponent (`smart-card-preset`)

Fully-styled, drop-in concrete implementation extending `CardBaseComponent` — a faithful translation of Preline's card (`rounded-xl` surface, `shadow-2xs`, bordered surface header/footer) into `smart:`-prefixed vanilla Tailwind with explicit `dark:` variants. Honours `options.title`, `options.grayBody`, and `options.grayFooter`, and renders the same `headerTpl` / `bodyTpl` / `footerTpl` slots as the base. It separates the sections with its own borders, not with the base's divider classes.

Use it directly via `<smart-card-preset>` (it takes the extra classes as `class` or `[cssClass]`), register it through `CARD_STANDARD_COMPONENT_TOKEN` (`{ provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: CardPresetComponent }`) to restyle every `<smart-card>`, or register every preset at once with `provideSmartPresets()`.

```typescript
import {
  CardPresetComponent,
  CARD_STANDARD_COMPONENT_TOKEN,
} from '@smartsoft001/angular';

providers: [
  { provide: CARD_STANDARD_COMPONENT_TOKEN, useValue: CardPresetComponent },
];
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/card/card.component.ts`
- Default: `packages/shared/angular/src/lib/components/card/standard/standard.component.{ts,html}`
- Preset: `packages/shared/angular/src/lib/components/card/preset/preset.component.{ts,html}` + `preset/preset-classes.util.ts` (internal)
- Base: `packages/shared/angular/src/lib/components/card/base/base.component.ts`
- Tests: `packages/shared/angular/src/lib/components/card/{card,standard/standard,base/base}.component.spec.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`CARD_STANDARD_COMPONENT_TOKEN`)
- Interface: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICardOptions`)

## Tailwind Classes

All classes use `smart:` prefix. `CardStandardComponent` container: `smart:overflow-hidden smart:rounded-lg smart:bg-white smart:shadow-sm`. Dark mode: `smart:dark:bg-gray-800/50 smart:dark:shadow-none smart:dark:outline smart:dark:-outline-offset-1 smart:dark:outline-white/10`. Divider between the sections when `hasHeader` or `hasFooter` is set and neither `grayBody` nor `grayFooter` is: `smart:divide-y smart:divide-gray-200 smart:dark:divide-white/10`. Gray body/footer: `smart:bg-gray-50 smart:dark:bg-gray-800/50`.
