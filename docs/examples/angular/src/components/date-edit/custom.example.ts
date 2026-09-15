// #region usage
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateEditBaseComponent } from '@smartsoft001/angular';

/**
 * A custom date editor built on `DateEditBaseComponent`.
 *
 * The base owns the `YYYY-MM-DD` value (`ngModel`), the per-digit accessors
 * (`d1`, `m1`, `y1`, ...), the `validDate` flag and the whole
 * `ControlValueAccessor` contract, so a custom implementation only has to
 * provide a template and decide how a new value reaches the model. This one
 * swaps the six digit boxes of the standard variation for one native picker.
 */
@Component({
  selector: 'docs-custom-date-edit',
  template: `
    <label class="docs-date-edit">
      <span class="docs-date-edit__label">Start date</span>
      <input
        class="docs-date-edit__input"
        type="date"
        [value]="ngModel()"
        [attr.aria-invalid]="!validDate"
        (change)="onPicked($event)"
      />
    </label>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Registering NG_VALUE_ACCESSOR is what makes the component usable with
  // formControlName; the base already implements every method it needs.
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateEditComponent),
      multi: true,
    },
  ],
})
export class CustomDateEditComponent extends DateEditBaseComponent {
  onPicked(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.validDate = !!value;
    // ngModel is a model() signal, so setting it also notifies the consumer.
    this.ngModel.set(value);
    this.propagateChange(this.validDate ? value : null);
    this.propagateTouched();
    this.validChange.emit(this.validDate);
  }
}

/**
 * Date edit has no injection token: `<smart-date-edit>` picks between its
 * `standard` and `preset` variations through the `variant` input, so a custom
 * implementation is rendered directly rather than registered.
 */
@Component({
  selector: 'docs-date-edit-custom-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomDateEditComponent],
  template: `
    <docs-custom-date-edit
      [ngModel]="date()"
      (ngModelChange)="date.set($event)"
    />
    <p class="docs-date-edit__value">Selected: {{ date() }}</p>
  `,
})
export class DateEditCustomExampleComponent {
  date = signal('2026-04-07');
}
// #endregion
