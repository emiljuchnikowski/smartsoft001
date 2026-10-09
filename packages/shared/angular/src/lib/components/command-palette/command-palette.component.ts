import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { CommandPaletteStandardComponent } from './standard/standard.component';
import { ICommand, ICommandPaletteOptions } from '../../models';
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';
import { forwardOutletOutputs } from '../base/forward-outlet-outputs';
import { outletInputs } from '../base/outlet-inputs';

@Component({
  selector: 'smart-command-palette',
  template: `
    @if (componentType()) {
      <ng-container
        *ngComponentOutlet="componentType(); inputs: componentInputs()"
      />
    } @else {
      <smart-command-palette-standard
        [commands]="commands()"
        [(open)]="open"
        [(query)]="query"
        [options]="options()"
        [class]="cssClass()"
        (runCommand)="runCommand.emit($event)"
      />
    }
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [CommandPaletteStandardComponent, NgComponentOutlet],
  host: { class: 'smart:contents' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  private injectedComponent = inject(COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN, {
    optional: true,
  });

  commands = input<ICommand[]>([]);
  open = model<boolean>(false);
  query = model<string>('');
  options = input<ICommandPaletteOptions>();
  cssClass = input<string>('', { alias: 'class' });

  runCommand = output<{ commandId: string }>();

  componentType = computed(() => this.injectedComponent ?? null);

  componentInputs = computed(() =>
    outletInputs(this.componentType(), {
      commands: this.commands(),
      open: this.open(),
      query: this.query(),
      options: this.options(),
      cssClass: this.cssClass(),
    }),
  );

  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    forwardOutletOutputs(this.outlet, {
      open: this.open,
      query: this.query,
      runCommand: this.runCommand,
    });
  }
}
