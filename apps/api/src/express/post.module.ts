import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './schemas/post.schema';
import { MessageProducer } from 'src/aws-sqs/producer.service';

@Module({
    providers: [
        PostsService, MessageProducer
        ],
    controllers: [PostsController],
    imports: [
        MongooseModule.forFeature([
            {name: Posts.name, schema: PostsSchema}
        ]),
    ]
})
export class PostModule {}
