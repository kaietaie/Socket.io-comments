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
    private authService: AuthService,
    private usersServise: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllPosts(req): Promise<Posts[]> {
    let user: CachedUserDTO = await this.cacheManager.get('cachedUser');
    if (!user) {
      //@ts-ignore
      const token = req.headers.authorization.slice(7);
      const userFromToken = await this.authService.getUserFromToken(token);
      await this.cacheManager.set('cachedUser', userFromToken);
    }
    
    // але якщо не буде активності більше 6 хвилин, то не буде кешованого користувача...
    // тобто треба буде його винести кудись окремо і викликати функцію щоб отримати
    // кешованого або ж заново кешованого. Це на потім.
    return this.postModel.find().exec();
  }
  async getPostById(id: string): Promise<Posts> {
    return this.postModel.findById(id);
  }

  async upload(file: Express.Multer.File): Promise<string> {
    // const validFormats = ['image/jpeg', 'image/png', 'image/gif'];
    // if (!validFormats.includes(file.mimetype)) {
    //   return {
    //     statusCode: 400,
    //     message: 'Invalid file format. Supported formats: JPG, PNG, GIF.',
    //   };
    // }
    // if (file.size > 102400) {
    //   return {
    //     statusCode: 400,
    //     message: 'File size exceeds the limit (100KB).',
    //   };
    // }
    const user: CachedUserDTO = await this.cacheManager.get('cachedUser');

    const fileDestination = 'uploads/' + user.sub  + '/' + file.originalname;

    const fileStream = createWriteStream(fileDestination);
    fileStream.write(file.buffer);
    fileStream.end();
    return fileDestination;
  }

  async createPost(req: Request): Promise<object> {
    const createPost  = req.body;
    //@ts-ignore
    const file = createPost?.file;

    const createdAt = format(new Date(), "dd.MM.yy 'в' k:mm");
    
    let user: CachedUserDTO = await this.cacheManager.get('cachedUser');
    if (!user) {
      //@ts-ignore
      const token = req.headers.authorization.slice(7);
      const userFromToken = await this.authService.getUserFromToken(token);
      await this.cacheManager.set('cachedUser', userFromToken);
    }
    user = await this.cacheManager.get('cachedUser');

    const newPost = new this.postModel({
      ...createPost,
      createdAt,
      user: user.username,
    });
   
    await this.usersServise.addPostToUser(user.sub, newPost._id);

      //@ts-ignore
    if (!createPost.file) {
      const res = await this.messageProducer.sendMessageToQueue(
        JSON.stringify(newPost),
      );
      console.log('sendMessageToQueue ', res);
      return {
        statusCode: 201,
        message: 'Post was added',
      };
    } else {
      const filedest = await this.upload(file);
      newPost.filedest = filedest;
      await this.messageProducer.sendMessageToQueue(JSON.stringify(newPost));
     
      return {
        statusCode: 201,
        message: 'Post was added',
      };
    }
  }
}
