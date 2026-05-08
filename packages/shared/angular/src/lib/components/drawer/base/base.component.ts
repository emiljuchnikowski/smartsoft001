import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IDrawerOptions } from '../../../models';

@Directive()
export abstract class DrawerBaseComponent {
  static smartType: DynamicComponentType = 'drawer';

  open: ModelSignal<boolean> = model<boolean>(false);
  title: InputSignal<string | undefined> = input<string>();
  options: InputSignal<IDrawerOptions | undefined> = input<IDrawerOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  closed: OutputEmitterRef<void> = output<void>();

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
