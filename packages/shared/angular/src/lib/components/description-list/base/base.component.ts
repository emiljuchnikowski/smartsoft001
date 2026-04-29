import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IDescriptionListOptions } from '../../../models';

@Directive()
export abstract class DescriptionListBaseComponent {
  static smartType: DynamicComponentType = 'description-list';

  options: InputSignal<IDescriptionListOptions | undefined> =
    input<IDescriptionListOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
