import {
  Directive,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';

import { DynamicComponentType, IBreadcrumbsOptions } from '../../../models';

export interface IBreadcrumbsItemClick {
  itemId: string;
}

@Directive()
export abstract class BreadcrumbsBaseComponent {
  static smartType: DynamicComponentType = 'breadcrumbs';

  options: InputSignal<IBreadcrumbsOptions | undefined> =
    input<IBreadcrumbsOptions>();
  cssClass: InputSignal<string> = input<string>('', { alias: 'class' });

  itemClick: OutputEmitterRef<IBreadcrumbsItemClick> =
    output<IBreadcrumbsItemClick>();
}
