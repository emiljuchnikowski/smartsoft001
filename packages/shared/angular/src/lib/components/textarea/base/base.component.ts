import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, ITextareaOptions } from '../../../models';

export interface ITextareaActionClick {
  actionId: string;
  value: string;
}

@Directive()
export abstract class TextareaBaseComponent {
  static smartType: DynamicComponentType = 'textarea';

  value: ModelSignal<string> = model<string>('');
  placeholder: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);
  options: InputSignal<ITextareaOptions | undefined> =
    input<ITextareaOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  actionClick: OutputEmitterRef<ITextareaActionClick> =
    output<ITextareaActionClick>();
}
