import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Authentication } from "@nestjs-cognito/auth";
import { CreatePostDTO } from './dto/create-post.dto';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
// @Authentication()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  getAllPosts(): Promise<Posts[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string): Promise<Posts> {
    return this.postsService.getPostById(id);
  }

//   @Post()
//   create(@Body() createPost: CreatePostDTO): object {-
//     return this.postsService.createPost(createPost);
//   }

  @Post()
  @UseInterceptors(FileInterceptor('file')) 
  async uploadFile(
    @UploadedFile( ) file: Express.Multer.File,
    @Body() createPost: CreatePostDTO,
  ): Promise<object> {
    return this.postsService.createPost(file, createPost);
  }
}
