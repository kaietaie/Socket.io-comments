import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from 'src/graphql/post.service';
import { PostResolver } from 'src/graphql/post.resolver';
import { Posts, PostsSchema } from './schemas/post.schema';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';


@Module({
    providers: [
        PostService, 
        PostResolver 
    ],
    imports: [
        MongooseModule.forFeature([
            {name: Posts.name, schema: PostsSchema}
        ]),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            subscriptions: {
                'graphql-ws': true,
              },
            autoSchemaFile: 'src/schema.gql',
            sortSchema: true,
            useGlobalPrefix:true,
            playground: true,
          }),
    ]
})
export class PostGraphModule {}
