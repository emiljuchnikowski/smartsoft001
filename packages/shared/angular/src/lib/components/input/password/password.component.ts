import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { PasswordStrengthComponent } from '../../password-strength';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-password',
  template: `
    @if (control) {
      <label [class]="labelClasses()">
        {{
          $safeNavigationMigration(control?.parent?.value)
            | smartModelLabel
              : internalOptions.fieldKey
              : $safeNavigationMigration(internalOptions?.model?.constructor)
        }}
        @if (required) {
          <span class="smart:text-red-500 smart:ml-0.5">*</span>
        }
      </label>
      <input
        type="password"
        [formControl]="formControl"
        [class]="inputClasses()"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
        (blur)="focus = false"
        (focus)="focus = true"
      />
      @if (fieldOptions()?.possibilities?.strength) {
        <smart-password-strength
          [passwordToCheck]="control.value"
          [showHint]="focus"
          (passwordStrength)="onChangePasswordStrength($event)"
        ></smart-password-strength>
      }
    }
  `,
  imports: [ReactiveFormsModule, ModelLabelPipe, PasswordStrengthComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordComponent<T> extends InputBaseComponent<T> {
  valid = true;
  focus = false;

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
      'smart:placeholder:text-gray-400',
      'smart:focus:outline-2',
      'smart:focus:outline-offset-2',
      'smart:focus:outline-indigo-600',
      'smart:sm:text-sm/6',
      'smart:dark:bg-white/5',
      'smart:dark:text-white',
      'smart:dark:outline-white/10',
      'smart:dark:placeholder:text-gray-500',
      'smart:dark:focus:outline-indigo-500',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  override afterSetOptionsHandler() {
    this.control.addValidators(() => {
      if (!this.valid) {
        return {
          passwordStrength: true,
        };
      }

      return null;
    });

    this.control.updateValueAndValidity({ onlySelf: true });
  }

  onChangePasswordStrength(valid: boolean) {
    this.valid = valid;
    if (this.valid) {
      if (this.control.errors?.['passwordStrength']) {
        this.control.setErrors(
          Object.keys(this.control.errors).length === 1
            ? null
            : { ...this.control.errors, passwordStrength: null },
        );
      }
    } else {
      const errors = this.control.errors
        ? { ...this.control.errors, passwordStrength: true }
        : { passwordStrength: true };
      this.control.setErrors(errors);
    }

    this.control.updateValueAndValidity({ onlySelf: true });
  }
}
