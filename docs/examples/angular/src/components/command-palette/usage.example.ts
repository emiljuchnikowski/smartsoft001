// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  ButtonComponent,
  CommandPaletteComponent,
  IButtonOptions,
  ICommand,
  ICommandPaletteOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-command-palette-usage-example',
  imports: [CommandPaletteComponent, ButtonComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteUsageExampleComponent {
  readonly commands: ICommand[] = [
    { id: 'new-project', label: 'New project' },
    { id: 'invite-member', label: 'Invite team member' },
    { id: 'open-settings', label: 'Open settings' },
  ];

  readonly options: ICommandPaletteOptions = {
    placeholder: 'Search commands...',
    emptyText: 'No commands found.',
    ariaLabel: 'Search commands',
  };

  readonly open = signal(false);
  readonly query = signal('');
  readonly lastCommand = signal<string | null>(null);

  readonly openButton: IButtonOptions = {
    click: () => this.open.set(true),
  };

  onRunCommand({ commandId }: { commandId: string }): void {
    this.lastCommand.set(commandId);
  }
}
// #endregion
