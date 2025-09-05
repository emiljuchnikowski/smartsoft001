import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  imports: [TranslatePipe, ReactiveFormsModule, ModelLabelPipe, AsyncPipe],
})
export class InputAddressComponent<T> extends InputBaseComponent<T> {
  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
