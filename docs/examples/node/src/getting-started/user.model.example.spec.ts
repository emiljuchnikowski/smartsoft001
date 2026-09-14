import {
  FieldType,
  getModelFieldKeys,
  getModelFieldOptions,
  isModel,
} from '@smartsoft001/models';

import { User } from './user.model.example';

describe('docs-examples-node: User model', () => {
  it('should expose every decorated field key', () => {
    const keys = getModelFieldKeys(User);

    expect(keys).toEqual(expect.arrayContaining(['email', 'age']));
  });

  it('should keep the options declared on the email field', () => {
    const options = getModelFieldOptions(new User(), 'email');

    expect(options).toEqual(
      expect.objectContaining({ type: FieldType.email, required: true }),
    );
  });

  it('should leave the age field optional', () => {
    const options = getModelFieldOptions(new User(), 'age');

    expect(options.required).toBeUndefined();
  });

  it('should be recognised as a model instance', () => {
    const user = new User();

    expect(isModel(user)).toBe(true);
  });
});
