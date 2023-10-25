import { Model } from "mongoose";
import { Posts, PostsDocument } from "./schemas/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { format } from 'date-fns';
import { Args } from "@nestjs/graphql";
import { MakePostDTO } from "./dto/create-post.dto";

export class PostService {
    constructor(@InjectModel(Posts.name) private postModel: Model<PostsDocument>) {}
    
    async getAllPosts(): Promise<Posts[]> {
        return this.postModel.find().exec()
    }
    
    async getPostById(id: string): Promise<Posts> {
        return this.postModel.findById(id)
    }

    async createPost(@Args() MakePost:MakePostDTO  ): Promise<Posts> {
        const createdAt = format(new Date(), "dd.MM.yy 'в' k:m")
        const newPost = new this.postModel({...MakePost, createdAt} )
        return newPost.save()
    }

    

} 