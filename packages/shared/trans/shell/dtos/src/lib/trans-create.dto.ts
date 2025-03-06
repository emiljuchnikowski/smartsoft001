import { Field, FieldType, Model } from "@smartsoft001/models";

@Model({})
export class TransCreateDto<T> {
  @Field({ required: true, type: FieldType.currency }) amount: number;
  @Field({ required: true, type: FieldType.text }) system: "payu";
  @Field({ required: true }) data: T;
  @Field({ required: true, type: FieldType.text }) name: string;
  @Field({ type: FieldType.text }) firstName: string;
  @Field({ type: FieldType.text }) lastName: string;
  @Field({ type: FieldType.email }) email: string;
  @Field({ type: FieldType.text }) contactPhone: string;
}
