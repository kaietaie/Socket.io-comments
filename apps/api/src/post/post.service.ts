import { Body, Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { randomUUID } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns'

@Injectable()
export class PostsService {
    constructor(@InjectModel(Posts.name) private postModel: Model<PostsDocument>) {}

    async getAllPosts(): Promise<Posts[]> {
        return this.postModel.find().exec();
    }

    async getPostById(id: string): Promise<Posts> {
        return this.postModel.findById(id)
    }

    async createPost(@Body() createPost: CreatePostDTO): Promise<Posts> {
        const createdAt = format(new Date(), "dd.MM.yy 'в' k:m")
        const newPost = new this.postModel({...createPost, createdAt} )
        return newPost.save()
    }
}
