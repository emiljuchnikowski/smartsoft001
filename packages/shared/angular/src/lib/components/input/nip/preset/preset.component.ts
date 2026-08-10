import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NipService } from '@smartsoft001/utils';

import {
  getInputNipPresetClasses,
  getInputNipPresetLabelClasses,
} from './preset-classes.util';
import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-nip-preset',
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
        type="text"
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
export class InputNipPresetComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() => getInputNipPresetLabelClasses());

  inputClasses = computed(() => getInputNipPresetClasses(this.cssClass()));

  override afterSetOptionsHandler() {
    const validators = this.control.validator ? [this.control.validator] : [];

    validators.push((c) => {
      if (c.value && NipService.isInvalid(c.value)) {
        return {
          invalidNip: true,
        };
      }

      return null;
    });

    this.control.setValidators(validators);

    this.control.updateValueAndValidity();
  }
}
