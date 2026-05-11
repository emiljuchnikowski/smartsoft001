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

Main wrapper component. Renders `CommandPaletteStandardComponent` by default. When `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN` is provided, renders the injected component via `NgComponentOutlet`.

### CommandPaletteStandardComponent (`<smart-command-palette-standard>`)

Barebones placeholder concrete implementation. Renders a native `<dialog [open]>` containing an `<input type="search">` bound to `query` and a `<ul role="listbox">` with one `<li role="option">` per filtered command. It does not include Tailwind UI styling — it exists solely as the default structural placeholder until a custom implementation is registered through the token. Keyboard handling for `Escape` (close) and the `Cmd+K` global shortcut (open) is intentionally deferred to custom implementations.

### CommandPaletteBaseComponent (abstract)

Abstract base directive for extending custom command palette implementations. Exposes `commands` as an `InputSignal<ICommand[]>` (default `[]`), `open` and `query` as two-way `ModelSignal`s (defaults `false` / `''`), `options` as an `InputSignal<ICommandPaletteOptions | undefined>`, `cssClass` as an `InputSignal<string>` (with alias `class`), a `filteredCommands` computed (case-insensitive `label` substring), a `selectCommand(commandId)` method that emits the `runCommand` output and sets `open` to `false`, and a `close()` method that sets `open` to `false`.

## API

### Inputs

| Input      | Type                                               | Default | Description                                 |
| ---------- | -------------------------------------------------- | ------- | ------------------------------------------- |
| `commands` | `InputSignal<ICommand[]>`                          | `[]`    | List of commands available in the palette   |
| `open`     | `ModelSignal<boolean>`                             | `false` | Visibility state (two-way bindable)         |
| `query`    | `ModelSignal<string>`                              | `''`    | Search query (two-way bindable)             |
| `options`  | `InputSignal<ICommandPaletteOptions \| undefined>` | -       | Optional configuration                      |
| `class`    | `InputSignal<string>`                              | `''`    | External CSS classes (alias for `cssClass`) |

### Outputs

| Output       | Payload                 | Description                         |
| ------------ | ----------------------- | ----------------------------------- |
| `runCommand` | `{ commandId: string }` | Fired when a user selects a command |

### ICommand

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

The standard component only consumes `placeholder`, `emptyText`, and `ariaLabel`. The `variant` selector is reserved for custom implementations registered through `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN`.

## COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN

```typescript
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '@smartsoft001/angular';
```

InjectionToken that allows replacing the default `CommandPaletteStandardComponent` with a custom implementation. Provide a `Type<CommandPaletteBaseComponent>` to override.

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
  input,
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
})
export class MyCustomCommandPaletteComponent extends CommandPaletteBaseComponent {
  // NgComponentOutlet passes 'cssClass' by canonical name, not the 'class' alias.
  override cssClass = input<string>('');

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

- declare `cssClass = input<string>('')` explicitly (no `class` alias) if the component is used via `NgComponentOutlet` through `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN`, because `NgComponentOutlet` passes inputs by canonical name (not by alias),
- call `selectCommand(id)` rather than emitting `runCommand` manually — it already sets `open.set(false)` for you,
- handle the `Escape` key and the global `Cmd+K` shortcut at the implementation level if you want native Cmd+K UX (the base does not bind any keyboard listeners).

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
  [options]="{ placeholder: 'Search commands…', emptyText: 'No results' }"
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

## File Locations

- Wrapper: `packages/shared/angular/src/lib/components/command-palette/command-palette.component.ts`
- Standard: `packages/shared/angular/src/lib/components/command-palette/standard/standard.component.ts`
- Base class: `packages/shared/angular/src/lib/components/command-palette/base/base.component.ts`
- Token: `packages/shared/angular/src/lib/shared.inectors.ts` (`COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN`)
- Interfaces: `packages/shared/angular/src/lib/models/interfaces.ts` (`ICommand`, `ICommandPaletteOptions`)
