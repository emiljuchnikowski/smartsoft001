import { Field, FieldType, Model } from '@smartsoft001/models';

import { FormFactory } from './form.factory';
import { SmartFormArray } from '../../forms/form-array';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { IModelValidatorsProvider } from '../../providers/model-validators.provider';
import { DetailsService } from '../../services/details/details.service';

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

@Model({})
class ModesModel {
  @Field({ create: true })
  createOnly!: string;

  @Field({ update: true })
  updateOnly!: string;

  @Field({ update: { multi: true } })
  multi!: string;

  @Field({ customs: [{ mode: 'publish' }] })
  custom!: string;
}

@Model({})
class SecuredModel {
  @Field({ create: true })
  open!: string;

  @Field({ create: { permissions: ['admin'] } })
  secret!: string;
}

@Model({})
class PasswordModel {
  @Field({ type: FieldType.password, create: { confirm: true } })
  password!: string;
}

@Model({})
class ToggleModel {
  @Field({ type: FieldType.flag, create: true })
  hasCompany!: boolean;

  @Field({
    create: true,
    enabled: { criteria: { hasCompany: true } },
  })
  companyName!: string;
}

@Model({})
class LineModel {
  @Field({ create: { required: true } })
  product!: string;
}

@Model({})
class OrderModel {
  @Field({ type: FieldType.array, classType: LineModel, create: true })
  lines!: LineModel[];
}

@Model({})
class ValidatedModel {
  @Field({ type: FieldType.email, create: true })
  email!: string;

  @Field({
    type: FieldType.int,
    create: true,
    possibilities: { min: 1, max: 3 },
  })
  count!: number;

  @Field({ type: FieldType.address, create: { required: true } })
  address!: unknown;

  @Field({ create: true, defaltValue: () => 'preset' })
  withDefault!: string;
}

@Model({})
class UniqueModel {
  @Field({ create: { unique: true } })
  code!: string;
}

describe('@smartsoft001/react: FormFactory', () => {
  let factory: FormFactory;
  const auth = { expectPermissions: jest.fn(() => false) };

  beforeEach(() => {
    auth.expectPermissions.mockReturnValue(false);
    factory = new FormFactory({
      authService: auth,
      detailsService: new DetailsService(),
    });
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

  it('should throw for an object without @Model', async () => {
    await expect(factory.create({}, { mode: 'create' })).rejects.toThrow(
      'You should mark class with @Model decorator',
    );
  });

  it.each([
    ['create', ['createOnly']],
    ['update', ['updateOnly', 'multi']],
    ['multiUpdate', ['multi']],
    ['publish', ['custom']],
  ])('should pick the fields of the %s mode', async (mode, expected) => {
    const form = await factory.create(new ModesModel(), { mode });

    expect(Object.keys(form.controls)).toEqual(expected);
  });

  it('should leave out a field the user has no permission for', async () => {
    const form = await factory.create(new SecuredModel(), { mode: 'create' });

    expect(Object.keys(form.controls)).toEqual(['open']);
  });

  it('should include the field once the permission is granted', async () => {
    auth.expectPermissions.mockReturnValue(true);

    const form = await factory.create(new SecuredModel(), { mode: 'create' });

    expect(Object.keys(form.controls)).toEqual(['open', 'secret']);
  });

  it('should add a confirm control that has to match', async () => {
    const form = await factory.create(new PasswordModel(), { mode: 'create' });

    form.controls['password'].setValue('secret');
    form.controls['passwordConfirm'].setValue('other');

    expect(form.controls['passwordConfirm'].errors).toEqual({ confirm: true });
  });

  it('should re-check the confirm control when the original changes', async () => {
    const form = await factory.create(new PasswordModel(), { mode: 'create' });

    form.controls['passwordConfirm'].setValue('secret');
    form.controls['password'].setValue('secret');

    expect(form.controls['passwordConfirm'].valid).toBe(true);
  });

  it('should leave out a field whose enabled specification does not hold', async () => {
    const form = await factory.create(new ToggleModel(), { mode: 'create' });

    expect(form.controls['companyName']).toBeUndefined();
  });

  it('should add the field once its enabled specification holds', async () => {
    const form = await factory.create(new ToggleModel(), { mode: 'create' });

    form.controls['hasCompany'].setValue(true);

    expect(form.controls['companyName']).toBeDefined();
  });

  it('should remove the field again when the specification stops holding', async () => {
    const form = await factory.create(new ToggleModel(), { mode: 'create' });

    form.controls['hasCompany'].setValue(true);
    form.controls['hasCompany'].setValue(false);

    expect(form.controls['companyName']).toBeUndefined();
  });

  it('should build one group per array item', async () => {
    const order = new OrderModel();
    order.lines = [new LineModel(), new LineModel()];

    const form = await factory.create(order, { mode: 'create' });

    expect((form.controls['lines'] as SmartFormArray).length).toBe(2);
  });

  it('should validate the email format', async () => {
    const form = await factory.create(new ValidatedModel(), { mode: 'create' });

    form.controls['email'].setValue('not-an-email');

    expect(form.controls['email'].errors).toEqual({ email: true });
  });

  it('should validate the min and max possibilities', async () => {
    const form = await factory.create(new ValidatedModel(), { mode: 'create' });

    form.controls['count'].setValue(5);

    expect(form.controls['count'].errors).toEqual({
      max: { max: 3, actual: 5 },
    });
  });

  it('should build an address group with the zip code check', async () => {
    const form = await factory.create(new ValidatedModel(), { mode: 'create' });
    const address = form.controls['address'] as SmartFormGroup;

    address.controls['zipCode'].setValue('123');

    expect(address.controls['zipCode'].errors).toEqual({
      invalidZipCode: true,
    });
  });

  it('should use the default value of an empty field', async () => {
    const form = await factory.create(new ValidatedModel(), { mode: 'create' });

    expect(form.controls['withDefault'].value).toBe('preset');
  });

  it('should take the value of a filled field', async () => {
    const contact = new ContactModel();
    contact.name = 'Ada';

    const form = await factory.create(contact, { mode: 'create' });

    expect(form.controls['name'].value).toBe('Ada');
  });

  it('should report a taken value through the unique provider', async () => {
    const uniqueProvider = jest.fn(async () => false);
    const form = await factory.create(new UniqueModel(), {
      mode: 'create',
      uniqueProvider,
    });

    form.controls['code'].setValue('A1');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect([
      form.controls['code'].errors,
      uniqueProvider.mock.lastCall,
    ]).toEqual([{ invalidUnique: true }, [{ code: "'A1'" }]]);
  });

  it('should let the validators provider replace the derived validators', async () => {
    class Provider extends IModelValidatorsProvider {
      async get() {
        return { validators: [SmartValidators.required] };
      }
    }
    factory = new FormFactory({
      authService: auth,
      validatorsProvider: new Provider(),
    });

    const form = await factory.create(new ContactModel(), { mode: 'create' });

    expect(form.controls['nickname'].errors).toEqual({ required: true });
  });
});
