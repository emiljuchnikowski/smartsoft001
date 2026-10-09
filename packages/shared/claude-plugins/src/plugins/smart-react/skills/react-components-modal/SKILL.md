---
name: react-components-modal
description: SmartModal React component API (@smartsoft001/react) — dialog with title, description, body (children) and footer actions, controlled open/onOpenChange or uncontrolled defaultOpen, onActionClick/onClosed, ModalService.show() for opening a component in a modal from code, the 'modal' registry key, SmartModalPreset and useModal.
user-invocable: false
---

# Modal (`SmartModal`)

`SmartModal` is a dialog with a title, a description, a body (`children`) and footer buttons (`actions`). A footer button reports `onActionClick({ actionId })` and **keeps the modal open**: close it yourself (set `open` to `false`). The open state is controlled (`open` + `onOpenChange`) or kept inside (`defaultOpen`); closing through the dismiss button, the backdrop or Escape calls `onClosed`. `SmartModalStandard` is a native `<dialog>` shown through its `open` attribute; `SmartModalPreset` is a styled overlay with four variants. The modal host of `SmartProvider` renders `useModalService().show(...)` requests through the same `modal` key.

## When to Use This Skill

- Asking for input or showing details in a dialog over the page
- A confirmation dialog with custom body content and footer actions
- Opening a component in a modal from code and awaiting its result (`ModalService.show`)
- Restyling every modal (the `modal` registry key) or building one on `useModal`

For a simple yes / no question from code, `AlertService.show` (`react-components-alert`) is shorter.

## Exports

All from `@smartsoft001/react`.

| Export               | Kind      | What it is                                                                                                                                                                                                                                                                    |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartModal`         | component | Renders the implementation registered as `components.modal` on `SmartProvider`, `SmartModalStandard` by default.                                                                                                                                                              |
| `SmartModalPreset`   | component | Styled modal variation (preset).                                                                                                                                                                                                                                              |
| `SmartModalStandard` | component | The default modal rendering: a native `<dialog>` always in the DOM, shown through its `open` attribute (not `showModal()`).                                                                                                                                                   |
| `useModal`           | hook      | The behaviour every modal variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`; `invokeAction(id)`, which reports `onActionClick` without closing, and `close()`, which hides the modal and reports `onClosed`. |

The preset's class helpers (`getModalWrapperClasses`, `getModalPanelClasses`, `getModalFooterClasses`, `getModalActionClasses`, `MODAL_BACKDROP`, `MODAL_HEADER`, `MODAL_TITLE`, `MODAL_DISMISS`, `MODAL_BODY`, `MODAL_DESCRIPTION`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartModalProps`

| Prop             | Type                                 | Default | Description                                                                                                |
| ---------------- | ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------- |
| `open?`          | `boolean`                            | —       | Whether the modal is shown. Leave it `undefined` for an uncontrolled modal that starts from `defaultOpen`. |
| `defaultOpen?`   | `boolean`                            | `false` | Initial `open` of an uncontrolled modal.                                                                   |
| `onOpenChange?`  | `(open: boolean) => void`            | —       | Called when the modal opens or closes.                                                                     |
| `title?`         | `string`                             | —       | Heading of the dialog.                                                                                     |
| `description?`   | `string`                             | —       | Text under the heading.                                                                                    |
| `actions?`       | `IModalAction[]`                     | `[]`    | Footer buttons; a click reports `onActionClick` and keeps the modal open.                                  |
| `options?`       | `IModalOptions`                      | —       | Variant, dismiss button, footer style and accessible name.                                                 |
| `className?`     | `string`                             | —       | Classes on the dialog (the wrapper in the preset).                                                         |
| `onActionClick?` | `(value: IModalActionClick) => void` | —       | Called with the id of the clicked footer action; the modal stays open.                                     |
| `onClosed?`      | `() => void`                         | —       | Called after the modal closed itself (dismiss button, backdrop, Escape, native close).                     |
| `children?`      | `ReactNode`                          | —       | The modal body.                                                                                            |

### `IModalOptions`

| Field          | Type                    | Default      | Description                                                           |
| -------------- | ----------------------- | ------------ | --------------------------------------------------------------------- |
| `variant?`     | `SmartModalVariant`     | `'centered'` | Preset layout: `centered`, `wide`, `alert` or `left-aligned-buttons`. |
| `withDismiss?` | `boolean`               | —            | Shows a close (×) button that closes the modal.                       |
| `footerStyle?` | `SmartModalFooterStyle` | `'default'`  | Preset: `gray` gives the footer a gray background.                    |
| `ariaLabel?`   | `string`                | —            | Accessible name when there is no title.                               |

### `IModalActionClick`

Payload of `onActionClick`.

| Field      | Type     | Default  | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action. |

### `IModalAction`

| Field      | Type                      | Default     | Description                                                                                                        |
| ---------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `id`       | `string`                  | required    | Reported as `actionId`.                                                                                            |
| `label`    | `string`                  | required    | Button text.                                                                                                       |
| `variant?` | `SmartModalActionVariant` | `'primary'` | `primary`, `secondary` or `danger`; the standard exposes it as `data-variant`, the preset styles the button by it. |

### Related types

- `SmartModalActionVariant`: `'primary' \| 'secondary' \| 'danger'`
- `SmartModalVariant`: `'centered' \| 'wide' \| 'alert' \| 'left-aligned-buttons'`
- `SmartModalFooterStyle`: `'default' \| 'gray'`

## Opening a component in a modal from code

`useModalService().show({ component, props })` opens `component` inside a `SmartModal` rendered by the modal host of `SmartProvider` (see `react-components-overlays`). The component receives its `props` and a `dismiss(data)` prop; `onDidDismiss()` resolves with `{ data }`. `useModalService().dismiss(data)` closes the modal opened last.

```tsx
import { SmartButton, useModalService } from '@smartsoft001/react';

function RenameForm({
  name,
  dismiss,
}: {
  name: string;
  dismiss: (data?: unknown) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        dismiss(new FormData(event.currentTarget).get('name'));
      }}
    >
      <input name="name" defaultValue={name} />
      <button type="submit">Save</button>
    </form>
  );
}

export function RenameButton({
  name,
  onRename,
}: {
  name: string;
  onRename: (next: string) => void;
}) {
  const modals = useModalService();

  const open = async () => {
    const modal = await modals.show({ component: RenameForm, props: { name } });
    const { data } = await modal.onDidDismiss();
    if (typeof data === 'string') onRename(data);
  };

  return (
    <SmartButton options={{ click: () => void open() }}>Rename</SmartButton>
  );
}
```

## Usage

```tsx
import { useState } from 'react';

import { SmartButton, SmartModal } from '@smartsoft001/react';

export function DeactivateAccount({
  onDeactivate,
}: {
  onDeactivate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SmartButton options={{ click: () => setOpen(true), color: 'red' }}>
        Deactivate
      </SmartButton>
      <SmartModal
        open={open}
        onOpenChange={setOpen}
        title="Deactivate account"
        description="All of your data will be permanently removed."
        options={{ variant: 'alert', withDismiss: true }}
        actions={[
          { id: 'cancel', label: 'Cancel', variant: 'secondary' },
          { id: 'deactivate', label: 'Deactivate', variant: 'danger' },
        ]}
        onActionClick={({ actionId }) => {
          if (actionId === 'deactivate') onDeactivate();
          setOpen(false);
        }}
      >
        <p>You will be signed out on every device.</p>
      </SmartModal>
    </>
  );
}
```

## Replacing the Implementation

`SmartModal` renders the component registered under the `'modal'` key of `SmartProvider`'s `components`, and `SmartModalStandard` when nothing is registered there. Every `SmartModal` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartModalPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { modal: SmartModalPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartModalPreset` is the styled (preset) implementation: register it under the `'modal'` key of `SmartProvider`'s `components`, render it directly in place of `SmartModal`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useModal` hook

The behaviour every modal variant shares: the `open` state, controlled through `open` / `onOpenChange` or kept internally from `defaultOpen`; `invokeAction(id)`, which reports `onActionClick` without closing, and `close()`, which hides the modal and reports `onClosed`.

```ts
function useModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onActionClick,
  onClosed,
}: SmartModalProps);
```

| Returns        | Type                                      | Description                                                   |
| -------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `open`         | `boolean`                                 | The open state (controlled or internal).                      |
| `setOpen`      | `(value: boolean) => void`                | Sets the state and calls `onOpenChange`.                      |
| `invokeAction` | `(actionId: string) => void \| undefined` | Reports `onActionClick({ actionId })` without closing.        |
| `close`        | `() => void`                              | Closes the modal, calls `onOpenChange(false)` and `onClosed`. |

```tsx
import { SmartModalProps, useModal } from '@smartsoft001/react';

export function CustomModal(props: SmartModalProps) {
  const { open, close, invokeAction } = useModal(props);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={props.title ?? props.options?.ariaLabel}
      className={props.className}
    >
      <header>
        <h2>{props.title}</h2>
        <button type="button" aria-label="Close" onClick={close}>
          ×
        </button>
      </header>
      {props.description && <p>{props.description}</p>}
      {props.children}
      <footer>
        {(props.actions ?? []).map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => invokeAction(action.id)}
          >
            {action.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
```

Registered as `components={{ modal: CustomModal }}`, it renders both the `SmartModal`s placed by hand and the modals of `ModalService.show` (which pass `open`, `className` from `cssClass`, `onClosed` and the component as `children`).

## Styling

- `SmartModalStandard` is always in the DOM as a `<dialog>` and shown through its `open` attribute; its native `close` event closes the modal too. Action buttons carry `data-variant`.
- `SmartModalPreset` renders inline with a `fixed` backdrop over the viewport; a click on the backdrop itself or Escape closes it. It carries `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/modal/` in the smartsoft001 repository.

- `modal.tsx`: `SmartModal`
- `modal.types.ts`: `IModalActionClick`, `SmartModalProps`
- `preset/modal-preset.tsx`: `SmartModalPreset`
- `standard/modal-standard.tsx`: `SmartModalStandard`
- `use-modal.ts`: `useModal`
- `modal.stories.tsx`: Storybook stories
