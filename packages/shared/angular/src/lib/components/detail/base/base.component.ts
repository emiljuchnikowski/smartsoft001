import { Input, Directive, ChangeDetectorRef } from "@angular/core";

import { IDetailOptions } from "../../../models/interfaces";

@Directive()
export abstract class DetailBaseComponent<T> {
  private _options!: IDetailOptions<T>;

  @Input() set options(val: IDetailOptions<T>) {
    this._options = val;

    this.afterSetOptionsHandler();

    this.cd.detectChanges();
  }
  get options(): IDetailOptions<T> {
    return this._options;
  }

  constructor(protected cd: ChangeDetectorRef) {}

  protected afterSetOptionsHandler(): void {}
}
