import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { PostGraphModule } from './graphql/post.graph.module';
import { PostModule } from './express/post.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://kaieta:t13zh92wnb@cluster0.sg9jpxp.mongodb.net/?retryWrites=true&w=majority',
    ),
    PostModule,
    PostGraphModule,
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
