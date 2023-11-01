import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreatePostDTO {
    
    @IsNotEmpty()
    text: string;

    readonly createdAt: string;

    parentPost: string;

    file: Express.Multer.File | null;;
}