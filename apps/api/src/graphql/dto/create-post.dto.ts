import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Length } from "class-validator";

@InputType('MakePost')
export class MakePostDTO {
    @Field()
    @Length(3, 20)
    user!: string;
    @Field()
    @IsEmail()
    email!: string;
    
    @Field()
    homePage: string;
    @Field()
    text!: string;

    createdAt: string;
    @Field()
    parentPost: string;

}