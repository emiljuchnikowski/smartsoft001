import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ColorPickerDirective } from 'ngx-color-picker';

import { ModelLabelPipe } from '../../../pipes';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss'],
  imports: [ColorPickerDirective, ModelLabelPipe, AsyncPipe],
})
export class InputColorComponent<T> extends InputBaseComponent<T> {
  color!: string;

  protected override afterSetOptionsHandler() {
    this.color = this.control.value;
  }

  selectColor(color: string) {
    this.control.markAsDirty();
    this.control.markAllAsTouched();
    this.control.setValue(color);
  }

  clear() {
    this.color = '';
    this.control.markAsDirty();
    this.control.markAllAsTouched();
    this.control.setValue(null);
  }
}
