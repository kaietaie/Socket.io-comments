import {
  Controller,
  Get,
  Res,
  Param,
  UseInterceptors,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { Posts, PostsDocument } from './schemas/post.schema';
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
 

  @Get('file/:filename')
  getFile(@Param('filename') filename, @Res() res) {
    const response = res.sendFile(filename, { root: './uploads' }); 
    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
