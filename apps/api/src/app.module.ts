import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { PostGraphModule } from './graphql/post.graph.module';
import { PostModule } from './express/post.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { SQSModule } from './aws-sqs/sqs.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule,
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '../../../.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
      // rootPath: join(__dirname, '../', 'uploads'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://kaieta:t13zh92wnb@cluster0.sg9jpxp.mongodb.net/?retryWrites=true&w=majority',
    ),
    SQSModule,
    PostModule,
    PostGraphModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
