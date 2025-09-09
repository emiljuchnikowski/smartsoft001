import {
  Directive,
  ChangeDetectorRef,
  inject,
  input,
  effect,
} from '@angular/core';

import { IDetailOptions } from '../../../models';

@Directive()
export abstract class DetailBaseComponent<T> {
  protected cd = inject(ChangeDetectorRef);

  options = input<IDetailOptions<T>>();

  constructor() {
    effect(() => {
      this.options(); //Track changes only
      this.afterSetOptionsHandler();
      this.cd.detectChanges();
    });
  }

  protected afterSetOptionsHandler() {
    // no base functionality
  }
}
