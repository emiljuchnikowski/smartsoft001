import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  IModalAction,
  IModalOptions,
} from '../../../models';

@Directive()
export abstract class ModalBaseComponent {
  static smartType: DynamicComponentType = 'modal';

  open: ModelSignal<boolean> = model<boolean>(false);
  title: InputSignal<string | undefined> = input<string>();
  description: InputSignal<string | undefined> = input<string>();
  actions: InputSignal<IModalAction[]> = input<IModalAction[]>([]);
  options: InputSignal<IModalOptions | undefined> = input<IModalOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  actionClick: OutputEmitterRef<{ actionId: string }> = output<{
    actionId: string;
  }>();
  closed: OutputEmitterRef<void> = output<void>();

  invokeAction(actionId: string): void {
    this.actionClick.emit({ actionId });
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }
}
