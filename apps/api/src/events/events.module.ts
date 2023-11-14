import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { PostModule } from 'src/express/post.module';
import { PostsService } from 'src/express/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from 'src/express/schemas/post.schema';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [EventsGateway, PostsService, MessageProducer, AuthService],
  exports: [EventsGateway],
  imports: [
    PostModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
  ]
})
export class EventsModule {}
