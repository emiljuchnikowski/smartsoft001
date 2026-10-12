---
name: angular-components-notification
description: Notification component API with InjectionToken pattern for custom implementations, and ToastService for showing toasts from code.
user-invocable: false
---

# Notification Component

The `<smart-notification>` component displays a transient or persistent message — title, optional description, optional icon/avatar, optional dismiss control, and zero or more action buttons. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `NotificationBaseComponent` defines the shared API — `title` (required), `description`, `iconName`, `avatarUrl`, `actions`, `dismissible`, `options`, `cssClass` (alias `class`), plus `dismissed` and `actionClick` outputs and the `dismiss()` / `invokeAction()` helper methods. `NotificationStandardComponent` is a barebones placeholder concrete implementation. `NotificationComponent` is the public wrapper that renders `NotificationStandardComponent` by default and accepts a custom replacement via `NOTIFICATION_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the notification component
- Developer asks about `<smart-notification>`, `NotificationComponent`, `NotificationStandardComponent`, or `NotificationBaseComponent`
- Developer wants to show a toast from code (`ToastService`), or toasts and `ErrorService` errors do not appear

## Components

### NotificationComponent (`<smart-notification>`)

Main wrapper component. Renders `NotificationStandardComponent` by default. When `NOTIFICATION_STANDARD_COMPONENT_TOKEN` is provided (or `provideSmartPresets()` registers the preset), renders the injected component via `NgComponentOutlet`, forwarding its inputs and re-emitting its `dismissed` and `actionClick` outputs. It has no open state: render it while the notification should be visible and remove it on `(dismissed)`.

### NotificationStandardComponent (`<smart-notification-standard>`)

Barebones placeholder concrete implementation. Renders a `<div role="status">` with `aria-live` (defaulting to `polite`, overridable via `options.ariaLive`), an `<h3>` for the title, an optional `<p>` for the description, an optional close button when `dismissible` is `true`, and one `<button>` per action with a `data-variant` attribute. It does not render `iconName` or `avatarUrl`. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### NotificationPresetComponent (`<smart-notification-preset>`)

Styled toast variation that extends `NotificationBaseComponent` and is a drop-in replacement for `NotificationStandardComponent`. Register it via `NOTIFICATION_STANDARD_COMPONENT_TOKEN` (or with `provideSmartPresets()`) to restyle every `<smart-notification>`, or use the `<smart-notification-preset>` selector directly. It renders the translated Preline toast looks as a card (`bg-white`/`dark:bg-gray-800`, border, `rounded-xl`, `shadow-lg`), with the layout selected through `options.variant` (default `'simple'`):

- `simple` — leading icon glyph (when `iconName` is set) plus the `title` message and optional `description`; it does **not** render `actions`.
- `condensed` — inline single-row `title` with the action links and close button pushed to the end (`ms-auto`); no description or icon.
- `with-actions-below` / `with-avatar` — icon (or avatar image for `with-avatar`) + heading + description, with text-link styled actions below; the close button is absolutely positioned.
- `with-buttons-below` / `with-split-buttons` — same layout but actions render as solid/bordered buttons (per `action.variant`); `with-split-buttons` makes each button `grow` to fill the row.

`dismissible` renders a close button that calls `dismiss()`; each action calls `invokeAction(action.id)`. Open/close visibility is Angular-driven via the `dismissed` output — no Preline JS runtime is used. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants; the class recipes are internal to the preset (not exported).

> `NotificationPresetComponent` declares `cssClass` without the `class` alias: bind it as `[cssClass]` on the `<smart-notification-preset>` selector, or pass `class` on `<smart-notification>` (the wrapper forwards it).

### NotificationBaseComponent (abstract)

Abstract base directive for extending custom notification implementations. Exposes the inputs/outputs listed below and provides `dismiss()` (emits `dismissed`) and `invokeAction(actionId)` (emits `actionClick` with an `INotificationActionClick` payload `{ actionId }`, exported from `@smartsoft001/angular`) helper methods.

## API

### Inputs

| Input         | Type                                             | Default | Description                                                                                                 |
| ------------- | ------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------- |
| `title`       | `InputSignal<string>` (required)                 | -       | Headline text                                                                                               |
| `description` | `InputSignal<string \| undefined>`               | -       | Optional supporting text                                                                                    |
| `iconName`    | `InputSignal<string \| undefined>`               | -       | Preset only: a glyph (text, e.g. an emoji) before the text (not in the `condensed` and `with-avatar` looks) |
| `avatarUrl`   | `InputSignal<string \| undefined>`               | -       | Preset only: the image of the `with-avatar` look                                                            |
| `actions`     | `InputSignal<INotificationAction[]>`             | `[]`    | Action buttons (not rendered by the preset's `simple` look)                                                 |
| `dismissible` | `InputSignal<boolean>`                           | `false` | When `true`, renders a close button                                                                         |
| `options`     | `InputSignal<INotificationOptions \| undefined>` | -       | Optional configuration (variant, ariaLive)                                                                  |
| `class`       | `InputSignal<string>`                            | `''`    | External CSS classes (alias for `cssClass`)                                                                 |

### Outputs

| Output        | Payload                                             | Description                              |
| ------------- | --------------------------------------------------- | ---------------------------------------- |
| `dismissed`   | `void`                                              | Emitted when the user dismisses          |
| `actionClick` | `INotificationActionClick` (`{ actionId: string }`) | Emitted when an action button is clicked |

### INotificationAction

| Field     | Type                       | Default     | Description                                                                    |
| --------- | -------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `id`      | `string`                   | required    | Echoed back as `actionId` in the `actionClick` payload.                        |
| `label`   | `string`                   | required    | Button text.                                                                   |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | The standard exposes it as `data-variant`; the preset styles the action by it. |

```typescript
interface INotificationAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary';
}
```

### INotificationOptions

| Field      | Type                       | Default    | Description                                                                                                                           |
| ---------- | -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`  | `SmartNotificationVariant` | `'simple'` | Preset only: the toast look (`simple`, `condensed`, `with-actions-below`, `with-avatar`, `with-split-buttons`, `with-buttons-below`). |
| `ariaLive` | `'polite' \| 'assertive'`  | `'polite'` | The `aria-live` of the `role="status"` container; `assertive` for errors.                                                             |

```typescript
type SmartNotificationVariant =
  | 'simple'
  | 'condensed'
  | 'with-actions-below'
  | 'with-avatar'
  | 'with-split-buttons'
  | 'with-buttons-below';

interface INotificationOptions {
  variant?: SmartNotificationVariant;
  ariaLive?: 'polite' | 'assertive';
}
```

## NOTIFICATION_STANDARD_COMPONENT_TOKEN

InjectionToken from `@smartsoft001/angular` that allows replacing the default `NotificationStandardComponent` with a custom implementation. Provide a `Type<NotificationBaseComponent>` in your application or component providers; `provideSmartPresets()` provides `NotificationPresetComponent` for it together with every other preset.

```typescript
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';

providers: [
  {
    provide: NOTIFICATION_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomNotificationComponent,
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

import { NotificationBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-notification',
  template: `
    <section
      role="status"
      [attr.aria-live]="options()?.ariaLive ?? 'polite'"
      [class]="containerClasses()"
    >
      @if (avatarUrl()) {
        <img [src]="avatarUrl()" alt="" />
      }
      <div>
        <h3>{{ title() }}</h3>
        @if (description()) {
          <p>{{ description() }}</p>
        }
        @for (action of actions(); track action.id) {
          <button
            type="button"
            [attr.data-variant]="action.variant ?? 'primary'"
            (click)="invokeAction(action.id)"
          >
            {{ action.label }}
          </button>
        }
      </div>
      @if (dismissible()) {
        <button type="button" aria-label="Close" (click)="dismiss()">
          &times;
        </button>
      }
    </section>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyCustomNotificationComponent extends NotificationBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-notification-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

The inherited `cssClass` (input alias `class`) receives the class passed to `<smart-notification>`, and the wrapper re-emits the outputs. When extending the base directly, remember to:

- call `this.dismiss()` from your close handler — it already emits the `dismissed` output,
- call `this.invokeAction(action.id)` from each action button — it already emits the `actionClick` output with `{ actionId }`.

## Accessibility

- The container uses `role="status"` so assistive technologies announce it as a live region.
- `aria-live` defaults to `'polite'` (announced after the user finishes their current task) and can be raised to `'assertive'` via `options.ariaLive` for time-critical messages.
- The dismiss button carries `aria-label="Close"` since its visible content is the `×` glyph.
- Custom implementations should preserve `role="status"` and `aria-live` to keep this contract.

## Toasts from code

`ToastService` (provided by `SharedServicesModule`) shows short messages at the bottom of the screen. While it has toasts it mounts one host at the end of `<body>`: a stack fixed to the bottom of the viewport (centred, right-aligned from `sm`, above the modals), every toast rendered through `<smart-notification>`. The implementation registered for `NOTIFICATION_STANDARD_COMPONENT_TOKEN` (the preset with `provideSmartPresets()`) therefore restyles the toasts too; the standard one renders them unstyled. A toast shows its `title` as the heading with the `message` under it, or the `message` alone, and its `buttons` as the notification's actions. It closes itself after `duration` ms, on its close button, or once the handler of one of its buttons ran. `ErrorService.log(error)` and the file inputs report their errors through it.

| Member                                         | What it does                                                                                                                                                                                          |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `info(options: IToastOptions): Promise<void>`  | Shows an info toast, announced politely (`aria-live="polite"`).                                                                                                                                       |
| `error(options: IToastOptions): Promise<void>` | Shows an error toast, announced assertively (`aria-live="assertive"`), unless an error lock is held.                                                                                                  |
| `dismiss(id: number): void`                    | Closes a toast.                                                                                                                                                                                       |
| `addLockError()` / `removeLockError()`         | Holds / releases an error lock, counted in the static `ToastService.lockError` (never below zero). While a lock is held, error toasts are swallowed, e.g. during a sign-out that makes requests fail. |
| `toasts: Signal<IToast[]>`                     | The toasts shown, oldest first (`IToast` adds `id` and `type: 'error' \| 'info'` to the options).                                                                                                     |

| `IToastOptions` field | Type             | Default  | Description                                                                                                                                                             |
| --------------------- | ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`               | `string`         | -        | The heading; the message goes under it.                                                                                                                                 |
| `message`             | `string`         | required | The text; the heading when there is no title.                                                                                                                           |
| `duration`            | `number`         | `2000`   | Milliseconds before the toast closes itself; a missing, zero or negative value means 2000.                                                                              |
| `buttons`             | `IToastButton[]` | -        | `{ text, position: 'start' \| 'end', handler }`: a click runs `handler`, then closes the toast. `position` is kept for compatibility; the actions keep the given order. |

A toast without buttons renders in the `simple` notification variant, a message with buttons in `condensed`, and a title with a message and buttons in `with-actions-below`, which keeps the message under the title.

```typescript
import { inject, Injectable } from '@angular/core';

import { ToastService } from '@smartsoft001/angular';

@Injectable()
export class SaveAction {
  private toastService = inject(ToastService);

  async run(save: () => Promise<void>, undo: () => void): Promise<void> {
    try {
      await save();
      await this.toastService.info({
        message: 'Saved',
        buttons: [{ text: 'Undo', position: 'end', handler: undo }],
      });
    } catch {
      await this.toastService.error({
        title: 'Saving failed',
        message: 'Try again in a moment.',
        duration: 5000,
      });
    }
  }
}
```

## Usage Examples

```html
<!-- Basic -->
<smart-notification title="Saved" />

<!-- With description -->
<smart-notification title="Saved" description="Your changes are live." />

<!-- Dismissible -->
<smart-notification
  title="Heads up"
  [dismissible]="true"
  (dismissed)="onDismissed()"
/>

<!-- With actions -->
<smart-notification
  title="Update available"
  description="Reload to apply the latest version."
  [actions]="[
    { id: 'reload', label: 'Reload', variant: 'primary' },
    { id: 'later', label: 'Later', variant: 'secondary' },
  ]"
  (actionClick)="onAction($event)"
/>

<!-- Assertive announcement -->
<smart-notification
  title="Connection lost"
  [options]="{ ariaLive: 'assertive' }"
/>

<!-- With external class -->
<smart-notification title="Saved" class="smart:my-2" />
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/notification/notification.component.ts`
- Standard: `packages/shared/angular/src/lib/components/notification/standard/standard.component.ts`
- Preset variation: `packages/shared/angular/src/lib/components/notification/preset/preset.component.ts`
- Preset class recipes (internal, not exported): `packages/shared/angular/src/lib/components/notification/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/notification/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`NOTIFICATION_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`INotificationAction`, `INotificationOptions`, `SmartNotificationVariant`)
- Toasts: `packages/shared/angular/src/lib/services/toast/toast.service.ts` (`ToastService`, `IToastOptions`, `IToastButton`, `IToast`) and its host `toast-host.component.ts`
