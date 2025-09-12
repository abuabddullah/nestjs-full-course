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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import * as postsInterface from './posts.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Body()
    payload: Omit<postsInterface.IPost, 'id' | 'createdAt' | 'updatedAt'>,
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
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    payload: Partial<Omit<postsInterface.IPost, 'id' | 'createdAt'>> | any,
  ) {
    return this.postsService.updatePost(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    const result = this.postsService.deletePost(id);
    return result;
  }
}
