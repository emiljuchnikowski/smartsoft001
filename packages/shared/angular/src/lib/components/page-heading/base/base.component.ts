import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IPageHeadingOptions } from '../../../models';

@Directive()
export abstract class PageHeadingBaseComponent {
  static smartType: DynamicComponentType = 'page-heading';

  options: InputSignal<IPageHeadingOptions | undefined> =
    input<IPageHeadingOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
