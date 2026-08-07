import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';

import { ModelLabelPipe } from '../../../../pipes';
import { InputBaseComponent } from '../../base/base.component';

interface DateRangeValue {
  start?: string;
  end?: string;
}

/**
 * Preline "preset" variation of the date-range input field (FRA-256).
 *
 * The Linear issue specifies the Preline "datepicker (range)" advanced control,
 * which relies on `Vanilla Calendar Pro` + the Preline datepicker JS plugin
 * (`data-hs-datepicker`, `hs-datepicker`). Neither dependency is installed in this
 * library, so this preset renders two native `type="date"` controls (start / end)
 * styled to match the Preline datepicker input look. The control value stays the
 * canonical `IDateRange` shape (`{ start, end }`, `YYYY-MM-DD`). See GAPS in the
 * implementation report for the dropped JS behaviour (single popover calendar with
 * dual-month range selection, preset ranges, min/max constraints).
 */
@Component({
  selector: 'smart-input-date-range-preset',
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
      <div [class]="wrapperClasses()">
        <input
          type="date"
          data-role="date-range-start"
          [class]="inputClasses()"
          [value]="range().start ?? ''"
          [attr.autofocus]="fieldOptions()?.focused ? true : null"
          (change)="onStartChange($any($event.target).value)"
          (blur)="control.markAsTouched()"
        />
        <span [class]="separatorClasses()">&ndash;</span>
        <input
          type="date"
          data-role="date-range-end"
          [class]="inputClasses()"
          [value]="range().end ?? ''"
          (change)="onEndChange($any($event.target).value)"
          (blur)="control.markAsTouched()"
        />
      </div>
    }
  `,
  imports: [ModelLabelPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateRangePresetComponent<T> extends InputBaseComponent<T> {
  private subscribed = false;

  range = signal<DateRangeValue>({});

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

  wrapperClasses = computed(() => {
    const classes = ['smart:flex', 'smart:items-center', 'smart:gap-x-2'];
    const extra = this.cssClass();
    if (extra) classes.push(extra);
    return classes.join(' ');
  });

  separatorClasses = computed(() =>
    ['smart:text-gray-500', 'smart:dark:text-gray-400'].join(' '),
  );

  inputClasses = computed(() =>
    [
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
    ].join(' '),
  );

  protected override afterSetOptionsHandler(): void {
    this.range.set(this.normalize(this.control?.value));

    if (this.subscribed) return;
    this.subscribed = true;

    this.control?.valueChanges
      .pipe(this.takeUntilDestroy)
      .subscribe((value) => this.range.set(this.normalize(value)));
  }

  onStartChange(start: string): void {
    this.commit({ ...this.range(), start });
  }

  onEndChange(end: string): void {
    this.commit({ ...this.range(), end });
  }

  private commit(next: DateRangeValue): void {
    this.range.set(next);
    this.control.setValue(this.toControlValue(next));
    this.control.markAsDirty();
  }

  private normalize(value: unknown): DateRangeValue {
    if (value && typeof value === 'object') {
      const { start, end } = value as DateRangeValue;
      return { start: start ?? '', end: end ?? '' };
    }
    return { start: '', end: '' };
  }

  private toControlValue(value: DateRangeValue): DateRangeValue | null {
    if (!value.start && !value.end) return null;
    return value;
  }
}
