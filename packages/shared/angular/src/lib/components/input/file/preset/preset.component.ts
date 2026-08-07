import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../../pipes';
import { ButtonComponent } from '../../../button';
import { InputFileBaseComponent } from '../../base/file.component';

@Component({
  selector: 'smart-input-file-preset',
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
      <div [class]="groupClasses()">
        <input
          type="file"
          #inputObj
          [class]="inputClasses()"
          [attr.accept]="fieldOptions()?.possibilities"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
        />
        @if (control.value) {
          <div
            class="smart:flex smart:items-center smart:gap-x-2 smart:flex-wrap"
          >
            <smart-button [options]="showButtonOptions">
              {{ 'download' | translate }}
            </smart-button>
            <smart-button [options]="deleteButtonOptions">
              {{ 'delete' | translate }}
            </smart-button>
            <span
              class="smart:text-sm smart:text-gray-700 smart:dark:text-gray-300"
            >
              {{ control.value.fileName }}
            </span>
          </div>
        }
        @if (loading()) {
          <div
            class="smart:h-1 smart:w-full smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700"
          >
            <div
              class="smart:h-full smart:bg-blue-600 smart:dark:bg-blue-500"
              [style.width.%]="percent() ?? 0"
            ></div>
          </div>
        }
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ButtonComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFilePresetComponent<T>
  extends InputFileBaseComponent<T>
  implements OnInit
{
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  groupClasses = computed(() => {
    const classes = [
      'smart:mt-2',
      'smart:flex',
      'smart:flex-col',
      'smart:gap-y-2',
      'smart:w-full',
      'smart:max-w-sm',
    ];
    return classes.join(' ');
  });

  inputClasses = computed(() => {
    const classes = [
      // Preline default file input look (FRA-261)
      'smart:block',
      'smart:w-full',
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      'smart:rounded-lg',
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      'smart:focus:z-10',
      'smart:focus:outline-none',
      'smart:focus:border-blue-600',
      'smart:dark:focus:border-blue-500',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-600',
      'smart:dark:focus:ring-blue-500',
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
      // styled file-selector button
      'smart:file:bg-gray-100',
      'smart:dark:file:bg-gray-800',
      'smart:file:text-gray-700',
      'smart:dark:file:text-gray-200',
      'smart:file:border-0',
      'smart:file:me-4',
      'smart:file:py-3',
      'smart:file:px-4',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
