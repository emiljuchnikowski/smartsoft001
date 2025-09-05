import { ChangeDetectorRef, Input, Directive, Signal } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { IFieldOptions } from '@smartsoft001/models';

import { InputOptions } from '../../../models';
import { BaseComponent } from '../../base';

@Directive()
export abstract class InputBaseComponent<T> extends BaseComponent {
  internalOptions!: InputOptions<T>;
  control!: UntypedFormControl | UntypedFormArray | UntypedFormGroup;
  required!: boolean;

  possibilities!: Signal<Array<{ id: any; text: string }> | null>;

  @Input() fieldOptions: IFieldOptions | undefined;
  @Input() set options(val: InputOptions<T>) {
    if (!val) return;

    this.internalOptions = val;
    this.control = this.internalOptions.control;

    if (val?.possibilities) {
      this.possibilities = val.possibilities;
    }

    this.setRequired();

    this.afterSetOptionsHandler();

    this.cd.detectChanges();
  }

  protected constructor(protected cd: ChangeDetectorRef) {
    super();
  }

  protected afterSetOptionsHandler() {
    // No base functionality
  }

  private setRequired(): void {
    const validator = this.control?.validator
      ? this.control.validator({} as AbstractControl)
      : null;
    this.required = validator && validator['required'];
  }

  get formControl(): UntypedFormControl {
    return this.control as UntypedFormControl;
  }

  get formControlArray(): UntypedFormArray {
    return this.control as UntypedFormArray;
  }

  get formControlGroup(): UntypedFormGroup {
    return this.control as UntypedFormGroup;
  }
}
