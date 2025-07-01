import { Field, Model } from "@smartsoft001/models";

@Model({})
export class LoginDto {
  @Field({ required: true, focused: true }) username: string;
  @Field({ required: true }) password: string;
}
