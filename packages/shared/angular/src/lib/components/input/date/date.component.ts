import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
// @ts-expect-error moment package
import moment from 'moment';

import { ModelLabelPipe } from '../../../pipes';
import { HardwareService } from '../../../services';
import { InputBaseComponent } from '../base/base.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'smart-input-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  imports: [
    ModelLabelPipe,
    ReactiveFormsModule,
    TranslatePipe,
    MatDatepickerInput,
    MatDatepicker,
    AsyncPipe,
  ],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InputDateComponent<T>
  extends InputBaseComponent<T>
  implements OnInit
{
  get isMobile(): boolean {
    return this.hardwareService.isMobile || this.hardwareService.isMobileWeb;
  }

  constructor(
    cd: ChangeDetectorRef,
    private hardwareService: HardwareService,
    private dateAdapter: DateAdapter<any>,
    translateService: TranslateService,
  ) {
    super(cd);
    this.dateAdapter.setLocale(translateService.currentLang);
  }

  ngOnInit() {
    this.control.valueChanges.pipe(this.takeUntilDestroy).subscribe((value) => {
      if (value && value.length !== 10) {
        this.control.setValue(moment(value).format('YYYY-MM-DD'));
      }
    });
  }
}
