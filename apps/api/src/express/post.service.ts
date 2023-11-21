import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns';
import { createWriteStream, readFileSync } from 'fs';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CachedUserDTO } from './dto/cached-user.dto';
import { join } from 'path';


export interface objectData {
  post: Posts;
  uploadfile: {
    fileName: string;
    fileSize: number;
    file: Buffer;
  };
  authorization: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    private readonly messageProducer: MessageProducer,
    private usersServise: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private authService: AuthService,
  ) {}

  async getAllPosts(): Promise<Posts[]> {
    return this.postModel.find().exec();
  }

  async upload(
    uploadfile,
    postId,
  ): Promise<{ statusCode: number; fileDestination: string }> {
    

    const extention = uploadfile.fileName.split('.').pop().toLowerCase();
    const fileDestination = postId + '.' + extention;

    const fileStream = createWriteStream('uploads/' + fileDestination);
    fileStream.write(uploadfile.file);
    fileStream.end();
    return {
      statusCode: 200,
      fileDestination,
    };
  }

  async createPost(data: objectData): Promise<object> {
    const createPost = data.post;
    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");

    let user: CachedUserDTO = await this.cachedUser(data.authorization);

    const newPost = new this.postModel({
      ...createPost,
      createdAt,
      user: user.username,
      filedest: '',
    });
    if (data.uploadfile.fileName.length !== 0) {
      const filedest = await this.upload(data.uploadfile, newPost._id);
      // if (filedest.statusCode === 400) {
      //   return {
      //     statusCode: 400,
      //     message: filedest.message,
      //   };
      // }

      newPost.filedest = filedest.fileDestination;
    }
    await this.messageProducer.sendMessageToQueue(
      JSON.stringify(newPost),
    );
    await this.usersServise.addPostToUser(user.sub, newPost._id);

    return {
      statusCode: 201,
      newPost,
    };
  }

  async cachedUser(auth) {
    let user: CachedUserDTO = await this.cacheManager.get('cachedUser');
    if (!user) {
      //@ts-ignore
      const token = auth.slice(7);
      const userFromToken = await this.authService.getUserFromToken(token);
      await this.cacheManager.set('cachedUser', userFromToken);
    }
    user = await this.cacheManager.get('cachedUser');
    return user;
  }

  getFile(path) {
    return readFileSync(join(process.cwd(), path));
  }
}
