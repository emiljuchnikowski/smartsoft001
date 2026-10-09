// #region usage
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { IFormOptions, SmartForm } from '@smartsoft001/react';

// Each label is the `MODEL.<key>` translation: the library's dictionary
// already has `firstName` and `email`.
@Model({ titleKey: 'firstName' })
class Contact {
  @Field({ type: FieldType.text, create: true, required: true })
  firstName = '';

  @Field({ type: FieldType.email, create: true })
  email = '';
}

export function FormUsageExample() {
  // One model instance per form: a new instance rebuilds the form.
  const [model] = useState(() => new Contact());
  const [value, setValue] = useState<Contact | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // `show` is required by the type; the form does not read it.
  const options: IFormOptions<Contact> = { model, show: true, mode: 'create' };

  return (
    <>
      <SmartForm
        options={options}
        onValueChange={setValue}
        // Called on submit, and on Enter in an input.
        onInvokeSubmit={() => setSubmitted(true)}
      />
      {value?.firstName && <p>First name: {value.firstName}</p>}
      {submitted && <p>Submitted</p>}
    </>
  );
}
// #endregion
