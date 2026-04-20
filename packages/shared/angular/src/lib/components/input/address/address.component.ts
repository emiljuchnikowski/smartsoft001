import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-address',
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
      <div [class]="groupClasses()" [formGroup]="formControlGroup">
        <div>
          <label
            class="smart:block smart:text-xs smart:text-gray-600 dark:smart:text-gray-400"
            >{{ 'MODEL.city' | translate }}</label
          >
          <input
            type="text"
            formControlName="city"
            [class]="fieldInputClasses"
          />
        </div>
        <div>
          <label
            class="smart:block smart:text-xs smart:text-gray-600 dark:smart:text-gray-400"
            >{{ 'MODEL.zipCode' | translate }}</label
          >
          <input
            type="text"
            formControlName="zipCode"
            [class]="fieldInputClasses"
          />
        </div>
        <div>
          <label
            class="smart:block smart:text-xs smart:text-gray-600 dark:smart:text-gray-400"
            >{{ 'MODEL.street' | translate }}</label
          >
          <input
            type="text"
            formControlName="street"
            [class]="fieldInputClasses"
          />
        </div>
        <div class="smart:grid smart:grid-cols-2 smart:gap-2">
          <div>
            <label
              class="smart:block smart:text-xs smart:text-gray-600 dark:smart:text-gray-400"
              >{{ 'MODEL.buildingNumber' | translate }}</label
            >
            <input
              type="text"
              formControlName="buildingNumber"
              [class]="fieldInputClasses"
            />
          </div>
          <div>
            <label
              class="smart:block smart:text-xs smart:text-gray-600 dark:smart:text-gray-400"
              >{{ 'MODEL.flatNumber' | translate }}</label
            >
            <input
              type="text"
              formControlName="flatNumber"
              [class]="fieldInputClasses"
            />
          </div>
        </div>
      </div>
    }
  `,
  imports: [TranslatePipe, ReactiveFormsModule, ModelLabelPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAddressComponent<T> extends InputBaseComponent<T> {
  fieldInputClasses =
    'smart:mt-1 smart:block smart:w-full smart:rounded-md smart:bg-white smart:px-2 smart:py-1 smart:text-sm smart:text-gray-900 smart:outline-1 smart:outline-gray-300 focus:smart:outline-2 focus:smart:outline-indigo-600 dark:smart:bg-white/5 dark:smart:text-white dark:smart:outline-white/10';

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'dark:smart:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:space-y-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
