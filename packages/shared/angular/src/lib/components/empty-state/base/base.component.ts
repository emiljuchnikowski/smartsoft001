import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IEmptyStateOptions } from '../../../models';

export interface IEmptyStateActionClick {
  actionId: string;
}

export interface IEmptyStateItemClick {
  itemId: string;
}

@Directive()
export abstract class EmptyStateBaseComponent {
  static smartType: DynamicComponentType = 'empty-state';

  options: InputSignal<IEmptyStateOptions | undefined> =
    input<IEmptyStateOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  actionClick: OutputEmitterRef<IEmptyStateActionClick> =
    output<IEmptyStateActionClick>();
  itemClick: OutputEmitterRef<IEmptyStateItemClick> =
    output<IEmptyStateItemClick>();
}
