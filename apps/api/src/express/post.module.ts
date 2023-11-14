import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './schemas/post.schema';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [PostsService, MessageProducer, AuthService],
  controllers: [PostsController],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    CacheModule.register({
      tll:360000,
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads'
    }),
  ],
  exports: [PostsService]
})
export class PostModule {}
