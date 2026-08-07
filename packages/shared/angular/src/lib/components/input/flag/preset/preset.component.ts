import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-flag-preset',
  template: `
    @if (control) {
      <div [class]="groupClasses()" data-role="flag-group">
        <input
          type="checkbox"
          [formControl]="formControl"
          [class]="inputClasses()"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
          data-role="checkbox"
        />
        <label [class]="labelClasses()" data-role="label">
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFlagPresetComponent<T> extends InputBaseComponent<T> {
  groupClasses = computed(() =>
    ['smart:mt-2', 'smart:flex', 'smart:items-center', 'smart:gap-x-2'].join(
      ' ',
    ),
  );

  labelClasses = computed(() =>
    [
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  // Preline "Default checkbox" look translated to smart:-prefixed vanilla
  // Tailwind with explicit dark: variants.
  inputClasses = computed(() => {
    const classes = [
      'smart:shrink-0',
      'smart:size-4',
      'smart:bg-transparent',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-sm',
      'smart:shadow-2xs',
      'smart:text-blue-600',
      'smart:dark:text-blue-400',
      'smart:focus:ring-0',
      'smart:focus:ring-offset-0',
      'smart:checked:bg-blue-700',
      'smart:dark:checked:bg-blue-600',
      'smart:checked:border-blue-700',
      'smart:dark:checked:border-blue-600',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
