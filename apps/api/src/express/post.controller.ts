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
  Request,
  UseGuards,
} from '@nestjs/common';
import { Authentication } from "@nestjs-cognito/auth";
import { CreatePostDTO } from './dto/create-post.dto';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageProducer } from 'src/aws-sqs/producer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
// @Authentication()
export class PostsController {
  constructor(private readonly postsService: PostsService,
    private messageProducer: MessageProducer,) {}

  @UseGuards(AuthGuard('jwt'))
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
  @UseInterceptors() 
  async createNewPost(
    // @UploadedFile( ) file: Express.Multer.File,
    @Request() req,
  ): Promise<object> {
    return this.postsService.createPost(req);
  }
}
