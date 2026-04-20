import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ModelLabelPipe } from '../../../pipes';
import { DateEditComponent } from '../../date-edit';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date-with-edit',
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
      <smart-date-edit
        [class]="widgetClasses()"
        [formControl]="formControl"
      ></smart-date-edit>
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule, DateEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateWithEditComponent<T>
  extends InputBaseComponent<T>
  implements OnDestroy
{
  private _subscriptions = new Subscription();

  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:text-sm/6',
      'smart:font-medium',
      'smart:text-gray-900',
      'dark:smart:text-white',
    ].join(' '),
  );

  widgetClasses = computed(() => {
    const classes = ['smart:mt-2', 'smart:block', 'smart:w-full'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
