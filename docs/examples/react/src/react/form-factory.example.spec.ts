import { buildSignupForm } from './form-factory.example';

// Placeholders, not credentials: the form only compares the two entries.
const PLACEHOLDER = 'placeholder-entry';
const OTHER_PLACEHOLDER = 'other-placeholder-entry';

describe('docs-examples-react: FormFactory', () => {
  it('should build one control per create field plus the confirmation', async () => {
    const form = await buildSignupForm();

    expect(Object.keys(form.controls)).toEqual([
      'name',
      'email',
      'password',
      'passwordConfirm',
    ]);
  });

  it('should be invalid while the required fields are empty', async () => {
    const form = await buildSignupForm();

    expect(form.status).toBe('INVALID');
  });

  it('should reject a malformed email', async () => {
    const form = await buildSignupForm();

    form.controls['email'].setValue('not-an-email');

    expect(form.controls['email'].errors).toEqual({ email: true });
  });

  it('should require the confirmation to match', async () => {
    const form = await buildSignupForm();

    form.controls['password'].setValue(PLACEHOLDER);
    form.controls['passwordConfirm'].setValue(OTHER_PLACEHOLDER);

    expect(form.controls['passwordConfirm'].errors).toEqual({ confirm: true });
  });

  it('should become valid once everything is filled in', async () => {
    const form = await buildSignupForm();

    form.patchValue({
      name: 'Ada',
      password: PLACEHOLDER,
      passwordConfirm: PLACEHOLDER,
    });

    expect(form.valid).toBe(true);
  });
});
