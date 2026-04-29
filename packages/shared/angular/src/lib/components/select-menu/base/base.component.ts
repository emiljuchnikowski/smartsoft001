import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
} from '@angular/core';

import { DynamicComponentType, ISelectMenuOptions } from '../../../models';

export type SelectMenuValue = string | number | null;

@Directive()
export abstract class SelectMenuBaseComponent {
  static smartType: DynamicComponentType = 'select-menu';

  value: ModelSignal<SelectMenuValue> = model<SelectMenuValue>(null);
  disabled: InputSignal<boolean> = input<boolean>(false);
  options: InputSignal<ISelectMenuOptions | undefined> =
    input<ISelectMenuOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  select(next: SelectMenuValue): void {
    if (this.disabled()) return;
    this.value.set(next);
  }
}
