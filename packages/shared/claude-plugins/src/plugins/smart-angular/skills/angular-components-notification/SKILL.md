---
name: angular-components-notification
description: Notification component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Notification Component

The `<smart-notification>` component displays a transient or persistent message — title, optional description, optional icon/avatar, optional dismiss control, and zero or more action buttons. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `NotificationBaseComponent` defines the shared API — `title` (required), `description`, `iconName`, `avatarUrl`, `actions`, `dismissible`, `options`, `cssClass` (alias `class`), plus `dismissed` and `actionClick` outputs and the `dismiss()` / `invokeAction()` helper methods. `NotificationStandardComponent` is a barebones placeholder concrete implementation. `NotificationComponent` is the public wrapper that renders `NotificationStandardComponent` by default and accepts a custom replacement via `NOTIFICATION_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the notification component
- Developer asks about `<smart-notification>`, `NotificationComponent`, `NotificationStandardComponent`, or `NotificationBaseComponent`

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
