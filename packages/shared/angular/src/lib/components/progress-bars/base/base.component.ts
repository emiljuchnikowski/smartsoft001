import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IProgressBarsOptions } from '../../../models';

export interface IProgressStepClick {
  stepId: string;
}

@Directive()
export abstract class ProgressBarsBaseComponent {
  static smartType: DynamicComponentType = 'progress-bars';

  options: InputSignal<IProgressBarsOptions | undefined> =
    input<IProgressBarsOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  stepClick: OutputEmitterRef<IProgressStepClick> =
    output<IProgressStepClick>();
}
