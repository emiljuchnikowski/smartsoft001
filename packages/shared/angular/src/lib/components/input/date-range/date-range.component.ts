import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { DateRangeComponent } from '../../date-range';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date-range',
  template: `
    @if (control && internalOptions) {
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
      <smart-date-range
        [class]="widgetClasses()"
        (click)="control.markAsTouched()"
        [ngModel]="control.value"
        (ngModelChange)="control.setValue($event); control.markAsDirty()"
      ></smart-date-range>
    }
  `,
  imports: [DateRangeComponent, ModelLabelPipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangeComponent<T> extends InputBaseComponent<T> {
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  widgetClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:block', 'smart:w-full'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });
}
