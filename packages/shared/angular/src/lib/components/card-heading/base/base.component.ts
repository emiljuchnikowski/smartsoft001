import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, ICardHeadingOptions } from '../../../models';

@Directive()
export abstract class CardHeadingBaseComponent {
  static smartType: DynamicComponentType = 'card-heading';

  options: InputSignal<ICardHeadingOptions | undefined> =
    input<ICardHeadingOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
