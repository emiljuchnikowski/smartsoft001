import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'smart-date-edit',
  templateUrl: './date-edit.component.html',
  styles: [
    `
      smart-date-edit input[type='number']::-webkit-outer-spin-button,
      smart-date-edit input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      smart-date-edit input[type='number'] {
        -moz-appearance: textfield;
        text-align: center;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateEditComponent),
      multi: true,
    },
  ],
})
export class DateEditComponent implements ControlValueAccessor {
  private cd = inject(ChangeDetectorRef);
  DEFAULT_DATE = '2001-01-01';

  get d1(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[8];
  }
  set d1(val: string) {
    this.setValueAt(val, 8);
  }
  get d2(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[9];
  }
  set d2(val: string) {
    this.setValueAt(val, 9);
  }

  get m1(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[5];
  }
  set m1(val: string) {
    this.setValueAt(val, 5);
  }
  get m2(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[6];
  }
  set m2(val: string) {
    this.setValueAt(val, 6);
  }

  get y1(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[0];
  }
  set y1(val: string) {
    this.setValueAt(val, 0);
  }
  get y2(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[1];
  }
  set y2(val: string) {
    this.setValueAt(val, 1);
  }
  get y3(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[2];
  }
  set y3(val: string) {
    this.setValueAt(val, 2);
  }
  get y4(): string | null {
    if (!this.ngModel()) return null;
    return this.ngModel()[3];
  }
  set y4(val: string) {
    this.setValueAt(val, 3);
  }

  ngModel = model(this.DEFAULT_DATE);
  validDate = true;

  propagateChange = (val: any) => {}; // eslint-disable-line
  propagateTouched = () => {}; // eslint-disable-line

  validChange = output<boolean>();

  writeValue(value: any): void {
    this.ngModel.set(value);
    this.cd.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  moveTo(event: KeyboardEvent, el: HTMLInputElement): void {
    if (event.key === 'Backspace' || event.key === 'Enter') return;

    const allowKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (!allowKeys.some((k) => k === event.key)) {
      (event.target as HTMLInputElement).value = '0';
      return;
    }

    (event.target as HTMLInputElement).value = (
      event.target as HTMLInputElement
    ).value.substr(0, 1);

    el.focus();
    this.select(el);
  }

  select(el: HTMLInputElement): void {
    setTimeout(() => {
      if (el) {
        el.value = el.value.substr(0, 1);
        el.setSelectionRange(0, el.value.length);
      }
    });
  }

  private setValueAt(val: string, index: number): void {
    if (val === null) return;

    val = val.toString().substr(0, 1);
    const newValue = Number(val);
    if (!this.ngModel() || newValue > 9 || newValue < 0)
      this.ngModel.set(this.DEFAULT_DATE);
    this.ngModel.set(this.setCharAt(this.ngModel(), index, newValue));

    this.validDate = moment(this.ngModel()).isValid();

    if (this.validDate) {
      this.writeValue(this.ngModel());
      this.propagateChange(this.ngModel());
      this.propagateTouched();
    } else {
      this.propagateChange(null);
      this.propagateTouched();
    }

    this.validChange.emit(this.validDate);
  }

  private setCharAt(str: any, index: any, chr: any) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }
}
