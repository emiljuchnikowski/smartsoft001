import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ModelLabelPipe } from '../../../../pipes';
import { DateEditComponent } from '../../../date-edit';
import { InputBaseComponent } from '../../base/base.component';

/**
 * Preline "preset" variation of the date-with-edit input field (FRA-257).
 *
 * Behaves like the date preset (`smart-input-date-preset`) but, like the
 * existing `InputDateWithEditComponent`, renders the reusable
 * `<smart-date-edit>` widget instead of a native `type="date"` control so the
 * user gets the "edit buttons" datepicker. The widget is rendered with
 * `variant="preset"`, which is its own translated-Preline look (calendar
 * popover driven by Angular signals — the Preline JS plugin is not installed;
 * see the date-edit preset for that simplification). Only the label here is
 * styled to the Preline input look.
 */
@Component({
  selector: 'smart-input-date-with-edit-preset',
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
        [variant]="'preset'"
        [class]="widgetClasses()"
        [formControl]="formControl"
      ></smart-date-edit>
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule, DateEditComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateWithEditPresetComponent<T>
  extends InputBaseComponent<T>
  implements OnDestroy
{
  private _subscriptions = new Subscription();

  labelClasses = computed(() =>
    [
      // Preline label: block mb-2 text-sm font-medium text-foreground
      'smart:block',
      'smart:mb-2',
      'smart:text-sm',
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._subscriptions) {
      this._subscriptions.unsubscribe();
    }
  }
}
