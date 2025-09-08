import { ChangeDetectorRef, Input, Directive, Signal, input, inject, effect } from '@angular/core';
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
  protected cd = inject(ChangeDetectorRef);

  internalOptions!: InputOptions<T>;
  control!: UntypedFormControl | UntypedFormArray | UntypedFormGroup;
  required!: boolean;

  possibilities!: Signal<Array<{ id: any; text: string }> | null>;

  fieldOptions = input.required<IFieldOptions | undefined>();

  options = input<InputOptions<T> | undefined>(undefined);

  constructor() {
    super();

    effect(() => {
      const options = this.options();
      if (!options) return;

      this.internalOptions = options;
      this.control = this.internalOptions.control;

      if (options?.possibilities) {
        this.possibilities = options.possibilities;
      }

      this.setRequired();

      this.afterSetOptionsHandler();

      this.cd.detectChanges();
    });
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
