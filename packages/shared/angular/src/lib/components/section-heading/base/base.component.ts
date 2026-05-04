import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, ISectionHeadingOptions } from '../../../models';

@Directive()
export abstract class SectionHeadingBaseComponent {
  static smartType: DynamicComponentType = 'section-heading';

  options: InputSignal<ISectionHeadingOptions | undefined> =
    input<ISectionHeadingOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
