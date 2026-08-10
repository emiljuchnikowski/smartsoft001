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
  selector: 'smart-input-currency-preset',
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
      <div class="smart:relative">
        <div [class]="adornmentClasses()" data-role="currency-adornment">
          <svg
            class="smart:shrink-0 smart:size-4 smart:text-gray-500 smart:dark:text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <input
          type="number"
          step="0.01"
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
export class InputCurrencyPresetComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
      'smart:mb-2',
      'smart:text-gray-800',
      'smart:dark:text-gray-200',
    ].join(' '),
  );

  adornmentClasses = computed(() =>
    [
      'smart:absolute',
      'smart:inset-y-0',
      'smart:start-0',
      'smart:flex',
      'smart:items-center',
      'smart:pointer-events-none',
      'smart:ps-4',
      'smart:peer-disabled:opacity-50',
      'smart:peer-disabled:pointer-events-none',
    ].join(' '),
  );

  inputClasses = computed(() => {
    const classes = [
      'smart:peer',
      'smart:py-2.5',
      'smart:sm:py-3',
      'smart:px-4',
      'smart:ps-11',
      'smart:block',
      'smart:w-full',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
      'smart:sm:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      'smart:focus:border-blue-600',
      'smart:dark:focus:border-blue-500',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
