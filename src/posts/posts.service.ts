import { Injectable, NotFoundException } from '@nestjs/common';
import { IPost } from './posts.interface';

@Injectable()
export class PostsService {
  private posts: IPost[] = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      author: 'Author 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content 2',
      author: 'Author 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  private getNewPostId(): number {
    return this.posts.length > 1
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }

  createPost(payload: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>): IPost {
    this.posts.push({
      ...payload,
      id: this.getNewPostId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.posts[this.posts.length - 1];
  }

  getPosts(): IPost[] {
    return this.posts;
  }

  getPostById(id: number): IPost {
    const result = this.posts.find((post) => post.id === id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return result;
  }

  updatePost(id: number, post: Partial<Omit<IPost, 'id' | 'createdAt'>>) {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      throw new NotFoundException('Post not found');
    }
    // ensure only update the payload properties
    this.posts[index] = {
      ...this.posts[index],
      ...post,
      updatedAt: new Date(),
    };
    return this.posts[index];
  }

  deletePost(id: number) {
    const postIndexToDelete = this.posts.findIndex((post) => post.id === id);
    if (postIndexToDelete === -1) {
      throw new NotFoundException('Post not found');
    }
    this.posts.splice(postIndexToDelete, 1);
    return {
      message: 'Post deleted successfully',
      deletedPost: this.posts[postIndexToDelete],
    };
  }
}
