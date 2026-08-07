import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  getInputPhoneNumberPresetClasses,
  getInputPhoneNumberPresetLabelClasses,
} from './preset-classes.util';
import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-phone-number-preset',
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
      <input
        type="tel"
        [formControl]="formControl"
        [class]="inputClasses()"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
      />
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneNumberPresetComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() => getInputPhoneNumberPresetLabelClasses());

  inputClasses = computed(() =>
    getInputPhoneNumberPresetClasses(this.cssClass()),
  );
}
