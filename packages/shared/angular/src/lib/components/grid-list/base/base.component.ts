import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IGridListOptions } from '../../../models';

@Directive()
export abstract class GridListBaseComponent {
  static smartType: DynamicComponentType = 'grid-list';

  options: InputSignal<IGridListOptions | undefined> =
    input<IGridListOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
