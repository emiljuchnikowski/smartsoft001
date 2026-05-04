import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-phone-number-pl',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneNumberPlComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  inputClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:block',
      'smart:w-full',
      'smart:rounded-md',
      'smart:bg-white',
      'smart:px-3',
      'smart:py-1.5',
      'smart:text-base',
      'smart:text-gray-900',
      'smart:outline-1',
      '-outline-offset-1',
      'smart:outline-gray-300',
      'placeholder:smart:text-gray-400',
      'focus:smart:outline-2',
      'focus:smart:outline-offset-2',
      'focus:smart:outline-indigo-600',
      'sm:smart:text-sm/6',
      'smart:dark:bg-white/5',
      'smart:dark:text-white',
      'smart:dark:outline-white/10',
      'dark:placeholder:smart:text-gray-500',
      'dark:focus:smart:outline-indigo-500',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  override afterSetOptionsHandler() {
    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push(Validators.minLength(9));
    validators.push(Validators.maxLength(9));

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
