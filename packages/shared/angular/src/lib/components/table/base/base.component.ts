import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, ITableOptions } from '../../../models';

@Directive()
export abstract class TableBaseComponent {
  static smartType: DynamicComponentType = 'table';

  options: InputSignal<ITableOptions | undefined> = input<ITableOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
