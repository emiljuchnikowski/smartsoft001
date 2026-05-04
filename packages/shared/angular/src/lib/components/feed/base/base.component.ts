import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IFeedOptions } from '../../../models';

@Directive()
export abstract class FeedBaseComponent {
  static smartType: DynamicComponentType = 'feed';

  options: InputSignal<IFeedOptions | undefined> = input<IFeedOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
