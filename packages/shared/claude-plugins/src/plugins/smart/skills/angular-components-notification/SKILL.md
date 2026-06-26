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

Main wrapper component. Renders `NotificationStandardComponent` by default. When `NOTIFICATION_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### NotificationStandardComponent (`<smart-notification-standard>`)

Barebones placeholder concrete implementation. Renders a `<div role="status">` with `aria-live` (defaulting to `polite`, overridable via `options.ariaLive`), an `<h3>` for the title, an optional `<p>` for the description, an optional close button when `dismissible` is `true`, and one `<button>` per action with a `data-variant` attribute. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token.

### NotificationPresetComponent (`<smart-notification-preset>`)

Styled toast variation that extends `NotificationBaseComponent` and is a drop-in replacement for `NotificationStandardComponent`. Register it via `NOTIFICATION_STANDARD_COMPONENT_TOKEN` to restyle every `<smart-notification>`, or use the `<smart-notification-preset>` selector directly. It renders the translated Preline toast looks as a card (`bg-white`/`dark:bg-gray-800`, border, `rounded-xl`, `shadow-lg`), with the layout selected through `options.variant` (default `'simple'`):

- `simple` — leading icon glyph (when `iconName` is set) plus the `title` message and optional `description`.
- `condensed` — inline single-row message with the action links and close button pushed to the end (`ms-auto`).
- `with-actions-below` / `with-avatar` — icon (or avatar image for `with-avatar`) + heading + description, with text-link styled actions below; the close button is absolutely positioned.
- `with-buttons-below` / `with-split-buttons` — same layout but actions render as solid/bordered buttons (per `action.variant`); `with-split-buttons` makes each button `grow` to fill the row.

`dismissible` renders a close button that calls `dismiss()`; each action calls `invokeAction(action.id)`. Open/close visibility is Angular-driven via the `dismissed` output — no Preline JS runtime is used. All classes are `smart:`-prefixed Tailwind with explicit `dark:` variants. The class recipes live in `preset/preset-classes.util.ts` (kept out of the public barrel; e.g. `getNotificationContainerClasses`, `getNotificationActionClasses`).

> Because `NotificationComponent` renders injected components via `NgComponentOutlet` (which passes inputs by canonical name), `NotificationPresetComponent` overrides `cssClass` as `input<string>('')` **without** the `class` alias. Bind it as `[cssClass]` when using the `<smart-notification-preset>` selector directly, or just pass `class` on `<smart-notification>` (the wrapper forwards it).

### NotificationBaseComponent (abstract)

Abstract base directive for extending custom notification implementations. Exposes the inputs/outputs listed below and provides `dismiss()` (emits `dismissed`) and `invokeAction(actionId)` (emits `actionClick` with `{ actionId }`) helper methods.

## API

### Inputs

| Input         | Type                                             | Default | Description                                 |
| ------------- | ------------------------------------------------ | ------- | ------------------------------------------- |
| `title`       | `InputSignal<string>` (required)                 | -       | Headline text                               |
| `description` | `InputSignal<string \| undefined>`               | -       | Optional supporting text                    |
| `iconName`    | `InputSignal<string \| undefined>`               | -       | Optional leading icon name                  |
| `avatarUrl`   | `InputSignal<string \| undefined>`               | -       | Optional avatar image URL                   |
| `actions`     | `InputSignal<INotificationAction[]>`             | `[]`    | Action buttons to render                    |
| `dismissible` | `InputSignal<boolean>`                           | `false` | When `true`, renders a close button         |
| `options`     | `InputSignal<INotificationOptions \| undefined>` | -       | Optional configuration (variant, ariaLive)  |
| `class`       | `InputSignal<string>`                            | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output        | Payload                | Description                              |
| ------------- | ---------------------- | ---------------------------------------- |
| `dismissed`   | `void`                 | Emitted when the user dismisses          |
| `actionClick` | `{ actionId: string }` | Emitted when an action button is clicked |

### INotificationAction

```typescript
interface INotificationAction {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary';
}
```

`id` is echoed back in the `actionClick` payload so the host can route handling. `variant` controls the placeholder's `data-variant` attribute and is intended as a styling hook for custom implementations.

### INotificationOptions

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

The standard component only consumes `ariaLive` (placeholder behavior — applied directly as the `aria-live` attribute on the `role="status"` container; defaults to `'polite'`). The `variant` property is ignored by `NotificationStandardComponent` but **fully consumed by `NotificationPresetComponent`** (default `'simple'`) to pick the toast layout.

## NOTIFICATION_STANDARD_COMPONENT_TOKEN

```typescript
import { NOTIFICATION_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `NotificationStandardComponent` with a custom implementation. Provide a `Type<NotificationBaseComponent>` to override.

```typescript
// In your app module or component providers:
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
  input,
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
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

  containerClasses = computed(() => {
    const classes = ['my-notification-container'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
```

When extending the base directly, remember to:

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `NOTIFICATION_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
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
- Preset class recipes: `packages/shared/angular/src/lib/components/notification/preset/preset-classes.util.ts`
- Base class: `packages/shared/angular/src/lib/components/notification/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`NOTIFICATION_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`INotificationAction`, `INotificationOptions`, `SmartNotificationVariant`)
