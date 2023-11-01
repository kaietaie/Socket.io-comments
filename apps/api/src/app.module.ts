import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { PostGraphModule } from './graphql/post.graph.module';
import { PostModule } from './express/post.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { SQSModule } from './aws-sqs/sqs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '../../../.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://kaieta:t13zh92wnb@cluster0.sg9jpxp.mongodb.net/?retryWrites=true&w=majority',
    ),
    SQSModule,
    PostModule,
    PostGraphModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
