import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-flag',
  template: `
    @if (control) {
      <div class="smart:flex smart:items-center smart:gap-x-2">
        <input
          type="checkbox"
          [formControl]="formControl"
          [class]="inputClasses()"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
        />
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
      </div>
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFlagComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'dark:smart:text-white',
    ].join(' '),
  );

  inputClasses = computed(() => {
    const classes = [
      'smart:h-4',
      'smart:w-4',
      'smart:rounded',
      'smart:border-gray-300',
      'smart:text-indigo-600',
      'focus:smart:ring-indigo-500',
      'dark:smart:border-gray-600',
      'dark:smart:bg-white/5',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
