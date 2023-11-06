import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  Request,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPosts(): Promise<Posts[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getPostById(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createNewPost(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 102400 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|txt)$/ }),
        ],
      }),
      )
      file: Express.Multer.File,
      ): Promise<object> {
    return this.postsService.createPost(req, file);
  }

}
