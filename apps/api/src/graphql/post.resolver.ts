import { Resolver, Query, Mutation, Args, ID, Subscription } from '@nestjs/graphql';
import { Posts } from './schemas/post.schema';
import { PostService } from './post.service';
import { MakePostDTO } from './dto/create-post.dto';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Posts)
export class PostResolver {
    constructor(private readonly postService: PostService) {}

  @Query(() => [Posts])
  async AllPosts(): Promise<Posts[]> {
    return this.postService.getAllPosts();
  }

  @Query(() => Posts)
  async OnePost(@Args('id', { type: () => ID }) id: string): Promise<Posts> {
    return this.postService.getPostById(id);
  }

  @Mutation(() => Posts)
  async MakePost(
    @Args('data') MakePost:MakePostDTO) {
    const newPost = this.postService.createPost(MakePost);
    pubSub.publish('commentAdded', { commentAdded: newPost });
    return newPost;
  }

  @Subscription(() => Posts)
  commentAdded() {
    return pubSub.asyncIterator('commentAdded');
  }

}
