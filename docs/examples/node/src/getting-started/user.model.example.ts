// #region usage
import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

@Model({ titleKey: 'email' })
export class User implements IEntity<string> {
  id!: string;

  @Field({ type: FieldType.email, required: true })
  email!: string;

  @Field({ type: FieldType.int })
  age?: number;
}
// #endregion
