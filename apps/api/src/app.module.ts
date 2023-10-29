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
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import { SQSModule } from './aws-sqs/sqs.module';

@Module({
  imports: [
    // CognitoAuthModule.register({
    //   jwtVerifier: {
    //     userPoolId: "eu-central-1_jcneAGtZe",
    //     clientId: "api1fc2f33b",
    //     tokenUse: "id",
    //   }
    // }),
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
