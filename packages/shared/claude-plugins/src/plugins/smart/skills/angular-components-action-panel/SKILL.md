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

Main wrapper. Delegates to `ActionPanelStandardComponent` by default. When `ACTION_PANEL_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`. Re-emits `actionClick`.

### ActionPanelStandardComponent (`<smart-action-panel-standard>`)

Barebones placeholder using native HTML. Renders an outer wrapper with `cssClass`, a `<section class="action-panel">` containing an optional `<h3>{{ options.title }}</h3>`, an optional description (string `options.description` rendered as `<p class="description">` or `options.descriptionTpl` rendered via `NgTemplateOutlet`), an optional `<div class="content">` slot from `options.contentTpl`, and an optional `<div class="actions">` row of `<button class="action variant-{variant}">` (or `<a>` when `action.href` is provided) per `options.actions` entry that emits `{ actionId }` via `actionClick`.

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
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ActionPanelBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-action-panel',
  template: `
    <section>
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
export class MyCustomActionPanelComponent extends ActionPanelBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
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

<!-- With multiple actions -->
<smart-action-panel
  [options]="{
    title: 'Manage subscription',
    description: 'Cancel anytime.',
    layout: 'right-button',
    actions: [
      { id: 'cancel', label: 'Cancel', variant: 'ghost' },
      { id: 'change', label: 'Change plan', variant: 'primary' },
    ],
  }"
  (actionClick)="onAction($event)"
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
