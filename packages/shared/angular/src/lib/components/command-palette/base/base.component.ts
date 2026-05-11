import {
  Directive,
  computed,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import {
  DynamicComponentType,
  ICommand,
  ICommandPaletteOptions,
} from '../../../models';

@Directive()
export abstract class CommandPaletteBaseComponent {
  static smartType: DynamicComponentType = 'command-palette';

  commands: InputSignal<ICommand[]> = input<ICommand[]>([]);
  open: ModelSignal<boolean> = model<boolean>(false);
  query: ModelSignal<string> = model<string>('');
  options: InputSignal<ICommandPaletteOptions | undefined> =
    input<ICommandPaletteOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  filteredCommands: Signal<ICommand[]> = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.commands();
    return this.commands().filter((c) => c.label.toLowerCase().includes(q));
  });

  runCommand: OutputEmitterRef<{ commandId: string }> = output<{
    commandId: string;
  }>();

  selectCommand(commandId: string): void {
    this.runCommand.emit({ commandId });
    this.open.set(false);
  }

  close(): void {
    this.open.set(false);
  }
}
