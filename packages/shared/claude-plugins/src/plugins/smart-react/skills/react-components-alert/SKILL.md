---
name: react-components-alert
description: SmartAlert React component API (@smartsoft001/react) — modal alert dialog with header, message and buttons (IAlertOptions/IAlertButton), onDismissed, AlertService.show() for confirm dialogs from code, the 'alert' registry key and the useAlert hook.
user-invocable: false
---

# Alert (`SmartAlert`)

`SmartAlert` is a modal alert dialog (`role="alertdialog"`): a header, an optional sub-header and message, and a row of buttons. It focuses its first button, keeps Tab inside the panel, and cancels on Escape or a click on the backdrop. Most applications do not place it by hand: `useAlertService().show(options)` opens one and resolves with the button the user chose, and the alert host that `SmartProvider` renders draws it through the same `alert` registry key.

## When to Use This Skill

- Asking the user to confirm or cancel an action ("Delete this note?") from code with `AlertService.show`
- Rendering an alert dialog in place, with `onDismissed`
- Running logic in a button `handler`, or keeping the dialog open by returning `false` from it
- Replacing the dialog application-wide (the `alert` key), building on `useAlert`

## Exports

All from `@smartsoft001/react`.

| Export                  | Kind      | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartAlert`            | component | Renders the implementation registered as `components.alert` on `SmartProvider`, `SmartAlertStandard` by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `SmartAlertStandard`    | component | The default alert dialog: a modal `alertdialog` on a full-screen backdrop, rendered where it is placed (the alert host of `SmartProvider` decides where that is).                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `useAlert`              | hook      | The behaviour every alert variant shares: the ids linking the dialog to its header and message, the buttons, and the ways to close it, all reported through `onDismissed`: - `invoke(button)` runs `button.handler` and dismisses with the button, unless the handler of a non-cancel button returned `false`; - `cancel()` / `onEscape()` dismiss with the cancel button (or `null`), without running its handler; - `onBackdropClick(event)` cancels on a click on the backdrop itself, unless `options.backdropDismiss === false`; - `trapFocus(event, panel)` keeps Tab / Shift+Tab on the panel's buttons. |
| `getAlertButtonClasses` | function  | Classes of an alert button by `role` (`cancel` -> secondary, `destructive` -> red, anything else -> primary), followed by its `cssClass`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Props and Types

### `SmartAlertProps`

| Prop           | Type                                     | Default  | Description                                                                                                                                                                                                                                                    |
| -------------- | ---------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `IAlertOptions`                          | required | Header, message and buttons of the dialog.                                                                                                                                                                                                                     |
| `className?`   | `string`                                 | —        | Classes of the dialog panel.                                                                                                                                                                                                                                   |
| `onDismissed?` | `(button: IAlertButton \| null) => void` | —        | Called with the button that closed the alert, after its handler ran, or the cancel button (`role: 'cancel'`, handler not run) / `null` on Escape and backdrop click. Not called when the handler of a non-cancel button returns `false`: the alert stays open. |

### `IAlertOptions`

| Field              | Type             | Default | Description                                                              |
| ------------------ | ---------------- | ------- | ------------------------------------------------------------------------ |
| `header?`          | `string`         | —       | The dialog title (linked through `aria-labelledby`).                     |
| `subHeader?`       | `string`         | —       | A smaller line under the header.                                         |
| `message?`         | `string`         | —       | The body text (linked through `aria-describedby`).                       |
| `backdropDismiss?` | `boolean`        | `true`  | Click on the backdrop cancels the alert.                                 |
| `buttons?`         | `IAlertButton[]` | `[]`    | The buttons, in order. Without buttons the dialog can only be cancelled. |

### `SmartAlertKeyEvent`

The part of a keyboard event `trapFocus` reads (DOM or React).

| Field            | Type         | Default  | Description                                        |
| ---------------- | ------------ | -------- | -------------------------------------------------- |
| `key`            | `string`     | required | The pressed key.                                   |
| `shiftKey`       | `boolean`    | required | Whether Shift is held (Shift+Tab moves backwards). |
| `preventDefault` | `() => void` | required | Stops the browser from moving the focus itself.    |

### `SmartAlertBackdropEvent`

The part of a mouse event `onBackdropClick` reads (DOM or React).

| Field           | Type                  | Default  | Description                                                          |
| --------------- | --------------------- | -------- | -------------------------------------------------------------------- |
| `target`        | `EventTarget \| null` | required | The clicked element.                                                 |
| `currentTarget` | `EventTarget \| null` | required | The backdrop element; the alert cancels only when both are the same. |

### `IAlertButton`

| Field       | Type                                                              | Default  | Description                                                                                                                    |
| ----------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `text`      | `string`                                                          | required | The label.                                                                                                                     |
| `role?`     | `'cancel' \| 'destructive' \| string`                             | —        | `'cancel'` marks the button Escape and the backdrop use (its handler is not run then); `'destructive'` styles it as dangerous. |
| `cssClass?` | `string \| string[]`                                              | —        | Extra classes of the button.                                                                                                   |
| `handler?`  | `(value?: unknown) => boolean \| void \| Record<string, unknown>` | —        | Runs on click. Returning `false` from the handler of a non-cancel button keeps the dialog open.                                |

## Opening an alert from code

`AlertService.show(options)` returns a promise of the chosen `IAlertButton` (or `null` on Escape / backdrop click without a cancel button), resolved after the button's handler ran. The alert host of `SmartProvider` (`SmartAlertHost`, part of `SmartOverlays`) renders the dialog at the end of `<body>` and gives the focus back to the element that had it. See the `react-components-overlays` skill for the hosts.

```tsx
import { SmartButton, useAlertService } from '@smartsoft001/react';

export function DeleteNoteButton({ onDelete }: { onDelete: () => void }) {
  const alerts = useAlertService();

  const confirmDelete = async () => {
    const button = await alerts.show({
      header: 'Delete note?',
      message: 'This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' },
      ],
    });

    if (button?.role === 'destructive') onDelete();
  };

  return (
    <SmartButton options={{ click: () => void confirmDelete(), color: 'red' }}>
      Delete
    </SmartButton>
  );
}
```

## Usage

Rendered in place, the parent decides when it is shown and removes it on `onDismissed`:

```tsx
import { useState } from 'react';

import { SmartAlert, SmartButton } from '@smartsoft001/react';

export function PublishConfirm({ onPublish }: { onPublish: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SmartButton options={{ click: () => setOpen(true) }}>
        Publish
      </SmartButton>
      {open && (
        <SmartAlert
          options={{
            header: 'Publish the article?',
            message: 'Readers will see it immediately.',
            backdropDismiss: false,
            buttons: [
              { text: 'Cancel', role: 'cancel' },
              { text: 'Publish', handler: () => onPublish() },
            ],
          }}
          onDismissed={() => setOpen(false)}
        />
      )}
    </>
  );
}
```

## Replacing the Implementation

`SmartAlert` renders the component registered under the `'alert'` key of `SmartProvider`'s `components`, and `SmartAlertStandard` when nothing is registered there. Every `SmartAlert` below the provider then renders the registered component, which receives the same props.

There is no preset for this component: register a component of your own that takes `SmartAlertProps`, as shown below, as `components={{ alert: MyAlert }}`. Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useAlert` hook

The behaviour every alert variant shares: the ids linking the dialog to its header and message, the buttons, and the ways to close it, all reported through `onDismissed`:

- `invoke(button)` runs `button.handler` and dismisses with the button, unless the handler of a non-cancel button returned `false`;
- `cancel()` / `onEscape()` dismiss with the cancel button (or `null`), without running its handler;
- `onBackdropClick(event)` cancels on a click on the backdrop itself, unless `options.backdropDismiss === false`;
- `trapFocus(event, panel)` keeps Tab / Shift+Tab on the panel's buttons.

```ts
function useAlert({
  options,
  onDismissed,
}: Pick<SmartAlertProps, 'options' | 'onDismissed'>);
```

| Returns           | Type                                                          | Description                                                                                                      |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `headerId`        | `string`                                                      | Id for the header element (`aria-labelledby`).                                                                   |
| `messageId`       | `string`                                                      | Id for the message element (`aria-describedby`).                                                                 |
| `buttons`         | `IAlertButton[]`                                              | `options.buttons ?? []`.                                                                                         |
| `cancelButton`    | `IAlertButton \| null`                                        | The button with `role: 'cancel'`, or `null`.                                                                     |
| `invoke`          | `(button: IAlertButton) => void`                              | Click handler of a button: runs its handler and dismisses with it, unless a non-cancel handler returned `false`. |
| `cancel`          | `() => void`                                                  | Dismisses with the cancel button (or `null`) without running its handler.                                        |
| `onEscape`        | `() => void`                                                  | Same as `cancel`, for the Escape key.                                                                            |
| `onBackdropClick` | `(event: SmartAlertBackdropEvent) => void`                    | Cancels on a click on the backdrop element itself, unless `options.backdropDismiss === false`.                   |
| `trapFocus`       | `(event: SmartAlertKeyEvent, container: HTMLElement) => void` | Keeps Tab / Shift+Tab on the panel's buttons; call it from the panel's `onKeyDown`.                              |
| `buttonClasses`   | `(button: IAlertButton) => string`                            | The classes of a button (`getAlertButtonClasses`), by role and `cssClass`.                                       |

A custom dialog builds on `useAlert`, which supplies the ids, the buttons and every way of closing:

```tsx
import { useRef } from 'react';

import { SmartAlertProps, useAlert } from '@smartsoft001/react';

export function BrandAlert(props: SmartAlertProps) {
  const panel = useRef<HTMLDivElement>(null);
  const {
    headerId,
    messageId,
    buttons,
    invoke,
    onEscape,
    onBackdropClick,
    trapFocus,
  } = useAlert(props);

  return (
    <div className="fixed inset-0 bg-black/40" onClick={onBackdropClick}>
      <div
        ref={panel}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={headerId}
        aria-describedby={messageId}
        className={props.className}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onEscape();
          else if (panel.current) trapFocus(event, panel.current);
        }}
      >
        <h2 id={headerId}>{props.options.header}</h2>
        <p id={messageId}>{props.options.message}</p>
        {buttons.map((button) => (
          <button
            key={button.text}
            type="button"
            onClick={() => invoke(button)}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Registered as `components={{ alert: BrandAlert }}`, it renders both the `SmartAlert`s placed by hand and the dialogs of `AlertService.show`.

## Styling

- `className` goes on the dialog panel.
- The standard dialog renders a full-screen backdrop where it is placed; the alert host puts it at the end of `<body>`. Classes carry `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/alert/` in the smartsoft001 repository.

- `alert.tsx`: `SmartAlert`
- `alert.types.ts`: `SmartAlertProps`
- `standard/alert-standard.tsx`: `SmartAlertStandard`
- `use-alert.ts`: `getAlertButtonClasses`, `useAlert`, `SmartAlertKeyEvent`, `SmartAlertBackdropEvent`
- `alert.stories.tsx`: Storybook stories
