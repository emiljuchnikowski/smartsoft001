---
name: react-components-overlays
description: SmartOverlays React API (@smartsoft001/react) — SmartToastHost, SmartAlertHost and SmartModalHost that render what ToastService, AlertService and ModalService open (toasts, alert dialogs, modals from code), how SmartProvider mounts them (overlays prop) and how to render them yourself.
user-invocable: false
---

# Overlays (`SmartOverlays`)

Toasts, alert dialogs and modals opened from code live in services (`ToastService`, `AlertService`, `ModalService`, from `useToastService()`, `useAlertService()`, `useModalService()`). The **hosts** in this module render them: `SmartToastHost` (toasts through `SmartNotification`), `SmartAlertHost` (dialogs through `SmartAlert`) and `SmartModalHost` (components in a `SmartModal`). `SmartOverlays` renders all three, and `SmartProvider` renders `<SmartOverlays />` after its children by default. Every host renders into a portal at the end of `<body>`, once mounted in the browser, and only while it has something to show.

## When to Use This Skill

- Showing a toast, asking a confirmation or opening a component in a modal from an event handler
- Toasts or dialogs that do not appear (the hosts are not mounted, e.g. `overlays={null}`)
- Rendering the hosts at another place, or only some of them
- Changing how toasts, alerts or modals look (register `notification`, `alert` or `modal` components; the hosts render through them)

## Exports

All from `@smartsoft001/react`.

| Export           | Kind      | What it is                                                               |
| ---------------- | --------- | ------------------------------------------------------------------------ |
| `SmartOverlays`  | component | The hosts of everything the services open: toasts, alerts and modals.    |
| `SmartToastHost` | component | The toasts of `ToastService`, rendered through `<SmartNotification>`.    |
| `SmartAlertHost` | component | The dialogs `AlertService.show` opened, rendered through `<SmartAlert>`. |
| `SmartModalHost` | component | The components `ModalService.show` opened, each in a `<SmartModal>`.     |

## The services

### `ToastService` (`useToastService()`)

| Member                                         | What it does                                                                                                                                                               |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `info(options: IToastOptions): Promise<void>`  | Queues an info toast (`aria-live="polite"`).                                                                                                                               |
| `error(options: IToastOptions): Promise<void>` | Queues an error toast (`aria-live="assertive"`), unless an error lock is held.                                                                                             |
| `dismiss(id: number): void`                    | Removes a toast.                                                                                                                                                           |
| `addLockError()` / `removeLockError()`         | Holds / releases an error lock (the count never goes below zero): while one is held, error toasts are swallowed (e.g. during a sign-out that makes pending requests fail). |
| `toasts: SmartStore<IToast[]>`                 | The queue the host renders.                                                                                                                                                |

```ts
interface IToastOptions {
  title?: string;
  message: string;
  /** Milliseconds before the toast closes itself; 2000 when missing, zero or negative. */
  duration?: number;
  // { text: string; position: 'start' | 'end'; handler: () => void }; the host renders them as actions in the given order
  // (`position` is kept for compatibility); a click runs `handler`, then closes the toast
  buttons?: Array<IToastButton>;
}
```

A toast with a title shows the title as the heading and the message under it; without one, the message is the heading. Its buttons are the notification's actions: a click runs the button's handler, then closes the toast. A toast without buttons renders in the `simple` notification variant, a message with buttons in `condensed`, and a title with a message and buttons in `with-actions-below`, which keeps the message under the title. A toast closes itself after its duration and on its close button.

### `AlertService` (`useAlertService()`)

`show(options: IAlertOptions): Promise<IAlertButton | null>` opens a dialog and resolves with the chosen button, after its handler ran, or `null` on Escape / backdrop click without a cancel button. The focus goes back to the element that had it. `alerts: SmartStore<IAlertRequest[]>` is the list the host renders. `IAlertOptions` and the dialog behaviour are described in `react-components-alert`.

### `ModalService` (`useModalService()`)

| Member                                                 | What it does                                 |
| ------------------------------------------------------ | -------------------------------------------- |
| `show(options: IModalServiceOptions): Promise<IModal>` | Opens `options.component` in a modal.        |
| `dismiss(data?)`                                       | Closes the modal opened last, with a result. |
| `modals: SmartStore<IModalRequest[]>`                  | The list the host renders.                   |

```ts
interface IModalServiceOptions {
  component: ComponentType<any>; // receives `props` and a `dismiss(data)` prop
  props?: Record<string, unknown>;
  mode?: 'default' | 'bottom'; // 'bottom': the bottom-sheet variant, plus the smart-modal-bottom class
  cssClass?: string[]; // joined into the SmartModal className
  backdropDismiss?: boolean; // false: the backdrop and Escape leave it open
}

interface IModal {
  dismiss: (data?: any) => void;
  onDidDismiss(): Promise<{ data: any }>;
}
```

`SmartModalHost` renders each request in a `<div data-role="modal" data-mode={mode}>` as `<SmartModal open className options={{ withDismiss: true }} onClosed={() => dismiss()}>` around `<component {...props} dismiss={dismiss} />`, its `className` being `cssClass` plus `smart-modal-bottom` for `mode: 'bottom'`, and its `options` adding `variant: 'bottom-sheet'` for that mode. So every modal shows its close button, and closing the modal by its own controls (close button, backdrop, Escape) resolves `onDidDismiss()` with `{ data: null }`. The modals stack in opening order, the last one on top. With `backdropDismiss: false` a click on the backdrop (outside the `role="dialog"` element) is stopped before the modal sees it, and `ModalService` stops Escape at the document while that modal is on top; the close button and `dismiss()` still close it. `mode: 'bottom'` is a bottom sheet: both `SmartModalStandard` and `SmartModalPreset` dock the `bottom-sheet` variant to the bottom of the viewport, full width up to a max width, with a max height and a scrolling body (see `react-components-modal`); the backdrop, Escape and close button behave as in the other variants. `smart-modal-bottom` stays on the modal for an application's own styling.

## Usage

```tsx
import {
  SmartButton,
  useAlertService,
  useModalService,
  useToastService,
} from '@smartsoft001/react';

function NoteEditor({ dismiss }: { dismiss: (data?: unknown) => void }) {
  return (
    <SmartButton options={{ click: () => dismiss('saved') }}>
      Save and close
    </SmartButton>
  );
}

export function NoteActions({ remove }: { remove: () => Promise<void> }) {
  const toasts = useToastService();
  const alerts = useAlertService();
  const modals = useModalService();

  const onDelete = async () => {
    const button = await alerts.show({
      header: 'Delete note?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' },
      ],
    });
    if (button?.role !== 'destructive') return;

    await remove();
    await toasts.info({
      message: 'Note deleted',
      buttons: [{ text: 'OK', position: 'end', handler: () => undefined }],
    });
  };

  const onEdit = async () => {
    const modal = await modals.show({
      component: NoteEditor,
      cssClass: ['max-w-2xl'],
    });
    const { data } = await modal.onDidDismiss();
    if (data === 'saved') await toasts.info({ message: 'Saved' });
  };

  return (
    <>
      <SmartButton options={{ click: () => void onEdit() }}>Edit</SmartButton>
      <SmartButton options={{ click: () => void onDelete(), color: 'red' }}>
        Delete
      </SmartButton>
    </>
  );
}
```

## Replacing the Implementation

The hosts have no registry key; they render through the registered `notification`, `alert` and `modal` components, so registering those (or spreading `SMART_PRESET_COMPONENTS`) restyles toasts, dialogs and modals.

To place the hosts yourself, turn the default off with `overlays={null}` (or pass your own node) and render the hosts you want anywhere below the provider:

```tsx
import type { ReactNode } from 'react';

import {
  SmartAlertHost,
  SmartModalHost,
  SmartProvider,
  SmartToastHost,
} from '@smartsoft001/react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmartProvider overlays={null}>
      {children}
      <SmartToastHost />
      <SmartAlertHost />
      <SmartModalHost />
    </SmartProvider>
  );
}
```

A host renders nothing during server-side rendering and until it has mounted, then portals into `document.body`.

## Styling

- The toast stack is fixed to the bottom of the screen (centred, right-aligned from `sm`) above the modals (`z-[100]`), with each toast `max-w-sm` and its type in `data-type` (`error` or `info`).
- Looks come from the registered `notification` / `alert` / `modal` implementations, with their dark-mode variants.

## File Locations

Source: `packages/shared/react/src/lib/components/overlays/` in the smartsoft001 repository.

- `overlays.tsx`: `SmartToastHost`, `SmartAlertHost`, `SmartModalHost`, `SmartOverlays`
