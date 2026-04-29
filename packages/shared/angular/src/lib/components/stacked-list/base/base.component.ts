import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IStackedListOptions } from '../../../models';

@Directive()
export abstract class StackedListBaseComponent {
  static smartType: DynamicComponentType = 'stacked-list';

  options: InputSignal<IStackedListOptions | undefined> =
    input<IStackedListOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
