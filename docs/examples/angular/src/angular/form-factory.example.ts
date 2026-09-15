// #region usage
import { FormFactory, SmartFormGroup } from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'name' })
export class Contact {
  // A per-mode block overrides the field options for that mode only, so `name`
  // is required when creating but carries no requirement elsewhere.
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  // `create: true` opts the field into the create form without extra rules;
  // FieldType.email still adds the built-in format validator.
  @Field({ type: FieldType.email, create: true })
  email!: string;
}

/**
 * `FormFactory` turns `@Model` / `@Field` metadata into a reactive form.
 * It is provided by `SharedFactoriesModule`, not in the root injector.
 */
export async function buildContactForm(
  factory: FormFactory,
): Promise<SmartFormGroup> {
  const form = await factory.create(new Contact(), { mode: 'create' });

  // `create()` attaches the validators after each control has already computed
  // its status, so a freshly built group reports VALID until the controls are
  // refreshed. Refresh them before showing the form or gating a submit button.
  Object.keys(form.controls).forEach((key) =>
    form.controls[key].updateValueAndValidity(),
  );

  return form;
}
// #endregion
