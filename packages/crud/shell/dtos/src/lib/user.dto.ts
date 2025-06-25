import {Field, Model} from "@smartsoft001/models";

@Model({})
export class UserDto {
    @Field({ required: true, focused: true }) username: string;
    @Field({ required: true }) password: string;
}
