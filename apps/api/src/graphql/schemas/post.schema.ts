import { Field, ObjectType } from "@nestjs/graphql"
import { Schema, SchemaFactory } from "@nestjs/mongoose"

export type PostsDocument = Posts & Document

@ObjectType()
@Schema()
export class Posts {

    @Field()
    _id: string

    @Field()
    user: string

    @Field()
    createdAt: string

    @Field()
    text: string

    @Field({ nullable: true })
    parentPost?: string
    
    @Field({ nullable: true })
    homePage?: string
}

export const PostsSchema = SchemaFactory.createForClass(Posts)


