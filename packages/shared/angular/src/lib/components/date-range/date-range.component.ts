import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { IDateRange } from '@smartsoft001/domain-core';

import { DateRangeVariantName } from './base/date-range-base.component';
import { DateRangeStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-date-range',
  template: `
    @switch (variant()) {
      @case ('standard') {
        <smart-date-range-standard
          [ngModel]="ngModel()"
          (ngModelChange)="onInnerChange($event)"
          [class]="cssClass()"
        />
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateRangeStandardComponent, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true,
    },
  ],
})
export class DateRangeComponent implements ControlValueAccessor {
  private cd = inject(ChangeDetectorRef);

  variant = input<DateRangeVariantName>('standard');
  cssClass = input<string>('', { alias: 'class' });

  ngModel = model<IDateRange | undefined>(undefined);

  private propagateChange: (val: unknown) => void = () => undefined;
  private propagateTouched: () => void = () => undefined;

  onInnerChange(value: IDateRange | undefined): void {
    this.ngModel.set(value);
    this.propagateChange(value);
    this.propagateTouched();
  }

  writeValue(value: IDateRange | undefined): void {
    this.ngModel.set(value);
    this.cd.detectChanges();
  }

  registerOnChange(fn: (val: unknown) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }
}
