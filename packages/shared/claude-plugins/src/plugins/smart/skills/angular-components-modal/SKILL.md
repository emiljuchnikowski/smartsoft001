---
name: angular-components-modal
description: Modal component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Modal Component

The `<smart-modal>` component provides a dialog overlay with title, description, an arbitrary projected body, and a list of action buttons. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `ModalBaseComponent` defines the shared API — two-way `open` (`ModelSignal<boolean>`), optional `title` and `description`, `actions` (`InputSignal<IModalAction[]>`), optional `IModalOptions`, `cssClass` (alias `class`), `actionClick` and `closed` outputs, and `invokeAction(actionId)` / `close()` methods. `ModalStandardComponent` is a barebones placeholder concrete implementation. `ModalComponent` is the public wrapper that renders `ModalStandardComponent` by default and accepts a custom replacement via `MODAL_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the modal/dialog component
- Developer asks about `<smart-modal>`, `ModalComponent`, `ModalStandardComponent`, or `ModalBaseComponent`

## Components

### ModalComponent (`<smart-modal>`)

Main wrapper component. Renders `ModalStandardComponent` by default. When `MODAL_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### ModalStandardComponent (`<smart-modal-standard>`)

Barebones placeholder concrete implementation. Renders a native `<dialog [open] role="dialog" aria-modal="true">` containing an optional `<h2 id="smart-modal-title">`, an optional `<p>` description, an `<ng-content>` slot for arbitrary body content, an optional dismiss `<button>` (when `options.withDismiss` is `true`), and a `<footer>` with one `<button data-variant>` per action. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### ModalBaseComponent (abstract)

Abstract base directive for extending custom modal implementations. Exposes `open` as a two-way `ModelSignal<boolean>`, `title` / `description` as optional `InputSignal<string | undefined>`, `actions` as `InputSignal<IModalAction[]>` (default `[]`), `options` as `InputSignal<IModalOptions | undefined>`, `cssClass` as `InputSignal<string>` (with alias `class`), `actionClick` and `closed` outputs, plus `invokeAction(actionId)` (emits `actionClick`) and `close()` (sets `open` to `false` and emits `closed`).

## API

### Inputs

| Input         | Type                                      | Default | Description                                  |
| ------------- | ----------------------------------------- | ------- | -------------------------------------------- |
| `open`        | `ModelSignal<boolean>`                    | `false` | Visibility state (two-way bindable)          |
| `title`       | `InputSignal<string \| undefined>`        | -       | Dialog heading (also sets `aria-labelledby`) |
| `description` | `InputSignal<string \| undefined>`        | -       | Optional secondary description text          |
| `actions`     | `InputSignal<IModalAction[]>`             | `[]`    | Action buttons rendered in the footer        |
| `options`     | `InputSignal<IModalOptions \| undefined>` | -       | Optional configuration                       |
| `class`       | `InputSignal<string>`                     | `''`    | External CSS classes (alias for `cssClass`)  |

### Outputs

| Output        | Payload                | Description                               |
| ------------- | ---------------------- | ----------------------------------------- |
| `actionClick` | `{ actionId: string }` | Fired when a footer action is clicked     |
| `closed`      | `void`                 | Fired when the dialog is dismissed/closed |

### IModalAction

```typescript
interface IModalAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### IModalOptions

```typescript
interface IModalOptions {
  variant?: 'centered' | 'wide' | 'alert' | 'left-aligned-buttons';
  withDismiss?: boolean;
  footerStyle?: 'default' | 'gray';
  ariaLabel?: string;
}
```

The default `ModalStandardComponent` consumes `withDismiss` (renders a dismiss `×` button) and `ariaLabel` (used as `aria-label` when `title` is not provided). The `variant` and `footerStyle` selectors are reserved for custom implementations registered through `MODAL_STANDARD_COMPONENT_TOKEN`.

## MODAL_STANDARD_COMPONENT_TOKEN

```typescript
import { MODAL_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `ModalStandardComponent` with a custom implementation. Provide a `Type<ModalBaseComponent>` to override.

```typescript
providers: [
  {
    provide: MODAL_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomModalComponent,
  },
];
```

## Content projection

`ModalStandardComponent` accepts arbitrary body content via `<ng-content>` and the wrapper forwards its own `<ng-content>` into the standard. **However, `NgComponentOutlet` does not propagate projected content** — when a custom component is registered via the token, the wrapper renders the custom component as a sibling and the consumer's `<ng-content>` is dropped. Custom implementations should rely on inputs (`title`, `description`, structured `data` extension) or expose their own template inputs rather than `<ng-content>`.

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { ModalBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-modal',
  template: `
    <dialog
      [open]="open()"
      role="dialog"
      aria-modal="true"
      [class]="cssClass()"
    >
      @if (title()) {
        <h2>{{ title() }}</h2>
      }
      @if (description()) {
        <p>{{ description() }}</p>
      }
      <footer>
        @for (action of actions(); track action.id) {
          <button (click)="invokeAction(action.id)">{{ action.label }}</button>
        }
      </footer>
    </dialog>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomModalComponent extends ModalBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) when the component is used via `NgComponentOutlet` through `MODAL_STANDARD_COMPONENT_TOKEN`,
- call `invokeAction(id)` to emit `actionClick`, and `close()` to emit `closed` and set `open.set(false)`,
- implement `Escape` key handling and backdrop click yourself if you want native UX — the base does not bind any keyboard or backdrop listeners.

## Usage Examples

```html
<!-- Basic with title + actions -->
<smart-modal
  [(open)]="confirmOpen"
  title="Deactivate account"
  description="This action cannot be undone."
  [actions]="[
    { id: 'cancel', label: 'Cancel', variant: 'secondary' },
    { id: 'confirm', label: 'Deactivate', variant: 'danger' },
  ]"
  (actionClick)="onAction($event)"
/>

<!-- With dismiss button + projected body -->
<smart-modal [(open)]="open" [options]="{ withDismiss: true }">
  <form>
    <!-- custom body -->
  </form>
</smart-modal>

<!-- With external class -->
<smart-modal [(open)]="open" class="smart:p-4" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/modal/modal.component.ts`
- Standard: `packages/shared/angular/src/lib/components/modal/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/modal/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`MODAL_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IModalAction`, `IModalOptions`)
