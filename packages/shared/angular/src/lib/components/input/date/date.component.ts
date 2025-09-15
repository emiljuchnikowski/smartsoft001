import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { HardwareService } from '../../../services';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date',
  templateUrl: './date.component.html',
  imports: [
    ModelLabelPipe,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class InputDateComponent<T>
  extends InputBaseComponent<T>
  implements OnInit
{
  private hardwareService = inject(HardwareService);

  get isMobile(): boolean {
    return this.hardwareService.isMobile || this.hardwareService.isMobileWeb;
  }

  ngOnInit() {
    this.control.valueChanges.pipe(this.takeUntilDestroy).subscribe((value) => {
      if (value && value.length !== 10) {
          // TODO: re-enable moment
       // this.control.setValue(moment(value).format('YYYY-MM-DD'));
      }
    });
  }
}
