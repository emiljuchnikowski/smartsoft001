// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FormComponent, IFormOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'name' })
class Contact {
  @Field({ type: FieldType.text, create: true, required: true })
  name = '';

  @Field({ type: FieldType.email, create: true })
  email = '';
}

@Component({
  selector: 'docs-form-usage-example',
  imports: [FormComponent],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUsageExampleComponent {
  readonly options: IFormOptions<Contact> = {
    model: new Contact(),
    show: true,
    mode: 'create',
  };

  readonly value = signal<Contact | null>(null);
  readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
  }
}
// #endregion
