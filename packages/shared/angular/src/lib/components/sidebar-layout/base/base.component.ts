import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, ISidebarLayoutOptions } from '../../../models';

@Directive()
export abstract class SidebarLayoutBaseComponent {
  static smartType: DynamicComponentType = 'sidebar-layout';

  options: InputSignal<ISidebarLayoutOptions | undefined> =
    input<ISidebarLayoutOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
