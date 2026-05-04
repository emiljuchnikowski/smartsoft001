import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IStackedLayoutOptions } from '../../../models';

@Directive()
export abstract class StackedLayoutBaseComponent {
  static smartType: DynamicComponentType = 'stacked-layout';

  options: InputSignal<IStackedLayoutOptions | undefined> =
    input<IStackedLayoutOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
