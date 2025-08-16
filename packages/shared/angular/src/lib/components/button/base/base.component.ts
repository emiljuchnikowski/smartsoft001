import {
  Directive,
  Input,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';

import { DynamicComponentType, IButtonOptions } from '../../../models';

@Directive()
export abstract class ButtonBaseComponent {
  static smartType: DynamicComponentType = 'button';

  mode: WritableSignal<'default' | 'confirm'> = signal('default');

  @Input() options: IButtonOptions | null = null;
  @Input() disabled = false;

  @ViewChild('contentTpl', { read: ViewContainerRef, static: true })
  contentTpl: ViewContainerRef | null = null;

  invoke(): void {
    if (!this.options) return;

    if (this.options.confirm) {
      this.mode.set('confirm');
    } else {
      this.options.click();
    }
  }

  confirmInvoke(): void {
    if (!this.options) return;
    this.options.click();
    this.mode.set('default');
  }

  confirmCancel(): void {
    if (!this.options) return;
    this.mode.set('default');
  }
}
