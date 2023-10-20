import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostsDocument = Posts & Document

@Schema()
export class Posts {
    @Prop()
    post_id: string
    @Prop()
    user_id: string
    @Prop()
    created_at: string
    @Prop()
    text: string
}

export const PostsSchema = SchemaFactory.createForClass(Posts)