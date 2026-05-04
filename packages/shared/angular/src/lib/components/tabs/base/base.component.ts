import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, ITabsOptions } from '../../../models';

export interface ITabChange {
  tabId: string;
}

@Directive()
export abstract class TabsBaseComponent {
  static smartType: DynamicComponentType = 'tabs';

  options: InputSignal<ITabsOptions | undefined> = input<ITabsOptions>();
  selectedId: ModelSignal<string | null> = model<string | null>(null);
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  tabChange: OutputEmitterRef<ITabChange> = output<ITabChange>();
}
