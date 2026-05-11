import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IContainerOptions } from '../../../models';

@Directive()
export abstract class ContainerBaseComponent {
  static smartType: DynamicComponentType = 'container';

  options: InputSignal<IContainerOptions | undefined> =
    input<IContainerOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
