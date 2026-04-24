import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { ButtonComponent } from '../../button';
import { InputFileBaseComponent } from '../base/file.component';

@Component({
  selector: 'smart-input-pdf',
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
        <smart-button [options]="addButtonOptions">
          {{ (control.value ? 'change' : 'add') | translate }}
        </smart-button>
        @if (control.value) {
          <smart-button [options]="showButtonOptions">
            {{ 'show' | translate }}
          </smart-button>
          <smart-button [options]="deleteButtonOptions">
            {{ 'delete' | translate }}
          </smart-button>
          <span
            class="smart:text-sm smart:text-gray-700 smart:dark:text-gray-300"
          >
            {{ control.value.fileName }}
          </span>
        }
        @if (loading()) {
          <div
            class="smart:h-1 smart:w-24 smart:overflow-hidden smart:rounded smart:bg-gray-200 smart:dark:bg-gray-700"
          >
            <div
              class="smart:h-full smart:bg-indigo-600"
              [style.width.%]="percent() ?? 0"
            ></div>
          </div>
        }
        <input type="file" accept=".pdf" [hidden]="true" #inputObj />
      </div>
    }
  `,
  imports: [ModelLabelPipe, TranslatePipe, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPdfComponent<T>
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
      'smart:items-center',
      'smart:gap-x-2',
      'smart:flex-wrap',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
