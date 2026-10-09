---
name: react-components-command-palette
description: SmartCommandPalette React component API (@smartsoft001/react) — searchable command dialog with controlled/uncontrolled open and query, onRunCommand, eight visual variants (groups, icons, images, preview, footer), the 'command-palette' registry key, SmartCommandPalettePreset and useCommandPalette.
user-invocable: false
---

# Command Palette (`SmartCommandPalette`)

`SmartCommandPalette` is a search dialog over a list of commands: the user types, the commands are filtered by a case-insensitive substring of their `label`, and clicking one reports `onRunCommand({ commandId })` and closes the palette. Both the open state (`open` / `defaultOpen` / `onOpenChange`) and the search text (`query` / `defaultQuery` / `onQueryChange`) can be controlled or left to the component. `SmartCommandPaletteStandard` is a native `<dialog>` with a `listbox`; `SmartCommandPalettePreset` adds the visual variants of `options.variant`.

## When to Use This Skill

- A Ctrl+K / quick-search dialog listing actions or pages
- Running an action by id when a command is chosen (`onRunCommand`)
- Grouped results, icons, images, a preview pane or a footer (preset variants)
- Restyling every palette (the `command-palette` registry key)

## Exports

All from `@smartsoft001/react`.

| Export                        | Kind      | What it is                                                                                                                                                                                                                                                                 |
| ----------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmartCommandPalette`         | component | Renders the implementation registered as `components['command-palette']` on `SmartProvider`, `SmartCommandPaletteStandard` by default.                                                                                                                                     |
| `SmartCommandPalettePreset`   | component | Styled command-palette variation (preset).                                                                                                                                                                                                                                 |
| `SmartCommandPaletteStandard` | component | The default command palette: a native `<dialog>` with a search input and a `listbox` of the filtered commands.                                                                                                                                                             |
| `useCommandPalette`           | hook      | The behaviour every command-palette variant shares: the `open` and `query` models (controlled or uncontrolled), the commands filtered by a case-insensitive label substring, and `selectCommand`, which reports the command through `onRunCommand` and closes the palette. |

The preset's class helpers (`getCommandPaletteDialogClasses`, `getCommandPaletteListClasses`, `getCommandPaletteItemClasses`, `COMMAND_PALETTE_SEARCH_WRAP`, `COMMAND_PALETTE_SEARCH_ICON`, `COMMAND_PALETTE_SEARCH`, `COMMAND_PALETTE_ITEM_ICON`, `COMMAND_PALETTE_ITEM_IMAGE`, `COMMAND_PALETTE_ITEM_LABEL`, `COMMAND_PALETTE_GROUP`, `COMMAND_PALETTE_EMPTY`, `COMMAND_PALETTE_FOOTER`, `COMMAND_PALETTE_PREVIEW_LAYOUT`, `COMMAND_PALETTE_PREVIEW`) are exported too, for a custom implementation that wants the preset look.

## Props and Types

### `SmartCommandPaletteProps`

| Prop             | Type                                         | Default | Description                                                                                                                                |
| ---------------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `commands?`      | `ICommand[]`                                 | `[]`    | The commands to search.                                                                                                                    |
| `open?`          | `boolean`                                    | —       | Whether the palette is open. Controlled when set; leave it `undefined` to let the palette keep its own state, starting from `defaultOpen`. |
| `defaultOpen?`   | `boolean`                                    | `false` | Initial open state when uncontrolled.                                                                                                      |
| `onOpenChange?`  | `(open: boolean) => void`                    | —       | Called when the palette opens or closes (also after a command runs).                                                                       |
| `query?`         | `string`                                     | —       | The search text. Controlled when set; leave it `undefined` to let the palette keep its own state, starting from `defaultQuery`.            |
| `defaultQuery?`  | `string`                                     | `''`    | Initial search text when uncontrolled.                                                                                                     |
| `onQueryChange?` | `(query: string) => void`                    | —       | Called with the new search text.                                                                                                           |
| `options?`       | `ICommandPaletteOptions`                     | —       | Variant and texts.                                                                                                                         |
| `className?`     | `string`                                     | —       | Classes on the dialog.                                                                                                                     |
| `onRunCommand?`  | `(event: ICommandPaletteRunCommand) => void` | —       | Called with the id of the clicked command, before the palette closes.                                                                      |

### `ICommandPaletteOptions`

| Field          | Type                         | Default        | Description                               |
| -------------- | ---------------------------- | -------------- | ----------------------------------------- |
| `variant?`     | `SmartCommandPaletteVariant` | `'simple'`     | The preset look; the standard ignores it. |
| `placeholder?` | `string`                     | —              | Placeholder of the search input.          |
| `emptyText?`   | `string`                     | `'No results'` | Shown when nothing matches.               |
| `ariaLabel?`   | `string`                     | —              | Accessible name of the dialog.            |

### `ICommandPaletteRunCommand`

Passed to `onRunCommand` when a command is chosen.

| Field       | Type     | Default  | Description                     |
| ----------- | -------- | -------- | ------------------------------- |
| `commandId` | `string` | required | The `id` of the chosen command. |

### `ICommand`

| Field          | Type     | Default  | Description                                                                         |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------- |
| `id`           | `string` | required | Reported as `commandId`.                                                            |
| `label`        | `string` | required | Searched and shown.                                                                 |
| `icon?`        | `string` | —        | Shown by the preset's `with-icons` variant.                                         |
| `group?`       | `string` | —        | Group header in the preset's `with-groups` variant.                                 |
| `href?`        | `string` | —        | Carried for your own use; no variant navigates to it (handle it in `onRunCommand`). |
| `description?` | `string` | —        | Secondary text (e.g. in the preview pane).                                          |
| `imageUrl?`    | `string` | —        | Shown by the preset's `with-images` variant.                                        |

### Related types

- `SmartCommandPaletteVariant`: `'simple' \| 'with-padding' \| 'with-preview' \| 'with-images' \| 'with-icons' \| 'semi-transparent' \| 'with-groups' \| 'with-footer'`

## Usage

```tsx
import { useEffect, useState } from 'react';

import {
  ICommand,
  SmartCommandPalettePreset,
  useNavigation,
} from '@smartsoft001/react';

const COMMANDS: ICommand[] = [
  { id: 'notes', label: 'Open notes', group: 'Pages', href: '/notes' },
  { id: 'settings', label: 'Open settings', group: 'Pages', href: '/settings' },
  { id: 'new-note', label: 'Create a note', group: 'Actions' },
];

export function QuickSearch({ onNewNote }: { onNewNote: () => void }) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <SmartCommandPalettePreset
      commands={COMMANDS}
      open={open}
      onOpenChange={setOpen}
      options={{ variant: 'with-groups', placeholder: 'Search…' }}
      onRunCommand={({ commandId }) => {
        const command = COMMANDS.find((c) => c.id === commandId);
        if (command?.href) navigation.navigate(command.href);
        else if (commandId === 'new-note') onNewNote();
      }}
    />
  );
}
```

## Replacing the Implementation

`SmartCommandPalette` renders the component registered under the `'command-palette'` key of `SmartProvider`'s `components`, and `SmartCommandPaletteStandard` when nothing is registered there. Every `SmartCommandPalette` below the provider then renders the registered component, which receives the same props.

```tsx
import type { ReactNode } from 'react';

import { SmartProvider, SmartCommandPalettePreset } from '@smartsoft001/react';

// A module constant: a new object on every render would change the context.
const components = { 'command-palette': SmartCommandPalettePreset };

export function AppProviders({ children }: { children: ReactNode }) {
  return <SmartProvider components={components}>{children}</SmartProvider>;
}
```

`SmartCommandPalettePreset` is the styled (preset) implementation: register it as above, render it directly in place of `SmartCommandPalette`, or spread `SMART_PRESET_COMPONENTS` on the provider to register every preset at once (see the `react-provider` skill). Pass `components` as a stable object (a module constant or a memoised value), or the context changes on every render.

### The `useCommandPalette` hook

The behaviour every command-palette variant shares: the `open` and `query` models (controlled or uncontrolled), the commands filtered by a case-insensitive label substring, and `selectCommand`, which reports the command through `onRunCommand` and closes the palette.

```ts
function useCommandPalette({
  commands = [],
  open,
  defaultOpen = false,
  onOpenChange,
  query,
  defaultQuery = '',
  onQueryChange,
  onRunCommand,
}: SmartCommandPaletteProps);
```

| Returns            | Type                          | Description                                                     |
| ------------------ | ----------------------------- | --------------------------------------------------------------- |
| `open`             | `boolean`                     | The open state (controlled or internal).                        |
| `query`            | `string`                      | The search text (controlled or internal).                       |
| `setQuery`         | `(next: string) => void`      | Sets the search text and calls `onQueryChange`.                 |
| `filteredCommands` | `ICommand[]`                  | The commands whose label contains the query (case-insensitive). |
| `selectCommand`    | `(commandId: string) => void` | Calls `onRunCommand({ commandId })`, then closes the palette.   |
| `close`            | `() => void`                  | Closes the palette and calls `onOpenChange(false)`.             |

```tsx
import {
  SmartCommandPaletteProps,
  useCommandPalette,
} from '@smartsoft001/react';

export function InlineCommandList(props: SmartCommandPaletteProps) {
  const { open, query, setQuery, filteredCommands, selectCommand } =
    useCommandPalette(props);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label={props.options?.ariaLabel}
      className={props.className}
    >
      <input
        value={query}
        placeholder={props.options?.placeholder}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul role="listbox">
        {filteredCommands.map((command) => (
          <li
            key={command.id}
            role="option"
            aria-selected={false}
            onClick={() => selectCommand(command.id)}
          >
            {command.label}
          </li>
        ))}
      </ul>
      {filteredCommands.length === 0 && (
        <p>{props.options?.emptyText ?? 'No results'}</p>
      )}
    </div>
  );
}
```

## Styling

- The standard palette is a native `<dialog>`: Escape (the dialog's `close` event) closes it.
- `SmartCommandPalettePreset` renders the variants `simple`, `with-padding`, `with-preview`, `with-images`, `with-icons`, `semi-transparent`, `with-groups` and `with-footer`, with `smart:dark:` variants.

## File Locations

Source: `packages/shared/react/src/lib/components/command-palette/` in the smartsoft001 repository.

- `command-palette.tsx`: `SmartCommandPalette`
- `command-palette.types.ts`: `ICommandPaletteRunCommand`, `SmartCommandPaletteProps`
- `preset/command-palette-preset.tsx`: `SmartCommandPalettePreset`
- `standard/command-palette-standard.tsx`: `SmartCommandPaletteStandard`
- `use-command-palette.ts`: `useCommandPalette`
- `command-palette.stories.tsx`: Storybook stories
