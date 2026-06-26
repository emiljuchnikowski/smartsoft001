import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import {
  getInputPhoneNumberPlPresetClasses,
  getInputPhoneNumberPlPresetLabelClasses,
  getInputPhoneNumberPlPresetPrefixClasses,
  getInputPhoneNumberPlPresetWrapperClasses,
} from './preset-classes.util';
import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-phone-number-pl-preset',
  template: `
    @if (control) {
      <label [class]="labelClasses()">
        {{
          control?.parent?.value
            | smartModelLabel
              : internalOptions.fieldKey
              : internalOptions?.model?.constructor
        }}
        @if (required) {
          <span class="smart:text-red-500 smart:ml-0.5">*</span>
        }
      </label>
      <div [class]="wrapperClasses()">
        <div [class]="prefixClasses()" data-role="phone-prefix">+48</div>
        <input
          type="tel"
          [formControl]="formControl"
          [class]="inputClasses()"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
        />
      </div>
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneNumberPlPresetComponent<
  T,
> extends InputBaseComponent<T> {
  labelClasses = computed(() => getInputPhoneNumberPlPresetLabelClasses());

  wrapperClasses = computed(() => getInputPhoneNumberPlPresetWrapperClasses());

  prefixClasses = computed(() => getInputPhoneNumberPlPresetPrefixClasses());

  inputClasses = computed(() =>
    getInputPhoneNumberPlPresetClasses(this.cssClass()),
  );

  override afterSetOptionsHandler() {
    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push(Validators.minLength(9));
    validators.push(Validators.maxLength(9));

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
