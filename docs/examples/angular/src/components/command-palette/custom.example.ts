// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import {
  CommandPaletteBaseComponent,
  CommandPaletteComponent,
  COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
  ICommand,
  ICommandPaletteOptions,
} from '@smartsoft001/angular';

/**
 * A custom command palette built on `CommandPaletteBaseComponent`.
 *
 * The base owns the `commands` input, the `open` and `query` models, the
 * `filteredCommands` computed and `selectCommand()` / `close()`. Note that the
 * base binds no keyboard listeners: handling Escape or a global Cmd+K is the
 * implementation's job. Call `selectCommand()` rather than emitting
 * `runCommand` by hand, because it also closes the palette.
 */
@Component({
  selector: 'docs-custom-command-palette',
  template: `
    <div [class]="containerClasses()" [hidden]="!open()">
      <input
        type="search"
        class="docs-command-palette__search"
        [value]="query()"
        [attr.placeholder]="options()?.placeholder ?? null"
        (input)="onQueryChange($event)"
      />
      <ul role="listbox" class="docs-command-palette__list">
        @for (command of filteredCommands(); track command.id) {
          <li role="option" [attr.aria-selected]="false">
            <button type="button" (click)="selectCommand(command.id)">
              {{ command.label }}
            </button>
          </li>
        } @empty {
          <li class="docs-command-palette__empty">
            {{ options()?.emptyText ?? 'No results' }}
          </li>
        }
      </ul>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCommandPaletteComponent extends CommandPaletteBaseComponent {
  // The wrapper hands inputs to NgComponentOutlet by canonical name, so the
  // consumer's class arrives as `cssClass` rather than through the alias.
  override cssClass = input<string>('');

  containerClasses = computed(() =>
    ['docs-command-palette', this.cssClass()].filter(Boolean).join(' '),
  );

  onQueryChange(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}

/**
 * Registering the implementation against
 * `COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN` makes every
 * `<smart-command-palette>` in this injector render it instead of the standard
 * variation.
 */
@Component({
  selector: 'docs-command-palette-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommandPaletteComponent],
  providers: [
    {
      provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
      useValue: CustomCommandPaletteComponent,
    },
  ],
  template: `
    <smart-command-palette
      [commands]="commands"
      [options]="options"
      [open]="true"
    />
  `,
})
export class CommandPaletteCustomExampleComponent {
  commands: ICommand[] = [
    { id: 'new-file', label: 'New file', group: 'Files' },
    { id: 'open-settings', label: 'Open settings', group: 'Files' },
    { id: 'toggle-theme', label: 'Toggle theme', group: 'View' },
  ];

  options: ICommandPaletteOptions = {
    placeholder: 'Search commands…',
    emptyText: 'No results',
  };
}
// #endregion
