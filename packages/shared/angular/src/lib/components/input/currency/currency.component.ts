import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-currency',
  templateUrl: './currency.component.html',
  imports: [ReactiveFormsModule, ModelLabelPipe, AsyncPipe],
})
export class InputCurrencyComponent<T> extends InputBaseComponent<T> {}
