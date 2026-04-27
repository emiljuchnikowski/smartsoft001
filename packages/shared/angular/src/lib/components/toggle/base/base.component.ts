import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
} from '@angular/core';

import { DynamicComponentType, IToggleOptions } from '../../../models';

@Directive()
export abstract class ToggleBaseComponent {
  static smartType: DynamicComponentType = 'toggle';

  value: ModelSignal<boolean> = model<boolean>(false);
  disabled: InputSignal<boolean> = input<boolean>(false);
  options: InputSignal<IToggleOptions | undefined> = input<IToggleOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  toggle(): void {
    if (this.disabled()) return;
    this.value.update((v) => !v);
  }
}
