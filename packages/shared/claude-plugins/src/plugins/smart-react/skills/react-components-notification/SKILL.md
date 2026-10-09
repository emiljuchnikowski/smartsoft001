---
name: react-components-notification
description: SmartNotification React component API (@smartsoft001/react) — toast-style notification with title, description, icon or avatar, action buttons and a close button (onDismissed, onActionClick), six preset variants, ToastService for toasts from code, the 'notification' registry key, SmartNotificationPreset and useNotification.
user-invocable: false
---

# Notification (`SmartNotification`)

`SmartNotification` renders one notification panel: a `title`, an optional `description`, an icon glyph or avatar, action buttons (`actions`, reported through `onActionClick({ actionId })`) and a close button (`dismissible`, reported through `onDismissed`). It has **no open state**: render it while it should be visible and remove it on `onDismissed`. The toasts of `useToastService().info(...)` / `.error(...)` are rendered by the toast host of `SmartProvider` through this component, so registering a notification implementation restyles them too.

## When to Use This Skill

- Showing a transient message ("Saved", "Upload failed") in a corner of the screen
- A notification with actions (Undo, View) or an avatar (`with-avatar` preset variant)
- Showing toasts from code with `ToastService` (see below)
- Restyling every notification and toast (the `notification` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                      | Kind      | What it is                                                                                                                         |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `SmartNotification`         | component | Renders the implementation registered as `components.notification` on `SmartProvider`, `SmartNotificationStandard` by default.     |
| `SmartNotificationPreset`   | component | Styled notification (toast) variation (preset).                                                                                    |
| `SmartNotificationStandard` | component | The default notification rendering.                                                                                                |
| `useNotification`           | hook      | The behaviour every notification variant shares: `dismiss()` reports `onDismissed` and `invokeAction(id)` reports `onActionClick`. |

The preset's class helpers (`getNotificationContainerClasses`, `getNotificationTitleClasses`, `getNotificationMessageClasses`, `getNotificationDescriptionClasses`, `getNotificationIconClasses`, `getNotificationAvatarClasses`, `getNotificationCloseClasses`, `getNotificationActionsRowClasses`, `getNotificationActionClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartNotificationProps`

| Prop             | Type                                        | Default  | Description                                                            |
| ---------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `title`          | `string`                                    | required | The main line.                                                         |
| `description?`   | `string`                                    | —        | A second line.                                                         |
| `iconName?`      | `string`                                    | —        | A glyph (text, e.g. an emoji) shown before the text by the preset.     |
| `avatarUrl?`     | `string`                                    | —        | Image shown by the preset `with-avatar` variant.                       |
| `actions?`       | `INotificationAction[]`                     | `[]`     | Action buttons (not rendered by the preset's `simple` variant).        |
| `dismissible?`   | `boolean`                                   | `false`  | Shows the close button, which reports `onDismissed`.                   |
| `options?`       | `INotificationOptions`                      | —        | Variant and live-region politeness.                                    |
| `className?`     | `string`                                    | —        | Classes on the root element.                                           |
| `onDismissed?`   | `() => void`                                | —        | Called when the close button is clicked; remove the notification here. |
| `onActionClick?` | `(value: INotificationActionClick) => void` | —        | Called with the id of the clicked action.                              |

### `INotificationOptions`

| Field       | Type                       | Default    | Description                                                                                                          |
| ----------- | -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `variant?`  | `SmartNotificationVariant` | `'simple'` | Preset look: `simple`, `condensed`, `with-actions-below`, `with-avatar`, `with-split-buttons`, `with-buttons-below`. |
| `ariaLive?` | `'polite' \| 'assertive'`  | `'polite'` | `assertive` for errors.                                                                                              |

### `INotificationActionClick`

Payload of `onActionClick`.

| Field      | Type     | Default  | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action. |

### `INotificationAction`

| Field      | Type                       | Default    | Description                    |
| ---------- | -------------------------- | ---------- | ------------------------------ |
| `id`       | `string`                   | required   | Reported as `actionId`.        |
| `label`    | `string`                   | required   | Button text.                   |
| `variant?` | `'primary' \| 'secondary'` | `'simple'` | `primary` or `secondary` look. |

### Related types

- `SmartNotificationVariant`: `'simple' \| 'condensed' \| 'with-actions-below' \| 'with-avatar' \| 'with-split-buttons' \| 'with-buttons-below'`

## Toasts from code

`ToastService` keeps a queue of toasts that the toast host of `SmartProvider` (`SmartToastHost`, part of `SmartOverlays`) renders at the bottom of the screen through `SmartNotification`. A toast closes itself after `duration` ms (2000 by default) or on its close button.

```tsx
import { SmartButton, useToastService } from '@smartsoft001/react';

export function SaveButton({ save }: { save: () => Promise<void> }) {
  const toasts = useToastService();

  const run = async () => {
    try {
      await save();
      await toasts.info({ message: 'Saved' });
    } catch {
      await toasts.error({
        title: 'Saving failed',
        message: 'Try again in a moment.',
        duration: 5000,
      });
    }
  };

  return <SmartButton options={{ click: () => void run() }}>Save</SmartButton>;
}
```

See `react-components-overlays` for the hosts and the full `IToastOptions` (buttons, durations, the error lock).

## Usage

```tsx
import { useState } from 'react';

import {
  SmartNotification,
  SmartNotificationPreset,
} from '@smartsoft001/react';

export function UndoNotice({ onUndo }: { onUndo: () => void }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2">
      <SmartNotificationPreset
        title="Note archived"
        description="You can restore it within 30 days."
        iconName="📦"
        dismissible
        actions={[{ id: 'undo', label: 'Undo', variant: 'primary' }]}
        options={{ variant: 'condensed' }}
        onActionClick={({ actionId }) => {
          if (actionId === 'undo') onUndo();
          setVisible(false);
        }}
        onDismissed={() => setVisible(false)}
      />
      <SmartNotification title="Synced" options={{ ariaLive: 'polite' }} />
    </div>
  );
}
```

## Replacing the Implementation

`SmartNotification` renders the component registered under the `'notification'` key of `SmartProvider`'s `components`, and `SmartNotificationStandard` when nothing is registered there. Every `SmartNotification` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartNotificationPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { notification: SmartNotificationPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartNotificationPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartNotification`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useNotification` hook

The behaviour every notification variant shares: `dismiss()` reports `onDismissed` and `invokeAction(id)` reports `onActionClick`. The notification does not hide itself; its owner removes it.

```ts
function useNotification({
  onDismissed,
  onActionClick,
}: SmartNotificationProps);
```

| Returns        | Type                                      | Description                            |
| -------------- | ----------------------------------------- | -------------------------------------- |
| `dismiss`      | `() => void \| undefined`                 | Reports `onDismissed`.                 |
| `invokeAction` | `(actionId: string) => void \| undefined` | Reports `onActionClick({ actionId })`. |

```tsx
import { SmartNotificationProps, useNotification } from '@smartsoft001/react';

export function BannerNotification(props: SmartNotificationProps) {
  const { dismiss, invokeAction } = useNotification(props);

  return (
    <div
      role="status"
      aria-live={props.options?.ariaLive ?? 'polite'}
      className={props.className}
    >
      <strong>{props.title}</strong>
      {props.description && <span> {props.description}</span>}
      {props.actions?.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => invokeAction(action.id)}
        >
          {action.label}
        </button>
      ))}
      {props.dismissible && (
        <button type="button" aria-label="Close" onClick={dismiss}>
          ×
        </button>
      )}
    </div>
  );
}
```

Registered as `components={{ notification: BannerNotification }}`, it also renders the toasts of `ToastService`.

## Styling

- Both renderings carry `smart:dark:` variants; the preset renders the six toast looks and labels itself with a `useId()`-based id.

## File Locations

Source: `packages/shared/react/src/lib/components/notification/` in the smartsoft001 repository.

- `notification.tsx`: `SmartNotification`
- `notification.types.ts`: `INotificationActionClick`, `SmartNotificationProps`
- `preset/notification-preset.tsx`: `SmartNotificationPreset`
- `standard/notification-standard.tsx`: `SmartNotificationStandard`
- `use-notification.ts`: `useNotification`
- `notification.stories.tsx`: Storybook stories
