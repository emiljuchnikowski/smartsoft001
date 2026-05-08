import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IListContainerOptions } from '../../../models';

@Directive()
export abstract class ListContainerBaseComponent {
  static smartType: DynamicComponentType = 'list-container';

  options: InputSignal<IListContainerOptions | undefined> =
    input<IListContainerOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
