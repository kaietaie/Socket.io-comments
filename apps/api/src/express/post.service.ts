import { Body, Injectable, UploadedFile } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns';
import { createWriteStream } from 'fs';
import { MessageProducer } from 'src/aws-sqs/producer.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    private readonly messageProducer: MessageProducer,
  ) {}

  async getAllPosts(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async getPostById(id: string): Promise<Posts> {
    return this.postModel.findById(id);
  }

  async createPost(
    // file: Express.Multer.File,
    createPost: CreatePostDTO,
  ): Promise<object> {
    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");
  
    const newPost = new this.postModel({ ...createPost, createdAt });
    // if (!file) {
    const res = await this.messageProducer.sendMessageToQueue(JSON.stringify(newPost));
    console.log("sendMessageToQueue ", res)
    // newPost.save();
      return {
        statusCode: 201,
        message:  "Ok",
        newPost
      };
      
    // } else {
    //   const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
    //   if (!validFormats.includes(file.mimetype)) {
    //     return {
    //       statusCode: 400,
    //       message: 'Invalid file format. Supported formats: JPG, PNG, GIF.',
    //     };
    //   }
    //   if (file.size > 102400) {
    //     return {
    //       statusCode: 400,
    //       message: 'File size exceeds the limit (100KB).',
    //     };
    //   }
    //   const fileDestination = 'uploads/' + file.originalname;
    //   const fileStream = createWriteStream(fileDestination);
    //   fileStream.write(file.buffer);
    //   fileStream.end();
    //   newPost.filedest = fileDestination;
    //   // newPost.save();
    //   await this.messageProducer.sendMessageToQueue(JSON.stringify(newPost));
      // return {
      //   statusCode: 201,
      //   message: "ok",
      //   newPost
      // };
    // }
  }
}
