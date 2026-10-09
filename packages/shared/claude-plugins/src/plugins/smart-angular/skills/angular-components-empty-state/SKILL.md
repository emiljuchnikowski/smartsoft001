---
name: angular-components-empty-state
description: Empty State component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Empty State Component

The `<smart-empty-state>` component renders an empty-state placeholder with an optional centered icon, title, description, primary actions and a list of starting-points / templates / recommendations. It is typically shown when a list, page or section has no content yet (e.g. _No projects_, _Create your first project_, _Add team members_). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `EmptyStateBaseComponent` defines the shared API — `options` (`IEmptyStateOptions`), `cssClass` (alias `class`), and the `actionClick` / `itemClick` outputs. `EmptyStateStandardComponent` is a barebones placeholder using native `<h3>`, `<p>`, `<a>`, `<button>`, `<ul>` and `<li>` elements. `EmptyStateComponent` is the public wrapper that renders `EmptyStateStandardComponent` by default and accepts a custom replacement via `EMPTY_STATE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the empty state component
- Developer asks about `<smart-empty-state>`, `EmptyStateComponent`, `EmptyStateStandardComponent`, or `EmptyStateBaseComponent`

## Components

### EmptyStateComponent (`<smart-empty-state>`)

Main wrapper. Delegates to `EmptyStateStandardComponent` by default. When `EMPTY_STATE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `actionClick` and `itemClick` of whichever implementation it renders.

### EmptyStateStandardComponent (`<smart-empty-state-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<div class="empty-state">` containing optional `iconTpl` (rendered via `NgTemplateOutlet`), `<h3 class="title">{{ options.title }}</h3>`, `<p class="description">{{ options.description }}</p>`, an optional `formTpl` slot, an optional row of action buttons or anchors (`<button class="action variant-{variant}">` or `<a>` when `action.href` provided), an optional list of items (`<a class="item-link">` when `item.href` provided, otherwise `<button class="item-button">`) with title / description / meta / icon / image, and an optional footer link.

### EmptyStatePresetComponent (`<smart-empty-state-preset>`)

Fully-styled drop-in replacement for `EmptyStateStandardComponent`, adapting Preline's "Invoice Table Empty State" centered block: a rounded icon tile (`iconTpl`), title, description, a "Learn more" text link (`footerLinkLabel` / `footerLinkHref`) and a row of action buttons. Optional `items` render as a simple bordered list so it stays a full drop-in. All Tailwind classes are `smart:`-prefixed with explicit `dark:` variants. Action `variant` maps to `primary` (blue button), `secondary` (white/layer button), `ghost` (text + hover) and `link` (inline blue link); without a `variant` an action with `href` is a `link` and one without is `primary`. Register it for `EMPTY_STATE_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-empty-state>` (or every preset at once with `provideSmartPresets()`), or use the selector directly. The preset declares `cssClass` without the `class` alias, so bind `[cssClass]` on the `<smart-empty-state-preset>` selector; `class` on `<smart-empty-state>` reaches it through the wrapper.

### EmptyStateBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IEmptyStateOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `actionClick: OutputEmitterRef<IEmptyStateActionClick>`
- `itemClick: OutputEmitterRef<IEmptyStateItemClick>`

`IEmptyStateActionClick = { actionId: string }`
`IEmptyStateItemClick = { itemId: string }`

## API

### Inputs

| Input     | Type                                           | Default | Description                                                   |
| --------- | ---------------------------------------------- | ------- | ------------------------------------------------------------- |
| `options` | `InputSignal<IEmptyStateOptions \| undefined>` | -       | Empty state configuration                                     |
| `class`   | `InputSignal<string>`                          | `''`    | Classes on the root element (`cssClass` input, alias `class`) |

### Outputs

| Output        | Type                                       | Description                                    |
| ------------- | ------------------------------------------ | ---------------------------------------------- |
| `actionClick` | `OutputEmitterRef<IEmptyStateActionClick>` | Emitted when a button-type action is clicked   |
| `itemClick`   | `OutputEmitterRef<IEmptyStateItemClick>`   | Emitted when an item without `href` is clicked |

### IEmptyStateOptions

All fields are optional. The standard and the preset read every field except `layout`.

| Field             | Type                    | Default | Description                                                                     |
| ----------------- | ----------------------- | ------- | ------------------------------------------------------------------------------- |
| `title`           | `string`                | -       | Heading.                                                                        |
| `description`     | `string`                | -       | Text under the heading.                                                         |
| `iconTpl`         | `TemplateRef<unknown>`  | -       | Icon or illustration above the title.                                           |
| `actions`         | `IEmptyStateAction[]`   | `[]`    | Buttons / links under the description.                                          |
| `items`           | `IEmptyStateItem[]`     | `[]`    | Suggested items (starting points, templates, recommendations) listed below.     |
| `itemsTitle`      | `string`                | -       | Heading of the items list.                                                      |
| `formTpl`         | `TemplateRef<unknown>`  | -       | A form slot (e.g. an invite input).                                             |
| `footerLinkLabel` | `string`                | -       | Text of the footer link (a plain text without `footerLinkHref`).                |
| `footerLinkHref`  | `string`                | -       | Target of the footer link.                                                      |
| `layout`          | `SmartEmptyStateLayout` | -       | Not read by the built-in implementations; available to a custom implementation. |

`SmartEmptyStateLayout` is `'simple' | 'dashed-border' | 'starting-points' | 'with-recommendations' | 'with-templates' | 'with-recommendations-grid'`.

### IEmptyStateAction

| Field     | Type                                            | Default  | Description                                                            |
| --------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `id`      | `string`                                        | required | Reported as `actionId`.                                                |
| `label`   | `string`                                        | -        | Button / link text.                                                    |
| `href`    | `string`                                        | -        | Renders a link instead of a button (a link emits no `actionClick`).    |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | -        | Look of the action; defaults to `link` with `href`, `primary` without. |
| `iconTpl` | `TemplateRef<unknown>`                          | -        | Icon next to the label.                                                |

### IEmptyStateItem

| Field         | Type                   | Default  | Description                                                      |
| ------------- | ---------------------- | -------- | ---------------------------------------------------------------- |
| `id`          | `string`               | required | Reported as `itemId`.                                            |
| `title`       | `string`               | -        | Item title.                                                      |
| `description` | `string`               | -        | Item text.                                                       |
| `href`        | `string`               | -        | Renders the item as a link (no `itemClick`) instead of a button. |
| `iconTpl`     | `TemplateRef<unknown>` | -        | Item icon.                                                       |
| `imageUrl`    | `string`               | -        | Item image.                                                      |
| `imageAlt`    | `string`               | -        | Alt text of the image.                                           |
| `meta`        | `string`               | -        | Small extra text.                                                |

```typescript
type SmartEmptyStateLayout =
  | 'simple'
  | 'dashed-border'
  | 'starting-points'
  | 'with-recommendations'
  | 'with-templates'
  | 'with-recommendations-grid';

interface IEmptyStateOptions {
  title?: string;
  description?: string;
  layout?: SmartEmptyStateLayout;
  iconTpl?: TemplateRef<unknown>;
  actions?: IEmptyStateAction[];
  items?: IEmptyStateItem[];
  itemsTitle?: string;
  formTpl?: TemplateRef<unknown>;
  footerLinkLabel?: string;
  footerLinkHref?: string;
}

interface IEmptyStateAction {
  id: string;
  label?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  iconTpl?: TemplateRef<unknown>;
}

interface IEmptyStateItem {
  id: string;
  title?: string;
  description?: string;
  href?: string;
  iconTpl?: TemplateRef<unknown>;
  imageUrl?: string;
  imageAlt?: string;
  meta?: string;
}
```

## EMPTY_STATE_STANDARD_COMPONENT_TOKEN

Provide a `Type<EmptyStateBaseComponent>` for `EMPTY_STATE_STANDARD_COMPONENT_TOKEN` to render it in every `<smart-empty-state>` below that injector; the wrapper passes `options` and the class on and re-emits its `actionClick` and `itemClick`.

```typescript
import { EMPTY_STATE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: EMPTY_STATE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomEmptyStateComponent,
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

import { EmptyStateBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-empty-state',
  template: `
    <div class="text-center">
      @if (options()?.title) {
        <h3>{{ options()!.title }}</h3>
      }
      @if (options()?.description) {
        <p>{{ options()!.description }}</p>
      }
      @for (action of options()?.actions ?? []; track action.id) {
        <button
          type="button"
          (click)="actionClick.emit({ actionId: action.id })"
        >
          {{ action.label }}
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomEmptyStateComponent extends EmptyStateBaseComponent {}
```

## Usage Examples

```html
<!-- Simple "No projects" empty state -->
<smart-empty-state
  [options]="{
    title: 'No projects',
    description: 'Get started by creating a new project.',
    actions: [{ id: 'create', label: 'New Project', variant: 'primary' }],
  }"
  (actionClick)="onAction($event)"
/>

<!-- With starting-points list -->
<smart-empty-state
  [options]="{
    title: 'Projects',
    description: 'Get started by selecting a template.',
    items: [
      { id: 'list', title: 'Create a List', description: 'A simple list', href: '/lists/new' },
      { id: 'calendar', title: 'Create a Calendar', description: 'Track deadlines', href: '/calendars/new' },
    ],
    footerLinkLabel: 'Or start from an empty project',
    footerLinkHref: '/projects/new',
  }"
/>

<!-- With template list emitting itemClick -->
<smart-empty-state
  [options]="{
    title: 'Create your first project',
    items: [
      { id: 'marketing', title: 'Marketing Campaign', description: 'Memes' },
      { id: 'engineering', title: 'Engineering Project', description: 'Code' },
    ],
  }"
  (itemClick)="onTemplate($event)"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/empty-state/empty-state.component.ts`
- Standard: `packages/shared/angular/src/lib/components/empty-state/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/empty-state/preset/preset.component.ts`
- Base class: `packages/shared/angular/src/lib/components/empty-state/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`EMPTY_STATE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IEmptyStateOptions`, `IEmptyStateAction`, `IEmptyStateItem`, `SmartEmptyStateLayout`)
