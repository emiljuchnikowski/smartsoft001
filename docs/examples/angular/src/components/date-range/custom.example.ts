// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateRangeBaseComponent } from '@smartsoft001/angular';
import { IDateRange } from '@smartsoft001/domain-core';

/**
 * A custom range picker built on `DateRangeBaseComponent`.
 *
 * The base owns the value (`ngModel` / `value`), the open state (`isOpen`,
 * `onClick`, `onModalDismiss`), the reset (`onClear`) and the
 * `ControlValueAccessor` contract. Here the full calendar modal is replaced
 * with a short list of preset ranges.
 */
@Component({
  selector: 'docs-custom-date-range',
  template: `
    <div class="docs-date-range">
      <button
        type="button"
        class="docs-date-range__trigger"
        (click)="onClick()"
      >
        @if (value) {
          {{ value.start }} - {{ value.end }}
        } @else {
          Pick a range
        }
      </button>

      @if (value) {
        <button
          type="button"
          class="docs-date-range__clear"
          (click)="onClear()"
        >
          Clear
        </button>
      }

      @if (isOpen()) {
        <ul class="docs-date-range__panel">
          <li>
            <button
              type="button"
              (click)="apply({ start: '2026-04-01', end: '2026-04-07' })"
            >
              First week of April
            </button>
          </li>
          <li>
            <button
              type="button"
              (click)="apply({ start: '2026-04-01', end: '2026-04-30' })"
            >
              Whole of April
            </button>
          </li>
          <li>
            <button type="button" (click)="onModalDismiss()">Cancel</button>
          </li>
        </ul>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateRangeComponent),
      multi: true,
    },
  ],
})
export class CustomDateRangeComponent extends DateRangeBaseComponent {
  /**
   * The base also exposes `onModalApply()`, but that one expects a
   * `CalendarState` carrying moment objects produced by the built-in calendar.
   * A picker that does not use that calendar writes the value itself and keeps
   * everything else the base provides.
   */
  apply(range: IDateRange): void {
    this.value = range;
    this.ngModel.set(range);
    this.propagateChange(range);
    this.propagateTouched();
    this.isOpen.set(false);
  }
}

/**
 * Date range has no injection token: `<smart-date-range>` picks between its
 * `standard` and `preset` variations through the `variant` input, so a custom
 * implementation is rendered directly rather than registered.
 */
@Component({
  selector: 'docs-date-range-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomDateRangeComponent],
  template: `
    <docs-custom-date-range
      [ngModel]="range()"
      (ngModelChange)="range.set($event)"
    />
  `,
})
export class DateRangeCustomExampleComponent {
  range = signal<IDateRange | undefined>({
    start: '2026-04-01',
    end: '2026-04-07',
  });
}
// #endregion
