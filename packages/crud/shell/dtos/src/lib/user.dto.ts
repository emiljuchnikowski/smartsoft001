import { Field, Model } from '@smartsoft001/models';

/**
 * Request shape, filled from the request body by the framework; both fields
 * are `required` in the model metadata, hence the definite assignment.
 */
@Model({})
export class UserDto {
  @Field({ required: true, focused: true }) username!: string;
  @Field({ required: true }) password!: string;
}
