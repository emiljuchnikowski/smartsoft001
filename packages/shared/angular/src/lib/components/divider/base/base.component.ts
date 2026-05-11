import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IDividerOptions } from '../../../models';

@Directive()
export abstract class DividerBaseComponent {
  static smartType: DynamicComponentType = 'divider';

  label: InputSignal<string | undefined> = input<string>();
  iconName: InputSignal<string | undefined> = input<string>();
  title: InputSignal<string | undefined> = input<string>();
  actionLabel: InputSignal<string | undefined> = input<string>();
  options: InputSignal<IDividerOptions | undefined> = input<IDividerOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  actionClick: OutputEmitterRef<void> = output<void>();
}
