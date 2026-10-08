// #region usage
import { useState } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import { SmartForm } from '@smartsoft001/react';

@Model({})
export class Contact {
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  @Field({ type: FieldType.email, create: true })
  email!: string;
}

export function ContactForm({ onSave }: { onSave: (value: Contact) => void }) {
  // One model instance per form: a new instance rebuilds the form.
  const [model] = useState(() => new Contact());

  return (
    <SmartForm
      options={{ model, mode: 'create', show: true }}
      onInvokeSubmit={(value) => onSave(value as Contact)}
    />
  );
}
// #endregion
