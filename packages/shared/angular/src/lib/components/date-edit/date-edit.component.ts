import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { DateEditVariantName } from './base/base.component';
import { DateEditStandardComponent } from './standard/standard.component';

@Component({
  selector: 'smart-date-edit',
  template: `
    @switch (variant()) {
      @case ('standard') {
        <smart-date-edit-standard
          [ngModel]="ngModel()"
          (ngModelChange)="onInnerChange($event)"
          (validChange)="validChange.emit($event)"
          [class]="cssClass()"
        />
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateEditStandardComponent, FormsModule],
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

  variant = input<DateEditVariantName>('standard');
  cssClass = input<string>('', { alias: 'class' });

  ngModel = model<string>('2001-01-01');
  validChange = output<boolean>();

  private propagateChange: (val: unknown) => void = () => undefined;
  private propagateTouched: () => void = () => undefined;

  onInnerChange(value: string): void {
    this.ngModel.set(value);
    this.propagateChange(value);
    this.propagateTouched();
  }

  writeValue(value: string): void {
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
