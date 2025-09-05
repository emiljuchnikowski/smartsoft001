import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InputComponent } from '../../input';
import { FormBaseComponent } from '../base/base.component';

@Component({
  selector: 'smart-form-standard',
  template: `
    <!--<ion-list class="w-full m-0">-->
    @for (field of fields; track field) {
      @if (form.controls[field] && !get__smartDisabled(field)) {
        <smart-input
          [options]="{
            treeLevel: treeLevel ?? 0,
            fieldKey: field,
            control: getUntypedFormControl(field),
            model: model,
            mode: mode,
            possibilities: possibilities[field],
            component: inputComponents[field],
          }"
        ></smart-input>
      }
    }
    <!--</ion-list>-->
  `,
  imports: [InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStandardComponent<T> extends FormBaseComponent<T> {
  get__smartDisabled(field: string) {
    return (this.form.controls[field] as any)['__smartDisabled'];
  }
}
