import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import * as postsInterface from './posts.interface';
import { CreatePostDto } from './postDTOsValidation/create-posts.dto';
import { UpdatePostDto } from './postDTOsValidation/update-posts.dto';
import { PostExistsPipe } from './postsPipes/post-exists.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  ) 
  createPost(
    @Body()
    payload: CreatePostDto,
  ): postsInterface.IPost {
    return this.postsService.createPost(payload);
  }

  @Get()
  getPosts(@Query('searchTerm') searchTerm: string): postsInterface.IPost[] {
    const allPosts = this?.postsService?.getPosts();
    if (searchTerm && typeof searchTerm === 'string') {
      return allPosts?.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return allPosts;
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe, PostExistsPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body()
    payload: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe, PostExistsPipe) id: number) {
    const result = this.postsService.deletePost(id);
    return result;
  }
}
