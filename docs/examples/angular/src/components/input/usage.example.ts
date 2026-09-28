// #region usage
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import { InputComponent, InputOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({})
class Newsletter {
  @Field({ type: FieldType.email, required: true })
  email = '';
}

@Component({
  selector: 'docs-input-usage-example',
  imports: [InputComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputUsageExampleComponent {
  readonly control = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
  ]);

  // `<smart-input>` reads the @Field metadata of `model[fieldKey]` and
  // renders the matching field component (here: an email input).
  readonly options: InputOptions<Newsletter> = {
    control: this.control,
    model: new Newsletter(),
    fieldKey: 'email',
    mode: 'create',
    treeLevel: 0,
  };
}
// #endregion
