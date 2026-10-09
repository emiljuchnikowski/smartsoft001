---
name: angular-components-action-panel
description: Action Panel component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Action Panel Component

The `<smart-action-panel>` component renders a standalone panel with a heading, description and one or more actions (buttons or links). It is typically used to surface a small "card" of contextual settings (e.g. _Manage subscription_, _Update your email_, _Renew automatically_). It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ActionPanelBaseComponent` defines the shared API — `options` (`IActionPanelOptions`), `cssClass` (alias `class`), and the `actionClick` output. `ActionPanelStandardComponent` is a barebones placeholder using native `<section>`, `<h3>`, `<p>`, `<a>`, and `<button>` elements. `ActionPanelComponent` is the public wrapper that renders `ActionPanelStandardComponent` by default and accepts a custom replacement via `ACTION_PANEL_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the action panel component
- Developer asks about `<smart-action-panel>`, `ActionPanelComponent`, `ActionPanelStandardComponent`, or `ActionPanelBaseComponent`

## Components

### ActionPanelComponent (`<smart-action-panel>`)

Main wrapper. Delegates to `ActionPanelStandardComponent` by default. When `ACTION_PANEL_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passes it the inputs and re-emits its `actionClick`.

### ActionPanelStandardComponent (`<smart-action-panel-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<section class="action-panel">` containing an optional `<h3>{{ options.title }}</h3>`, an optional description (string `options.description` rendered as `<p class="description">` or `options.descriptionTpl` rendered via `NgTemplateOutlet`), an optional `<div class="content">` slot from `options.contentTpl`, and an optional `<div class="actions">` row of `<button class="action variant-{variant}">` (or `<a>` when `action.href` is provided) per `options.actions` entry that emits `{ actionId }` via `actionClick`. It does not vary its markup by `options.layout`.

### ActionPanelBaseComponent (abstract)

Abstract base directive. Exposes:

- `options: InputSignal<IActionPanelOptions | undefined>`
- `cssClass: InputSignal<string>` (alias `class`)
- `actionClick: OutputEmitterRef<IActionPanelActionClick>`

`IActionPanelActionClick = { actionId: string }`.

## API

### Inputs

| Input     | Type                                            | Default | Description                                 |
| --------- | ----------------------------------------------- | ------- | ------------------------------------------- |
| `options` | `InputSignal<IActionPanelOptions \| undefined>` | -       | Panel configuration                         |
| `class`   | `InputSignal<string>`                           | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Type                                        | Description                                  |
| ------------- | ------------------------------------------- | -------------------------------------------- |
| `actionClick` | `OutputEmitterRef<IActionPanelActionClick>` | Emitted when a button-type action is clicked |

### IActionPanelOptions

| Field            | Type                     | Default     | Description                                                                                                                  |
| ---------------- | ------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `title`          | `string`                 | `undefined` | Heading of the panel.                                                                                                        |
| `description`    | `string`                 | `undefined` | Text under the heading.                                                                                                      |
| `layout`         | `SmartActionPanelLayout` | `'simple'`  | Preset only: one of the eight arrangements of `ActionPanelPresetComponent`. The standard does not vary its markup by layout. |
| `actions`        | `IActionPanelAction[]`   | `[]`        | The buttons / links of the panel.                                                                                            |
| `descriptionTpl` | `TemplateRef<unknown>`   | `undefined` | Replaces `description` with a template.                                                                                      |
| `contentTpl`     | `TemplateRef<unknown>`   | `undefined` | Extra content placed in the panel (a toggle, an input, a card).                                                              |

### IActionPanelAction

| Field     | Type                                            | Default     | Description                                                                                                                                                                                                                                                                                                   |
| --------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | `string`                                        | required    | Reported as `actionId` by `actionClick`.                                                                                                                                                                                                                                                                      |
| `label`   | `string`                                        | `undefined` | Text of the button / link.                                                                                                                                                                                                                                                                                    |
| `href`    | `string`                                        | `undefined` | Renders the action as a link instead of a button (no `actionClick`).                                                                                                                                                                                                                                          |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | `undefined` | Look of the action. The standard only adds the class `variant-<variant>` (`variant-primary` by default for buttons, `variant-link` for links). The preset renders `primary` as a solid button and every other value, or none, as an outline button; in the `with-link` layout every action looks like a link. |
| `iconTpl` | `TemplateRef<unknown>`                          | `undefined` | Icon rendered before the label.                                                                                                                                                                                                                                                                               |

`SmartActionPanelLayout` is `'simple' | 'with-link' | 'right-button' | 'top-right-button' | 'with-toggle' | 'with-input' | 'well' | 'payment-method'`.

```typescript
type SmartActionPanelLayout =
  | 'simple'
  | 'with-link'
  | 'right-button'
  | 'top-right-button'
  | 'with-toggle'
  | 'with-input'
  | 'well'
  | 'payment-method';

interface IActionPanelOptions {
  title?: string;
  description?: string;
  layout?: SmartActionPanelLayout;
  actions?: IActionPanelAction[];
  descriptionTpl?: TemplateRef<unknown>;
  contentTpl?: TemplateRef<unknown>;
}

interface IActionPanelAction {
  id: string;
  label?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  iconTpl?: TemplateRef<unknown>;
}
```

## ACTION_PANEL_STANDARD_COMPONENT_TOKEN

InjectionToken that replaces the default `ActionPanelStandardComponent` with a custom implementation: provide a `Type<ActionPanelBaseComponent>` under `ACTION_PANEL_STANDARD_COMPONENT_TOKEN`. Every `<smart-action-panel>` in that injector renders it, gets the wrapper's inputs (`class` included) and re-emits its `actionClick`.

```typescript
import { ACTION_PANEL_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomActionPanelComponent,
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

import { ActionPanelBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-action-panel',
  template: `
    <section [class]="cssClass()">
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
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomActionPanelComponent extends ActionPanelBaseComponent {}
```

## Usage Examples

```html
<!-- Simple panel with primary action -->
<smart-action-panel
  [options]="{
    title: 'Manage subscription',
    description: 'Lorem ipsum dolor sit amet.',
    actions: [{ id: 'change', label: 'Change plan', variant: 'primary' }],
  }"
  (actionClick)="onAction($event)"
/>

<!-- With link action -->
<smart-action-panel
  [options]="{
    title: 'Continuous Integration',
    description: 'Learn more about our CI features.',
    actions: [
      { id: 'learn', label: 'Learn more', href: '/learn', variant: 'link' },
    ],
  }"
/>

<!-- With templated content (e.g. embedded toggle/input/well) -->
<ng-template #payment>
  <div class="payment-method">…</div>
</ng-template>

<smart-action-panel
  [options]="{
    title: 'Payment method',
    layout: 'well',
    contentTpl: payment,
    actions: [{ id: 'edit', label: 'Edit', variant: 'secondary' }],
  }"
/>
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/action-panel/action-panel.component.ts`
- Standard: `packages/shared/angular/src/lib/components/action-panel/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/action-panel/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`ACTION_PANEL_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IActionPanelOptions`, `IActionPanelAction`, `SmartActionPanelLayout`)

## Preset

`ActionPanelPresetComponent` (`<smart-action-panel-preset>`) extends `ActionPanelStandardComponent` and restyles the panel as a bordered card (`rounded-xl border bg-white p-4 shadow-2xs sm:p-6` + dark twin). Title uses `text-base font-semibold text-gray-900`, description `text-sm text-gray-500`; `descriptionTpl` overrides the description text.

Register it under `ACTION_PANEL_STANDARD_COMPONENT_TOKEN` (`{ provide: ACTION_PANEL_STANDARD_COMPONENT_TOKEN, useValue: ActionPanelPresetComponent }`) to restyle every `<smart-action-panel>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-action-panel-preset>` selector directly. Used directly, it takes the extra classes as `class` or `[cssClass]`.

All eight `SmartActionPanelLayout` values are realized through a `@switch` (default `simple`):

- `simple` / `with-input` / `payment-method` — title, description, content slot, then actions stacked below.
- `with-link` — actions rendered as `text-blue-600 hover:underline` links.
- `right-button` — flex row, content left, actions right, vertically centered.
- `top-right-button` — actions in the title row, right-aligned.
- `with-toggle` — content slot placed beside the text (flex row), actions below.
- `well` — content and actions wrapped in an inset `bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4` panel.

Actions map by `variant`: `primary` → solid `bg-blue-600 text-white`, any other value or none → outline `border-gray-200 bg-white text-gray-800` + dark. `href` actions render as `<a>`, the rest as `<button>` emitting `actionClick` with the action id. DOM hooks: `data-role` of `panel`/`title`/`description`/`content`/`actions`/`well`, plus per-action `data-role="action"` with `data-action-id`; the panel also carries `data-layout`.

Gaps: `with-toggle` / `with-input` / `payment-method` only position the content slot — the interactive control (toggle switch, input, card list) is supplied by the caller via `contentTpl`.
