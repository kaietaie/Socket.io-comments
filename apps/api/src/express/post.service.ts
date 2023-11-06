import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from './schemas/post.schema';
import { format } from 'date-fns';
import { createWriteStream } from 'fs';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CachedUserDTO } from './dto/cached-user.dto';

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
  async getPostById(id: string): Promise<Posts> {
    return this.postModel.findById(id);
  }

  async upload(file: Express.Multer.File, user): Promise<object> {
    const validFormats = ['image/jpeg', 'image/png', 'image/gif','text/plain' ];
    if (!validFormats.includes(file.mimetype)) {
      return {
        statusCode: 400,
        message: 'Invalid file format. Supported formats: JPG, PNG, GIF.',
      };
    }

    const fileDestination = 'uploads/' + user.sub + '/' + file.originalname;

    const fileStream = createWriteStream(fileDestination);
    fileStream.write(file.buffer);
    fileStream.end();
    return {
      statusCode: 200,
      fileDestination,
    };
  }

  async createPost(req: Request,file: Express.Multer.File): Promise<object> {
    const createPost = req.body;
   
    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");

    let user: CachedUserDTO = await this.cachedUser(req);

    const newPost = new this.postModel({
      ...createPost,
      createdAt,
      user: user.username,
    });

    //@ts-ignore
    if (createPost.file) {
      const filedest = await this.upload(file, user);
      //@ts-ignore
      if (filedest.statusCode(400)) {
        return {
          statusCode: 400,
          //@ts-ignore
          message: filedest.message,
        };
      }
      //@ts-ignore
      newPost.filedest = filedest;
    } else {
      await this.messageProducer.sendMessageToQueue(JSON.stringify(newPost));

      const res = await this.messageProducer.sendMessageToQueue(
        JSON.stringify(newPost),
      );

      await this.usersServise.addPostToUser(user.sub, newPost._id);

      console.log('sendMessageToQueue ', res);

      return {
        statusCode: 201,
        message: 'Post was added',
      };
    }
  }

  async cachedUser(req) {
    let user: CachedUserDTO = await this.cacheManager.get('cachedUser');
    if (!user) {
      //@ts-ignore
      const token = req.headers.authorization.slice(7);
      const userFromToken = await this.authService.getUserFromToken(token);
      await this.cacheManager.set('cachedUser', userFromToken);
    }
    user = await this.cacheManager.get('cachedUser');
    return user;
  }
}
