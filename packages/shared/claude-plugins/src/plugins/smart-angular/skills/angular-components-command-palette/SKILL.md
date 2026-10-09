---
name: angular-components-command-palette
description: Command Palette component API with InjectionToken pattern for custom implementations.
user-invocable: false
---

# Command Palette Component

The `<smart-command-palette>` component provides a Cmd+K-style overlay that filters a list of commands by a search query. It follows the Base + Standard + Wrapper pattern with an InjectionToken-based extension mechanism. The abstract `CommandPaletteBaseComponent` defines the shared API — `commands` (`InputSignal<ICommand[]>`), two-way `open` (`ModelSignal<boolean>`) and `query` (`ModelSignal<string>`), optional `ICommandPaletteOptions`, `cssClass` (alias `class`), a `filteredCommands` computed signal that performs case-insensitive substring matching on `command.label`, plus `selectCommand(id)` and `close()` behaviors. `CommandPaletteStandardComponent` is a barebones placeholder concrete implementation. `CommandPaletteComponent` is the public wrapper that renders `CommandPaletteStandardComponent` by default and accepts a custom replacement via `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN`.

## When to Use This Skill

- Developer wants to use or customize the command palette component
- Developer asks about `<smart-command-palette>`, `CommandPaletteComponent`, `CommandPaletteStandardComponent`, or `CommandPaletteBaseComponent`

## Components

### CommandPaletteComponent (`<smart-command-palette>`)

Main wrapper component. Renders `CommandPaletteStandardComponent` by default. When `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`, passes it every input (`class` included), writes its `open` / `query` changes back to the wrapper's models and re-emits its `runCommand`, so `[(open)]`, `[(query)]` and `(runCommand)` work the same with the standard, the preset or an implementation of your own.

### CommandPaletteStandardComponent (`<smart-command-palette-standard>`)

Barebones placeholder concrete implementation. Renders a native `<dialog [open]>` containing an `<input type="search">` bound to `query` and a `<ul role="listbox">` with one `<li role="option">` per filtered command, or an `options.emptyText` item (`'No results'` by default) when nothing matches. `Escape` anywhere in the document closes an open palette (`onEscape()`, also inherited by the preset), and so does the dialog's `close` event. It ignores `options.variant` and every `ICommand` field but `id` and `label`, and it does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token. The `Cmd+K` global shortcut (open) is left to the application.

### CommandPaletteBaseComponent (abstract)

Abstract base directive for extending custom command palette implementations. Exposes `commands` as an `InputSignal<ICommand[]>` (default `[]`), `open` and `query` as two-way `ModelSignal`s (defaults `false` / `''`), `options` as an `InputSignal<ICommandPaletteOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), a `filteredCommands` computed (case-insensitive `label` substring), a `selectCommand(commandId)` method that emits the `runCommand` output and sets `open` to `false`, and a `close()` method that sets `open` to `false`. The base binds no keyboard listeners.

## API

### Inputs

| Input      | Type                                               | Default | Description                                                       |
| ---------- | -------------------------------------------------- | ------- | ----------------------------------------------------------------- |
| `commands` | `InputSignal<ICommand[]>`                          | `[]`    | List of commands available in the palette                         |
| `open`     | `ModelSignal<boolean>`                             | `false` | Visibility state (two-way bindable; `openChange` reports changes) |
| `query`    | `ModelSignal<string>`                              | `''`    | Search query (two-way bindable; `queryChange` reports changes)    |
| `options`  | `InputSignal<ICommandPaletteOptions \| undefined>` | -       | Optional configuration                                            |
| `class`    | `InputSignal<string>`                              | `''`    | External CSS classes on the dialog (alias for `cssClass`)         |

### Outputs

| Output       | Payload                 | Description                                                    |
| ------------ | ----------------------- | -------------------------------------------------------------- |
| `runCommand` | `{ commandId: string }` | Fired when a user selects a command, before the palette closes |

### ICommand

| Field         | Type     | Default     | Description                                                                                                                               |
| ------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `string` | required    | Reported as `commandId` by `runCommand`.                                                                                                  |
| `label`       | `string` | required    | Searched and shown.                                                                                                                       |
| `icon`        | `string` | `undefined` | Preset only: the leading glyph of the `with-icons` variant (`#` when absent).                                                             |
| `group`       | `string` | `undefined` | Preset only: the group header of the `with-groups` variant (`Other` when absent).                                                         |
| `href`        | `string` | `undefined` | Not read by the built-in implementations (no variant navigates to it); available to a custom implementation or your `runCommand` handler. |
| `description` | `string` | `undefined` | Preset only: the preview text of the `with-preview` variant.                                                                              |
| `imageUrl`    | `string` | `undefined` | Preset only: the leading avatar of the `with-images` variant.                                                                             |

```typescript
interface ICommand {
  id: string;
  label: string;
  icon?: string;
  group?: string;
  href?: string;
  description?: string;
  imageUrl?: string;
}
```

### ICommandPaletteOptions

| Field         | Type                         | Default        | Description                                                                    |
| ------------- | ---------------------------- | -------------- | ------------------------------------------------------------------------------ |
| `variant`     | `SmartCommandPaletteVariant` | `'simple'`     | Preset only: the look (see the variants table below). The standard ignores it. |
| `placeholder` | `string`                     | `undefined`    | Placeholder of the search input.                                               |
| `emptyText`   | `string`                     | `'No results'` | Shown when nothing matches.                                                    |
| `ariaLabel`   | `string`                     | `undefined`    | Accessible name of the search input.                                           |

`SmartCommandPaletteVariant` is `'simple' | 'with-padding' | 'with-preview' | 'with-images' | 'with-icons' | 'semi-transparent' | 'with-groups' | 'with-footer'`.

```typescript
interface ICommandPaletteOptions {
  variant?:
    | 'simple'
    | 'with-padding'
    | 'with-preview'
    | 'with-images'
    | 'with-icons'
    | 'semi-transparent'
    | 'with-groups'
    | 'with-footer';
  placeholder?: string;
  emptyText?: string;
  ariaLabel?: string;
}
```

## COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN

```typescript
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `CommandPaletteStandardComponent` with a custom implementation. Provide a `Type<CommandPaletteBaseComponent>` to override; the wrapper passes it every input it declares and forwards its `open`, `query` and `runCommand`.

```typescript
// In your app providers:
providers: [
  {
    provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
    useValue: MyCustomCommandPaletteComponent,
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

import { CommandPaletteBaseComponent } from '@smartsoft001/angular';

@Component({
  selector: 'my-custom-command-palette',
  template: `
    <dialog [open]="open()" [class]="containerClasses()" (close)="close()">
      <input
        type="search"
        [value]="query()"
        [attr.placeholder]="options()?.placeholder ?? null"
        (input)="onQueryChange($event)"
      />
      <ul role="listbox">
        @for (command of filteredCommands(); track command.id) {
          <li role="option" (click)="selectCommand(command.id)">
            {{ command.label }}
          </li>
        }
      </ul>
    </dialog>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'open() && close()' },
})
export class MyCustomCommandPaletteComponent extends CommandPaletteBaseComponent {
  containerClasses = computed(() => {
    const classes = ['my-command-palette'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  onQueryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value);
  }
}
```

When extending the base directly, remember to:

- call `selectCommand(id)` rather than emitting `runCommand` manually — it already sets `open.set(false)` for you,
- handle the `Escape` key (and a global `Cmd+K` shortcut if you want one) yourself: the base binds no keyboard listeners.

## Usage Examples

```html
<!-- Basic -->
<smart-command-palette
  [commands]="commands"
  [(open)]="open"
  [(query)]="query"
  (runCommand)="onRunCommand($event)"
/>

<!-- With options -->
<smart-command-palette
  [commands]="commands"
  [(open)]="open"
  [options]="{ placeholder: 'Search commands…', emptyText: 'Nothing matches.' }"
/>

<!-- With external class -->
<smart-command-palette
  [commands]="commands"
  [(open)]="open"
  class="smart:m-4"
/>
```

```typescript
import { signal } from '@angular/core';

import { ICommand } from '@smartsoft001/angular';

const open = signal(false);
const query = signal('');
const commands = signal<ICommand[]>([
  { id: 'new-file', label: 'New file' },
  { id: 'open-settings', label: 'Open settings' },
]);

function onRunCommand({ commandId }: { commandId: string }): void {
  // …
}
```

## Preset

`CommandPalettePresetComponent` (`<smart-command-palette-preset>`) is the styled, production-ready replacement for the barebones standard component. It `extends CommandPaletteStandardComponent`, so all filtering (`filteredCommands`), query handling (`onQueryChange`), selection (`selectCommand` → emit `runCommand` + close), `close()` and the Escape listener are inherited unchanged; the preset only adds the visual layer driven by `options.variant`.

Register it under `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN` (`{ provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN, useValue: CommandPalettePresetComponent }`) to restyle every `<smart-command-palette>`, register every preset at once with `provideSmartPresets()`, or use the `<smart-command-palette-preset>` selector directly (it takes the extra classes as `class` or `[cssClass]`).

The base look is a native `<dialog [open]>` styled `smart:mx-auto smart:mt-16 smart:w-full smart:max-w-xl smart:rounded-xl` with a gray border, white/`dark:bg-gray-800` surface and `smart:shadow-xl`; a search input with a leading magnifier SVG (`ps-11`, `focus:ring-blue-500`); a `<ul role="listbox">` with `smart:divide-y` rows that hover `smart:bg-gray-100 dark:bg-gray-700`; and a centered `smart:text-gray-500` empty state using `options.emptyText` (fallback `No results`). All Tailwind utilities are `smart:`-prefixed with explicit `dark:` twins in the same template; the class recipes are internal to the preset (not exported).

### Variants (`options.variant`, default `simple`)

| Variant            | Rendering                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `simple`           | Base dialog + listbox, opaque white/`dark:gray-800` surface.                                    |
| `with-padding`     | Looser row padding (`smart:px-6 smart:py-4`) for a roomier list.                                |
| `with-icons`       | Leading square glyph per row from `ICommand.icon` (falls back to `#` when absent).              |
| `with-images`      | Leading rounded avatar per row from `ICommand.imageUrl` (rows without an image show no avatar). |
| `semi-transparent` | Translucent `smart:bg-white/90 dark:bg-gray-800/90 smart:backdrop-blur` dialog surface.         |
| `with-groups`      | Grouped rows under uppercase headers (`data-role="group"`) from `ICommand.group`.               |
| `with-footer`      | Adds a bottom bar (`data-role="footer"`) with a result count and `Enter / Esc` hint text.       |
| `with-preview`     | Two-pane layout: half-width list + a preview panel showing the hovered (default first) command. |

`with-groups` groups by `ICommand.group`; commands without a `group` fall under an `Other` header. `with-preview` uses `ICommand.description` for the preview body and widens the dialog to `smart:max-w-3xl`.

### data-role hooks

The template exposes stable `data-role` attributes for testing/targeting: `dialog`, `search-wrap`, `search`, `list`, `item`, `item-icon`, `item-image`, `group`, `empty`, `footer`, `preview-layout`, `preview`.

### Token registration

```typescript
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
import { CommandPalettePresetComponent } from '@smartsoft001/angular';

providers: [
  {
    provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
    useValue: CommandPalettePresetComponent,
  },
];
```

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/command-palette/command-palette.component.ts`
- Standard: `packages/shared/angular/src/lib/components/command-palette/standard/standard.component.ts`
- Preset: `packages/shared/angular/src/lib/components/command-palette/preset/preset.component.ts` (classes in `preset/preset-classes.util.ts`, internal)
- Stories: `packages/shared/angular/src/lib/components/command-palette/command-palette.component.stories.ts`
- Base class: `packages/shared/angular/src/lib/components/command-palette/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICommand`, `ICommandPaletteOptions`)
