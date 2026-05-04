import {
  Directive,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, INavbarOptions } from '../../../models';

export interface INavbarItemClick {
  itemId: string;
}

@Directive()
export abstract class NavbarBaseComponent {
  static smartType: DynamicComponentType = 'navbar';

  options: InputSignal<INavbarOptions | undefined> = input<INavbarOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });
  mobileMenuOpen: ModelSignal<boolean> = model<boolean>(false);

  itemClick: OutputEmitterRef<INavbarItemClick> = output<INavbarItemClick>();
}
