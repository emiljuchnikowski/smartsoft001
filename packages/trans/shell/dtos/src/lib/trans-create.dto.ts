import { Field, FieldType, Model } from '@smartsoft001/models';

/**
 * Hydrated from the request body by the validation pipeline, never built with
 * a constructor: the `required` fields are definitely assigned, the rest are
 * optional, exactly as the `@Field` metadata says.
 */
@Model({})
export class TransCreateDto<T> {
  @Field({ required: true, type: FieldType.currency }) amount!: number;
  @Field({ required: true, type: FieldType.text }) system!: 'payu';
  @Field({ required: true }) data!: T;
  @Field({ required: true, type: FieldType.text }) name!: string;
  @Field({ type: FieldType.text }) firstName?: string;
  @Field({ type: FieldType.text }) lastName?: string;
  @Field({ type: FieldType.email }) email?: string;
  @Field({ type: FieldType.text }) contactPhone?: string;
}
