// #region usage
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { IFormOptions, SmartForm } from '@smartsoft001/react';

@Model({ titleKey: 'name' })
class Contact {
  @Field({ type: FieldType.text, create: true, required: true })
  name = '';

  @Field({ type: FieldType.email, create: true })
  email = '';
}

export function FormUsageExample() {
  // One model instance per form: a new instance rebuilds the form.
  const [model] = useState(() => new Contact());
  const [value, setValue] = useState<Contact | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options: IFormOptions<Contact> = { model, show: true, mode: 'create' };

  return (
    <>
      <SmartForm
        options={options}
        onValueChange={setValue}
        onInvokeSubmit={() => setSubmitted(true)}
      />
      {value?.name && <p>Name: {value.name}</p>}
      {submitted && <p>Submitted</p>}
    </>
  );
}
// #endregion
