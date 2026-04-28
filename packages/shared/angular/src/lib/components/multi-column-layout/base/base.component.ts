import { Directive, input, InputSignal } from '@angular/core';

import {
  DynamicComponentType,
  IMultiColumnLayoutOptions,
} from '../../../models';

@Directive()
export abstract class MultiColumnLayoutBaseComponent {
  static smartType: DynamicComponentType = 'multi-column-layout';

  options: InputSignal<IMultiColumnLayoutOptions | undefined> =
    input<IMultiColumnLayoutOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
