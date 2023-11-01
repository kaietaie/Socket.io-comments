import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type UsersDocument = Users & Document

@Schema()
export class Users {

    @Prop()
    username: string

    @Prop()
    email: string
    
    @Prop()
    password: string

    @Prop()
    posts: [string]

    @Prop()
    photo: string

}

export const UserSchema = SchemaFactory.createForClass(Users)