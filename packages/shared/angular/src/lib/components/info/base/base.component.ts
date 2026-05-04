import { Directive, input, InputSignal, signal } from '@angular/core';

import { DynamicComponentType, IInfoOptions } from '../../../models';

@Directive()
export abstract class InfoBaseComponent {
  static smartType: DynamicComponentType = 'info';

  options: InputSignal<IInfoOptions> = input.required<IInfoOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
