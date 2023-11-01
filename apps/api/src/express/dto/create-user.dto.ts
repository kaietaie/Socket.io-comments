import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDTO {
   
    @IsNotEmpty()
    @Length(3, 20)
    readonly username: string;

    @IsNotEmpty()
    @Length(6, 12)
    password: string;

    @IsEmail()
    email: string;
    
    homePage: string;

    posts: string[];
    
    photo: string;
} 