import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { IonLabel, IonText } from '@ionic/angular/standalone';

import { ModelLabelPipe } from '../../../pipes';
import { DateRangeComponent } from '../../date-range';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  imports: [IonLabel, IonText, DateRangeComponent, ModelLabelPipe, AsyncPipe],
})
export class InputDateRangeComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
