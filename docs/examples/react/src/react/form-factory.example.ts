// #region usage
import { Field, FieldType, Model } from '@smartsoft001/models';
import { FormFactory, SmartFormGroup } from '@smartsoft001/react';

@Model({})
export class Signup {
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  @Field({ type: FieldType.email, create: true })
  email!: string;

  @Field({
    type: FieldType.password,
    create: { required: true, confirm: true },
  })
  password!: string;
}

// Inside components, `useFormFactory()` returns the provider's factory and
// `useModelForm(model, { mode })` builds and keeps the form.
const factory = new FormFactory({
  authService: { expectPermissions: () => true },
});

export function buildSignupForm(): Promise<SmartFormGroup> {
  return factory.create(new Signup(), { mode: 'create' });
}
// #endregion
