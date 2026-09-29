import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import {
  DynamicComponentType,
  IButtonGroupButton,
  IButtonGroupOptions,
} from '../../../models';

export interface IButtonGroupButtonClick {
  buttonId: string;
}

@Directive()
export abstract class ButtonGroupBaseComponent {
  static smartType: DynamicComponentType = 'button-group';

  buttons: InputSignal<IButtonGroupButton[]> = input<IButtonGroupButton[]>([]);
  options: InputSignal<IButtonGroupOptions | undefined> =
    input<IButtonGroupOptions>();
  selected: ModelSignal<string | undefined> = model<string | undefined>(
    undefined,
  );
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  buttonClick: OutputEmitterRef<IButtonGroupButtonClick> =
    output<IButtonGroupButtonClick>();

  select(id: string): void {
    this.selected.set(id);
    this.buttonClick.emit({ buttonId: id });
  }
}
