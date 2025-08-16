import {
  Input,
  Directive,
  ChangeDetectorRef,
  WritableSignal,
} from '@angular/core';

import { IDetailOptions } from '../../../models';

@Directive()
export abstract class DetailBaseComponent<T> {
  private _options!: WritableSignal<IDetailOptions<T>>;

  @Input() set options(val: IDetailOptions<T>) {
    this._options.set(val);

    this.afterSetOptionsHandler();

    this.cd.detectChanges();
  }
  get options(): IDetailOptions<T> {
    return this._options();
  }

  constructor(protected cd: ChangeDetectorRef) {}

  protected afterSetOptionsHandler(){
    // no base functionality
  }
}
