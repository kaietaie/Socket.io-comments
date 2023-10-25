import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostsService } from './post.service';
import { Posts } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService:PostsService ) {}
    @Get()
    getAllPosts(): Promise<Posts[]> {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    getPost(@Param('id') id: string): Promise<Posts> {
        return this.postsService.getPostById(id)
    }

    @Post()
    create(@Body() createPost: CreatePostDTO): object {
        return this.postsService.createPost(createPost)
    }

}
