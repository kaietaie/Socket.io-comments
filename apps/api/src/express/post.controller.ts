import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  Request,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPosts(@Request() req): Promise<Posts[]> {
    return this.postsService.getAllPosts(req);
  }

  @Get(':id')
  getPost(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getPostById(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createNewPost(@Request() req): Promise<object> {
    return this.postsService.createPost(req);
  }

  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  console.log(file);
}
}
