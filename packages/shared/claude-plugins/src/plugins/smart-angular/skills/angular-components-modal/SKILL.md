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
- Developer wants to open a component in a modal from code and await its result (`ModalService`)

## Components

### ModalComponent (`<smart-modal>`)

Main wrapper component. Renders `ModalStandardComponent` by default. When `MODAL_STANDARD_COMPONENT_TOKEN` is provided (or `provideSmartPresets()` registers the preset), renders the injected component via `NgComponentOutlet` and forwards its inputs, its projected content, the `actionClick` and `closed` outputs and the `open` model changes. A footer action **keeps the modal open**: set `open` to `false` in the `(actionClick)` handler.

### ModalStandardComponent (`<smart-modal-standard>`)

Barebones placeholder concrete implementation. Renders a native `<dialog [open] role="dialog" aria-modal="true">` containing an optional `<h2 id="smart-modal-title">`, an optional `<p>` description, an `<ng-content>` slot for arbitrary body content, an optional dismiss `<button>` (when `options.withDismiss` is `true`), and a `<footer>` with one `<button data-variant>` per action. The dialog carries `options.variant` as `data-variant`. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token — except for the `bottom-sheet` variant, which it docks to the bottom of the viewport (see the Variants table).

### ModalPresetComponent (`<smart-modal-preset>`)

Styled variation that extends `ModalBaseComponent` and is a drop-in replacement for `ModalStandardComponent`. Register it via `MODAL_STANDARD_COMPONENT_TOKEN` (or with `provideSmartPresets()`) to restyle every `<smart-modal>`, or use the `<smart-modal-preset>` selector directly. It renders a translated Preline overlay — a full-screen scrollable backdrop hosting a `rounded-xl` card with a header (`title` + optional dismiss `×`), a body (`description` + projected content), and a footer of action buttons. The look is selected through `options.variant` (default `'centered'`): `centered`/`alert` are vertically centered (`alert` is narrower), `wide` is a top-aligned large dialog, `left-aligned-buttons` left-aligns the footer, and `bottom-sheet` docks the card to the bottom of the viewport (see the Variants table). `options.footerStyle: 'gray'` tints the footer, and action buttons are styled by their `variant` (`primary`/`secondary`/`danger`). All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal to the preset (not exported).

> **Preline JS is NOT used.** Open/close is driven entirely by the existing `open` model signal + `@if` (no `HSOverlay`, no `data-hs-*`). The component binds its own dismiss UX: clicking the backdrop and pressing `Escape` both call `close()` (which sets `open` to `false` and emits `closed`). With preset modals stacked (a modal opened from a modal), `Escape` closes only the one on top. The dialog ARIA contract is preserved (`role="dialog"`, `aria-modal="true"`, `aria-labelledby` when `title` is set, else `aria-label` from `options.ariaLabel`). The header dismiss `×` button is only shown when `options.withDismiss` is `true`.
>
> `ModalPresetComponent` declares `cssClass` without the `class` alias (applied to the centering wrapper): bind it as `[cssClass]` on the `<smart-modal-preset>` selector, or pass `class` on `<smart-modal>` (the wrapper forwards it).

### ModalBaseComponent (abstract)

Abstract base directive for extending custom modal implementations. Exposes `open` as a two-way `ModelSignal<boolean>`, `title` / `description` as optional `InputSignal<string | undefined>`, `actions` as `InputSignal<IModalAction[]>` (default `[]`), `options` as `InputSignal<IModalOptions | undefined>`, `cssClass` as `InputSignal<string>` (with alias `class`), `actionClick` (payload `IModalActionClick`, exported from `@smartsoft001/angular`) and `closed` outputs, plus `invokeAction(actionId)` (emits `actionClick`) and `close()` (sets `open` to `false` and emits `closed`).

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

| Output        | Payload                                      | Description                               |
| ------------- | -------------------------------------------- | ----------------------------------------- |
| `actionClick` | `IModalActionClick` (`{ actionId: string }`) | Fired when a footer action is clicked     |
| `closed`      | `void`                                       | Fired when the dialog is dismissed/closed |

### IModalAction

| Field     | Type                                   | Default     | Description                                                                                  |
| --------- | -------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `id`      | `string`                               | required    | Reported as `actionId` by `actionClick`.                                                     |
| `label`   | `string`                               | required    | Button text.                                                                                 |
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | The standard exposes it as `data-variant` on the button; the preset styles the button by it. |

```typescript
interface IModalAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### IModalOptions

| Field         | Type                  | Default      | Description                                                                                                                                                         |
| ------------- | --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`     | `SmartModalVariant`   | `'centered'` | The layout, one of the variants in the Variants table. The preset styles each of them; the standard exposes it as `data-variant` and positions only `bottom-sheet`. |
| `withDismiss` | `boolean`             | `false`      | Renders a close (×) button that calls `close()`.                                                                                                                    |
| `footerStyle` | `'default' \| 'gray'` | `'default'`  | Preset only: `gray` gives the footer a gray background.                                                                                                             |
| `ariaLabel`   | `string`              | -            | The `aria-label` of the dialog when there is no `title`.                                                                                                            |

```typescript
interface IModalOptions {
  variant?:
    'centered' | 'wide' | 'alert' | 'left-aligned-buttons' | 'bottom-sheet';
  withDismiss?: boolean;
  footerStyle?: 'default' | 'gray';
  ariaLabel?: string;
}
```

The default `ModalStandardComponent` consumes `withDismiss` and `ariaLabel`, exposes `variant` as `data-variant` on the dialog and positions the `bottom-sheet` variant; `footerStyle` is read by `ModalPresetComponent` only. A custom implementation receives every field.

### Variants

`SmartModalVariant` (from `@smartsoft001/angular`) names the layouts of `options.variant`.

| Variant                | `ModalPresetComponent`                                                                                                                                                                                                                                                  | `ModalStandardComponent`                                                                                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `centered` (default)   | A card centred vertically, `max-w-lg` from `sm`.                                                                                                                                                                                                                        | The browser's dialog layout.                                                                                                                                               |
| `wide`                 | A top-aligned card, `max-w-4xl` from `lg`.                                                                                                                                                                                                                              | The browser's dialog layout.                                                                                                                                               |
| `alert`                | A narrower centred card, `max-w-md` from `sm`.                                                                                                                                                                                                                          | The browser's dialog layout.                                                                                                                                               |
| `left-aligned-buttons` | Like `centered`, with the footer buttons aligned to the left.                                                                                                                                                                                                           | The browser's dialog layout.                                                                                                                                               |
| `bottom-sheet`         | A sheet docked to the bottom of the viewport: full width, centred under `max-w-2xl` with rounded top corners from `sm`, at most 85% of the viewport high with the body scrolling, padded by the bottom safe area. Same backdrop, Escape and close button as the others. | The `<dialog>` fixed to the bottom of the viewport (`z-[80]`), full width, `max-w-2xl` with rounded top corners from `sm`, at most 85% of the viewport high and scrolling. |

## MODAL_STANDARD_COMPONENT_TOKEN

InjectionToken from `@smartsoft001/angular` that allows replacing the default `ModalStandardComponent` with a custom implementation. Provide a `Type<ModalBaseComponent>` in your application or component providers; `provideSmartPresets()` provides `ModalPresetComponent` for it together with every other preset.

```typescript
import { MODAL_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: MODAL_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomModalComponent,
  },
];
```

## Content projection

`ModalStandardComponent` accepts arbitrary body content via `<ng-content>` and the wrapper forwards its own `<ng-content>` into the standard. When a custom component is registered via the token, the wrapper passes the same content to the custom component's default `<ng-content>` slot (`ModalPresetComponent` renders it in its body), wrapped in one `display: contents` element: selectors on the slot's parent that target its direct children (`space-y-*`, `divide-*`, `> *`) do not reach the projected nodes.

## Extending the Base Class

```typescript
import {
  ChangeDetectionStrategy,
  Component,
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
      <ng-content />
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
export class MyCustomModalComponent extends ModalBaseComponent {}
```

The inherited `cssClass` (input alias `class`) receives the class passed to `<smart-modal>`. When extending the base directly, remember to:

- call `invokeAction(id)` to emit `actionClick`, and `close()` to emit `closed` and set `open.set(false)`,
- implement `Escape` key handling and backdrop click yourself if you want native UX — the base does not bind any keyboard or backdrop listeners,
- lay out `options()?.variant === 'bottom-sheet'` as a bottom sheet: `ModalService` opens `mode: 'bottom'` with that variant.

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

## Opening a component in a modal from code

`ModalService.show(options)` (provided by `SharedServicesModule`) creates `options.component` inside a `<smart-modal>` at the end of `<body>` and resolves with an `IModal`. The modal is the implementation registered for `MODAL_STANDARD_COMPONENT_TOKEN` (the preset with `provideSmartPresets()`) and shows its close button (`withDismiss`). `props` become the component's inputs (keys it does not declare as inputs are left out), and a component that declares a `dismiss` input gets the function that closes its modal. A component can also inject `ModalService` and call `dismiss(data)`: it resolves to the service that opened it. The modals stack; `ModalService.dismiss(data)` closes the one opened last. Closing a modal restores the focus to the element focused before it opened.

| Option            | Type                    | Default     | Description                                                                                                                                                                                                        |
| ----------------- | ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `component`       | `any`                   | required    | The component rendered in the modal.                                                                                                                                                                               |
| `props`           | `any`                   | -           | Its inputs, by input name.                                                                                                                                                                                         |
| `mode`            | `'default' \| 'bottom'` | `'default'` | `'bottom'` opens the modal as a bottom sheet (the `bottom-sheet` variant, see the Variants table) and adds the `smart-modal-bottom` class for an application's own styling; the modal element carries `data-mode`. |
| `cssClass`        | `string[]`              | -           | Classes passed to the modal as `class`.                                                                                                                                                                            |
| `backdropDismiss` | `boolean`               | `true`      | `false` keeps the modal open on a click on its backdrop and on Escape; its close button and `dismiss()` still close it.                                                                                            |
| `injector`        | `Injector`              | -           | The injector the component resolves its dependencies from (e.g. the opener's `inject(Injector)`), the service's otherwise.                                                                                         |

| `IModal` member  | Type                           | Description                                                                                                                         |
| ---------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `dismiss(data?)` | `(data?: any) => void`         | Closes the modal.                                                                                                                   |
| `onDidDismiss()` | `() => Promise<{ data: any }>` | Resolves once the modal is closed, with the data it was closed with; `{ data: null }` for its close button, the backdrop or Escape. |

```typescript
import { Component, inject, input } from '@angular/core';

import { ModalService } from '@smartsoft001/angular';

@Component({
  selector: 'app-rename-form',
  template: `
    <input #name [value]="name()" />
    <button type="button" (click)="dismiss()?.(name.value)">Save</button>
  `,
})
export class RenameFormComponent {
  name = input('');
  dismiss = input<(data?: unknown) => void>();
}

export class RenameAction {
  private modalService = inject(ModalService);

  async rename(name: string): Promise<string | null> {
    const modal = await this.modalService.show({
      component: RenameFormComponent,
      props: { name },
    });
    const { data } = await modal.onDidDismiss();

    return typeof data === 'string' ? data : null;
  }
}
```

`[smartDetails]` and `DetailsPage` (see `angular-components-details`) open details through the same service, as a bottom sheet by default; so does the `details` option of `<smart-list>`.

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/modal/modal.component.ts`
- Standard: `packages/shared/angular/src/lib/components/modal/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/modal/preset/preset.component.ts`
- Preset class recipes (internal, not exported): `packages/shared/angular/src/lib/components/modal/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/modal/base/base.component.ts`
- Stories: `packages/shared/angular/src/lib/components/modal/modal.component.stories.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`MODAL_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`IModalAction`, `IModalOptions`, `SmartModalVariant`)
- Service: `packages/shared/angular/src/lib/services/modal/modal.service.ts` (`ModalService`, `IModalServiceOptions`, `IModal`)
