import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

/**
 * Preline "preset" variation of the date input field (FRA-255).
 *
 * The Linear issue specifies the Preline advanced datepicker, which relies on
 * `Vanilla Calendar Pro` + the Preline datepicker JS plugin (`data-hs-datepicker`,
 * `hs-datepicker`). Neither is installed in this library, so this preset renders a
 * native `type="date"` control styled to match the Preline datepicker input look
 * instead. See GAPS in the implementation report for the dropped JS behaviour
 * (custom-select calendar, multiple/ranged selection, time picker).
 */
@Component({
  selector: 'smart-input-date-preset',
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
      <input
        type="date"
        [formControl]="formControl"
        [class]="inputClasses()"
        [attr.autofocus]="fieldOptions()?.focused ? true : null"
      />
    }
  `,
  imports: [ModelLabelPipe, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDatePresetComponent<T>
  extends InputBaseComponent<T>
  implements OnInit
{
  labelClasses = computed(() =>
    [
      'smart:block',
      'smart:mb-2',
      'smart:text-sm',
      'smart:font-medium',
      'smart:text-gray-900',
      'smart:dark:text-white',
    ].join(' '),
  );

  inputClasses = computed(() => {
    const classes = [
      // Preline: py-3 px-4 block w-full
      'smart:py-3',
      'smart:px-4',
      'smart:block',
      'smart:w-full',
      // Preline: bg-layer
      'smart:bg-white',
      'smart:dark:bg-gray-800',
      // Preline: border-layer-line
      'smart:border',
      'smart:border-gray-200',
      'smart:dark:border-gray-700',
      // Preline: rounded-lg sm:text-sm
      'smart:rounded-lg',
      'smart:sm:text-sm',
      // Preline: text-foreground
      'smart:text-gray-900',
      'smart:dark:text-white',
      // Preline: placeholder:text-muted-foreground-1
      'smart:placeholder:text-gray-500',
      'smart:dark:placeholder:text-gray-400',
      // Preline: focus:border-primary-focus focus:ring-primary-focus
      'smart:focus:border-blue-700',
      'smart:dark:focus:border-blue-600',
      'smart:focus:ring-1',
      'smart:focus:ring-blue-700',
      'smart:dark:focus:ring-blue-600',
      // Preline: disabled:opacity-50 disabled:pointer-events-none
      'smart:disabled:opacity-50',
      'smart:disabled:pointer-events-none',
    ];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  ngOnInit() {
    this.control?.valueChanges
      .pipe(this.takeUntilDestroy)
      .subscribe((value) => {
        if (value && value.length !== 10) {
          // TODO: re-enable moment
          // this.control.setValue(moment(value).format('YYYY-MM-DD'));
        }
      });
  }
}
