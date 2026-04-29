import { Directive, input, InputSignal } from '@angular/core';

import { DynamicComponentType, IStatsOptions } from '../../../models';

@Directive()
export abstract class StatsBaseComponent {
  static smartType: DynamicComponentType = 'stats';

  options: InputSignal<IStatsOptions | undefined> = input<IStatsOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
}
