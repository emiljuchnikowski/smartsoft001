import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicIoDirective } from 'ng-dynamic-component';

import { IFormOptions } from '../../../models';
import { ModelLabelPipe } from '../../../pipes';
import { FORM_COMPONENT_TOKEN } from '../../../shared.inectors';
import { InputBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-input-object',
  template: `
    @if (control) {
      <!--  <ion-label position="floating">-->
      {{
        control?.parent?.value
          | smartModelLabel
            : internalOptions.fieldKey
            : internalOptions?.model?.constructor
          | async
      }}
      <!--    <ion-text color="danger">-->
      @if (required) {
        <span>*</span>
      }
      <!--    </ion-text>-->
      <!--  </ion-label>-->
      <br />
      <ng-template
        [ngComponentOutlet]="formComponent"
        [ndcDynamicInputs]="{ options: childOptions }"
      ></ng-template>
    }
  `,
  imports: [ModelLabelPipe, AsyncPipe, NgComponentOutlet, DynamicIoDirective],
})
export class InputObjectComponent<T, TChild> extends InputBaseComponent<T> {
  public formComponent = inject(FORM_COMPONENT_TOKEN);
  childOptions!: IFormOptions<TChild>;

  protected override afterSetOptionsHandler() {
    this.childOptions = {
      treeLevel: this.internalOptions.treeLevel + 1,
      mode: this.internalOptions.mode,
      control: this.control,
      model: (this.internalOptions.model as any)[
        this.internalOptions.fieldKey
      ] as TChild,
      show: true,
    };
  }
}
