import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IActionPanelOptions } from '../../../models';

export interface IActionPanelActionClick {
  actionId: string;
}

@Directive()
export abstract class ActionPanelBaseComponent {
  static smartType: DynamicComponentType = 'action-panel';

  options: InputSignal<IActionPanelOptions | undefined> =
    input<IActionPanelOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  actionClick: OutputEmitterRef<IActionPanelActionClick> =
    output<IActionPanelActionClick>();
}
