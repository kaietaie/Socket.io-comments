import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreatePostDTO {
    @IsNotEmpty()
    @Length(3, 20)
    readonly user: string;

    @IsEmail()
    email: string;
    
    homePage: string;

    @IsNotEmpty()
    text: string;

    readonly createdAt: string;

    parentPost: string;

    file: Express.Multer.File | null;;
}