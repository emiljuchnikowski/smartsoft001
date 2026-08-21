import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateEditVariantName } from './base/base.component';
import { DateEditPresetComponent } from './preset/preset.component';
import { DateEditStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-date-edit',
  template: `
    @switch (variant()) {
      @case ('standard') {
        <smart-date-edit-standard
          [ngModel]="value()"
          (ngModelChange)="onInnerChange($event)"
          (validChange)="validChange.emit($event)"
          [class]="cssClass()"
        />
      }
      @case ('preset') {
        <smart-date-edit-preset
          [ngModel]="value()"
          (ngModelChange)="onInnerChange($event)"
          (validChange)="validChange.emit($event)"
          [class]="cssClass()"
        />
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // FormsModule is deliberately NOT imported. The variant components expose
  // `ngModel` as a model() signal, so `[ngModel]`/`(ngModelChange)` above bind
  // straight to it. Pulling FormsModule in would additionally match the NgModel
  // directive on the same element, and its writeValue()/model() round trip
  // fights the binding — see the note on `value` below.
  imports: [DateEditStandardComponent, DateEditPresetComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateEditComponent),
      multi: true,
    },
  ],
})
export class DateEditComponent implements ControlValueAccessor {
  variant = input<DateEditVariantName>('standard');
  cssClass = input<string>('', { alias: 'class' });

  /** Two-way value binding, e.g. `[(ngModel)]="date"` without FormsModule. */
  ngModel = model<string>('2001-01-01');
  validChange = output<boolean>();

  /**
   * What the template actually renders — deliberately separate from `ngModel`.
   *
   * A consumer that imports FormsModule makes the NgModel directive match
   * `<smart-date-edit>` alongside this component's own `ngModel` model() input.
   * NgModel seeds its FormControl with `null` and pushes that through
   * `writeValue()` before writing the real value on the microtask queue. If
   * `writeValue()` wrote to `ngModel`, that model() output would fire and shove
   * the `null` straight back into the consumer's own property mid-check —
   * NG0100, and the supplied date lost. So form writes land here, and only a
   * genuine user edit is allowed to emit through `ngModel`.
   */
  protected value = linkedSignal(() => this.ngModel());

  private propagateChange: (val: unknown) => void = () => undefined;
  private propagateTouched: () => void = () => undefined;

  onInnerChange(newValue: string): void {
    if (this.value() === newValue) return;
    this.value.set(newValue);
    this.ngModel.set(newValue);
    this.propagateChange(newValue);
    this.propagateTouched();
  }

  writeValue(newValue: string): void {
    this.value.set(newValue);
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
}
