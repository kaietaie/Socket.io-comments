import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreatePostDTO {
    @IsNotEmpty()
    @Length(3, 20)
    readonly user: string;

    @IsEmail()
    readonly email: string;
    
    
    homePage: string;

    @IsNotEmpty()
    text: string;

    @IsNotEmpty()
    readonly captcha: string;

    readonly createdAt: string;

    parentPost: string;

}