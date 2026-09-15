import { TestBed } from '@angular/core/testing';

import {
  AuthService,
  FormFactory,
  MODEL_VALIDATORS_PROVIDER,
  SmartFormGroup,
} from '@smartsoft001/angular';

import { buildContactForm, Contact } from './form-factory.example';

describe('docs-examples-angular: buildContactForm', () => {
  let form: SmartFormGroup;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        FormFactory,
        // FormFactory injects this token without `optional`, so an application
        // that registers no extra validators must still provide it.
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
        { provide: AuthService, useValue: { expectPermissions: () => true } },
      ],
    });

    form = await buildContactForm(TestBed.inject(FormFactory));
  });

  it('should return a SmartFormGroup', () => {
    expect(form).toBeInstanceOf(SmartFormGroup);
  });

  it('should build a control for every field marked with create', () => {
    expect(Object.keys(form.controls)).toEqual(['name', 'email']);
  });

  it('should be invalid while the required name is empty', () => {
    expect(form.valid).toBe(false);
  });

  it('should report the required error on the name control', () => {
    expect(form.controls['name'].errors).toEqual({ required: true });
  });

  it('should become valid once the required name is filled in', () => {
    form.controls['name'].setValue('Ada');

    expect(form.valid).toBe(true);
  });

  it('should leave the optional email valid while it is empty', () => {
    expect(form.controls['email'].valid).toBe(true);
  });

  it('should reject a malformed email because FieldType.email adds a format check', () => {
    form.controls['name'].setValue('Ada');
    form.controls['email'].setValue('not-an-email');

    expect(form.controls['email'].errors).toEqual({ email: true });
  });

  it('should accept a well-formed email', () => {
    form.controls['name'].setValue('Ada');
    form.controls['email'].setValue('ada@example.com');

    expect(form.valid).toBe(true);
  });

  it('should report VALID straight out of factory.create until the controls are refreshed', async () => {
    const raw = await TestBed.inject(FormFactory).create(new Contact(), {
      mode: 'create',
    });

    expect(raw.valid).toBe(true);
  });
});
