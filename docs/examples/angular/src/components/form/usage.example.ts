// #region usage
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FormComponent, IFormOptions } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

// Each label is the `MODEL.<key>` translation: the library's dictionary
// already has `firstName` and `email`.
@Model({ titleKey: 'firstName' })
class Contact {
  @Field({ type: FieldType.text, create: true, required: true })
  firstName = '';

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
  // `show` is required by the type; the form does not read it.
  readonly options: IFormOptions<Contact> = {
    model: new Contact(),
    show: true,
    mode: 'create',
  };

  readonly value = signal<Contact | null>(null);
  readonly submitted = signal(false);

  // Called on submit, and on Enter in an input.
  onSubmit(): void {
    this.submitted.set(true);
  }
}
// #endregion
