import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CacheInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @Get()
  getAllPosts(): Promise<Posts[]> {
    return this.postsService.getAllPosts();
  }
 

  @Get('file/:filedest')
  getFile(@Param('filedest') filedest) {
    const file = JSON.parse(filedest)
   return this.postsService.getFile(file);
  }
}
