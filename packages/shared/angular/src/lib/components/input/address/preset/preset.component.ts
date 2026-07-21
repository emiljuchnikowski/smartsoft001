import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

@Component({
  selector: 'smart-input-address-preset',
  template: `
    @if (control) {
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
      <div
        [class]="gridClasses()"
        [formGroup]="formControlGroup"
        data-role="address-grid"
      >
        <div class="smart:sm:col-span-2">
          <label [class]="subLabelClasses">{{
            'MODEL.street' | translate
          }}</label>
          <input
            type="text"
            formControlName="street"
            [class]="fieldInputClasses"
            data-role="street"
          />
        </div>
        <div>
          <label [class]="subLabelClasses">{{
            'MODEL.buildingNumber' | translate
          }}</label>
          <input
            type="text"
            formControlName="buildingNumber"
            [class]="fieldInputClasses"
            data-role="buildingNumber"
          />
        </div>
        <div>
          <label [class]="subLabelClasses">{{
            'MODEL.flatNumber' | translate
          }}</label>
          <input
            type="text"
            formControlName="flatNumber"
            [class]="fieldInputClasses"
            data-role="flatNumber"
          />
        </div>
        <div>
          <label [class]="subLabelClasses">{{
            'MODEL.zipCode' | translate
          }}</label>
          <input
            type="text"
            formControlName="zipCode"
            [class]="fieldInputClasses"
            data-role="zipCode"
          />
        </div>
        <div>
          <label [class]="subLabelClasses">{{
            'MODEL.city' | translate
          }}</label>
          <input
            type="text"
            formControlName="city"
            [class]="fieldInputClasses"
            data-role="city"
          />
        </div>
      </div>
    }
  `,
  imports: [TranslatePipe, ReactiveFormsModule, ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddressPresetComponent<T> extends InputBaseComponent<T> {
  subLabelClasses =
    'smart:block smart:text-xs smart:font-medium smart:text-gray-500 smart:dark:text-gray-400 smart:mb-1';

  // Preline text-input look reused for every address sub-field.
  fieldInputClasses =
    'smart:block smart:w-full smart:py-2.5 smart:sm:py-3 smart:px-4 smart:bg-white smart:dark:bg-gray-800 smart:border smart:border-gray-200 smart:dark:border-gray-700 smart:rounded-lg smart:sm:text-sm smart:text-gray-900 smart:dark:text-white smart:focus:border-blue-700 smart:dark:focus:border-blue-600 smart:focus:ring-blue-700 smart:dark:focus:ring-blue-600 smart:disabled:opacity-50 smart:disabled:pointer-events-none';

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  gridClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:grid',
      'smart:grid-cols-1',
      'smart:sm:grid-cols-2',
      'smart:gap-3',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
