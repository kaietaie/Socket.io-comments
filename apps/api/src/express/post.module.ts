import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './schemas/post.schema';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [PostsService, MessageProducer, AuthService],
  controllers: [PostsController],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
  ],
})
export class PostModule {}
