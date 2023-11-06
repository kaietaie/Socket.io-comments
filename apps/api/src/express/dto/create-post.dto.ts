import { IsNotEmpty } from "class-validator";

export class CreatePostDTO {
    
    @IsNotEmpty()
    text: string;

    user: string;

    createdAt: string;

    parentPost: string;

    file: Express.Multer.File | null;;
}