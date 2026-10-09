---
name: react-components-action-panel
description: SmartActionPanel React component API (@smartsoft001/react) — a titled panel with a description, a content slot and action buttons/links in eight layouts, onActionClick, the 'action-panel' registry key and SmartActionPanelPreset.
user-invocable: false
---

# Action Panel (`SmartActionPanel`)

`SmartActionPanel` renders a call-to-action panel: a title, a description (or a `descriptionTpl` node), an optional content slot (`contentTpl`, e.g. a toggle or an input) and a row of actions. Actions with `href` render as links, the others as buttons that report `onActionClick({ actionId })`. `options.layout` picks one of eight arrangements, styled by `SmartActionPanelPreset`.

## When to Use This Skill

- A settings or billing panel with a title, explanation and one or more actions
- A panel with an inline control (`contentTpl`) such as a toggle, an input or a payment method card
- Reacting to an action click by id (`onActionClick`)
- Restyling every action panel (the `action-panel` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                     | Kind      | What it is                                                                                                                                              |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartActionPanel`         | component | Renders the implementation registered as `components['action-panel']` on `SmartProvider`, `SmartActionPanelStandard` by default.                        |
| `SmartActionPanelPreset`   | component | Styled action-panel variation (preset).                                                                                                                 |
| `SmartActionPanelStandard` | component | The default action panel: a `section.action-panel` with the title, the description (or `options.descriptionTpl`), `options.contentTpl` and the actions. |

The preset's class helpers (`getActionPanelCardClasses`, `getActionPanelTitleClasses`, `getActionPanelDescriptionClasses`, `getActionPanelWellClasses`, `getActionPanelActionClasses`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartActionPanelProps`

| Prop             | Type                                       | Default | Description                                      |
| ---------------- | ------------------------------------------ | ------- | ------------------------------------------------ |
| `options?`       | `IActionPanelOptions`                      | —       | The panel's content and layout.                  |
| `className?`     | `string`                                   | —       | Classes appended to the root `section`.          |
| `onActionClick?` | `(event: IActionPanelActionClick) => void` | —       | Called when an action without `href` is clicked. |

### `IActionPanelOptions`

| Field             | Type                     | Default    | Description                                                                                                                              |
| ----------------- | ------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title?`          | `string`                 | —          | Heading of the panel.                                                                                                                    |
| `description?`    | `string`                 | —          | Text under the heading.                                                                                                                  |
| `layout?`         | `SmartActionPanelLayout` | `'simple'` | One of the eight `SmartActionPanelLayout` arrangements; the standard implementation does not vary its markup by layout, the preset does. |
| `actions?`        | `IActionPanelAction[]`   | `[]`       | The buttons / links of the panel.                                                                                                        |
| `descriptionTpl?` | `ReactNode`              | —          | Replaces `description` with a node.                                                                                                      |
| `contentTpl?`     | `ReactNode`              | —          | Extra content placed in the panel (a toggle, an input, a card).                                                                          |

### `IActionPanelActionClick`

Passed to `onActionClick` when a button action is clicked.

| Field      | Type     | Default  | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| `actionId` | `string` | required | The `id` of the clicked action. |

### `IActionPanelAction`

| Field      | Type                                            | Default  | Description                                                                        |
| ---------- | ----------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `id`       | `string`                                        | required | Reported as `actionId` by `onActionClick`.                                         |
| `label?`   | `string`                                        | —        | Text of the button / link.                                                         |
| `href?`    | `string`                                        | —        | Renders the action as a link instead of a button (no `onActionClick`).             |
| `variant?` | `'primary' \| 'secondary' \| 'ghost' \| 'link'` | —        | Look of the action: `primary` by default for buttons, `link` by default for links. |
| `iconTpl?` | `ReactNode`                                     | —        | Icon rendered with the label.                                                      |

### Related types

- `SmartActionPanelLayout`: `'simple' \| 'with-link' \| 'right-button' \| 'top-right-button' \| 'with-toggle' \| 'with-input' \| 'well' \| 'payment-method'`

## Usage

```tsx
import { SmartActionPanel, SmartToggle } from '@smartsoft001/react';

export function DeleteAccountPanel({ onDelete }: { onDelete: () => void }) {
  return (
    <SmartActionPanel
      options={{
        layout: 'right-button',
        title: 'Delete your account',
        description:
          'Once you delete your account, you will lose all data associated with it.',
        actions: [
          { id: 'delete', label: 'Delete account', variant: 'primary' },
          { id: 'docs', label: 'Learn more', href: '/help/delete-account' },
        ],
      }}
      onActionClick={({ actionId }) => {
        if (actionId === 'delete') onDelete();
      }}
    />
  );
}

export function NotificationsPanel({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <SmartActionPanel
      options={{
        layout: 'with-toggle',
        title: 'Email notifications',
        description: 'Get an email whenever someone mentions you.',
        contentTpl: (
          <SmartToggle
            value={enabled}
            onValueChange={onChange}
            options={{ ariaLabel: 'Email notifications' }}
          />
        ),
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartActionPanel` renders the component registered under the `'action-panel'` key of `SmartProvider`'s `components`, and `SmartActionPanelStandard` when nothing is registered there. Every `SmartActionPanel` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartActionPanelPreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'action-panel': SmartActionPanelPreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartActionPanelPreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartActionPanel`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

A custom implementation takes `SmartActionPanelProps` and calls `onActionClick` for its buttons:

```tsx
import { SmartActionPanelProps } from '@smartsoft001/react';

export function CompactActionPanel({
  options,
  className,
  onActionClick,
}: SmartActionPanelProps) {
  return (
    <section className={className}>
      <h3>{options?.title}</h3>
      {options?.descriptionTpl ?? <p>{options?.description}</p>}
      {options?.contentTpl}
      {options?.actions?.map((action) =>
        action.href ? (
          <a key={action.id} href={action.href}>
            {action.label}
          </a>
        ) : (
          <button
            key={action.id}
            type="button"
            onClick={() => onActionClick?.({ actionId: action.id })}
          >
            {action.label}
          </button>
        ),
      )}
    </section>
  );
}
```

## Styling

- `SmartActionPanelStandard` renders a `section.action-panel` with the title, description, content and actions in one arrangement; `SmartActionPanelPreset` renders a bordered card and re-composes the parts per `layout` (row, split, well, ...), with `smart:dark:` variants.
- `className` is appended to the root element.

## File Locations

Source: `packages/shared/react/src/lib/components/action-panel/` in the smartsoft001 repository.

- `action-panel.tsx`: `SmartActionPanel`
- `action-panel.types.ts`: `IActionPanelActionClick`, `SmartActionPanelProps`
- `preset/action-panel-preset.tsx`: `SmartActionPanelPreset`
- `standard/action-panel-standard.tsx`: `SmartActionPanelStandard`
- `action-panel.stories.tsx`: Storybook stories
