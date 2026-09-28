// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  CommandPaletteComponent,
  ICommand,
  ICommandPaletteOptions,
} from '@smartsoft001/angular';

@Component({
  selector: 'docs-command-palette-usage-example',
  imports: [CommandPaletteComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteUsageExampleComponent {
  readonly commands: ICommand[] = [
    { id: 'new-project', label: 'New project', group: 'Projects' },
    { id: 'invite-member', label: 'Invite team member', group: 'Team' },
    { id: 'open-settings', label: 'Open settings', group: 'Account' },
  ];

  readonly options: ICommandPaletteOptions = {
    variant: 'simple',
    placeholder: 'Search commands...',
    emptyText: 'No commands found.',
    ariaLabel: 'Command palette',
  };

  readonly open = signal(false);
  readonly query = signal('');
  readonly lastCommand = signal<string | null>(null);

  onRunCommand({ commandId }: { commandId: string }): void {
    this.lastCommand.set(commandId);
  }
}
// #endregion
