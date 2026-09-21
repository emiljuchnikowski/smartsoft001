import { TestBed } from '@angular/core/testing';

import { Field, FieldType, Model } from '@smartsoft001/models';

import { FormFactory } from './form.factory';
import { MODEL_VALIDATORS_PROVIDER } from '../../providers';
import { AuthService, SmartFormGroup } from '../../services';

@Model({})
class ContactModel {
  @Field({ type: FieldType.text, create: { required: true } })
  name!: string;

  @Field({ type: FieldType.text, create: true })
  nickname!: string;
}

@Model({})
class AddressModel {
  @Field({ type: FieldType.text, create: { required: true } })
  city!: string;
}

@Model({})
class CompanyModel {
  @Field({ type: FieldType.object, create: true })
  address: AddressModel = new AddressModel();
}

describe('angular: FormFactory', () => {
  let factory: FormFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormFactory,
        // FormFactory injects this token without `optional`, so it has to be
        // provided even when the application registers no extra validators.
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
        { provide: AuthService, useValue: { expectPermissions: () => true } },
      ],
    });

    factory = TestBed.inject(FormFactory);
  });

  it('should return a SmartFormGroup', async () => {
    const form = await factory.create(new ContactModel(), { mode: 'create' });

    expect(form).toBeInstanceOf(SmartFormGroup);
  });

  it('should be invalid straight out of create while a required field is empty', async () => {
    const form = await factory.create(new ContactModel(), { mode: 'create' });

    expect(form.status).toBe('INVALID');
  });

  it('should report the required error on the empty required control', async () => {
    const form = await factory.create(new ContactModel(), { mode: 'create' });

    expect(form.controls['name'].errors).toEqual({ required: true });
  });

  it('should become valid once the required field is filled in', async () => {
    const form = await factory.create(new ContactModel(), { mode: 'create' });

    form.controls['name'].setValue('Ada');

    expect(form.status).toBe('VALID');
  });

  it('should leave an optional control valid while it is empty', async () => {
    const form = await factory.create(new ContactModel(), { mode: 'create' });

    expect(form.controls['nickname'].status).toBe('VALID');
  });

  it('should be invalid straight out of create when a nested object field is incomplete', async () => {
    const form = await factory.create(new CompanyModel(), { mode: 'create' });

    expect(form.status).toBe('INVALID');
  });
});
