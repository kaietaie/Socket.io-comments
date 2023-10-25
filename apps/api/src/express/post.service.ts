import { Body, Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns';
import { sendMessageToQueue } from 'src/aws.sqs';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
  ) {}

  async getAllPosts(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async getPostById(id: string): Promise<Posts> {
    return this.postModel.findById(id);
  }

  async createPost(@Body() createPost: CreatePostDTO): Promise<string> {
    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");
    const newPost = { ...createPost, createdAt };
    return sendMessageToQueue(JSON.stringify(newPost));
  }
}
