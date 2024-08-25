import { Post } from '@prisma/client';
import prisma from '../../client';
import { CreatePost, UpdatePost } from './types';

export async function createPost(post: CreatePost): Promise<Post> {
  if (!post.content || !post.authorId) {
    throw new Error('Missing required fields');
  }
  return await prisma.post.create({
    data: {
      ...post,
      authorId:
        typeof post.authorId === 'string'
          ? parseInt(post.authorId)
          : post.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getPostById(id: number): Promise<Post | null> {
  try {
    return await prisma.post.findUnique({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === 'P2025') {
      throw new Error('Post not found');
    }
    throw e;
  }
}

export async function updatePost(post: UpdatePost): Promise<Post> {
  try {
    if (!post.id) {
      throw new Error('id is required');
    }
    return await prisma.post.update({
      where: { id: post.id },
      data: {
        ...post,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deletePost(id: number): Promise<Post> {
  try {
    return await prisma.post.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === 'P2025') {
      throw new Error('Post not found');
    }
    throw e;
  }
}
