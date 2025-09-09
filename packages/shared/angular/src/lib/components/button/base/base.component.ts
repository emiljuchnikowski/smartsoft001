import {
  Directive,
  input,
  InputSignal,
  signal,
  viewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';

import { DynamicComponentType, IButtonOptions } from '../../../models';

@Directive()
export abstract class ButtonBaseComponent {
  static smartType: DynamicComponentType = 'button';

  mode: WritableSignal<'default' | 'confirm'> = signal('default');

  options: InputSignal<IButtonOptions> = input.required<IButtonOptions>();
  disabled: InputSignal<boolean> = input<boolean>(false);

  contentTpl = viewChild<ViewContainerRef>('contentTpl');

  invoke(): void {
    if (!this.options()) return;

    if (this.options().confirm) {
      this.mode.set('confirm');
    } else {
      this.options().click();
    }
  }

  confirmInvoke(): void {
    if (!this.options()) return;
    this.options().click();
    this.mode.set('default');
  }

  confirmCancel(): void {
    if (!this.options()) return;
    this.mode.set('default');
  }
}
