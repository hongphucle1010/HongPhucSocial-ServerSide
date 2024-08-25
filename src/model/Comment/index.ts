import { Comment } from '@prisma/client';
import prisma from '../../client';
import { CommentContent, CommentUpdateContent } from './types';

export async function createComment(comment: CommentContent): Promise<Comment> {
  if (!comment.content || !comment.postId || !comment.authorId) {
    throw new Error('Missing required fields');
  }
  return await prisma.comment.create({
    data: {
      ...comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

export async function getCommentById(id: number): Promise<Comment | null> {
  return prisma.comment.findUnique({
    where: { id },
  });
}

export async function updateComment(
  comment: CommentUpdateContent,
): Promise<Comment> {
  if (!comment.id) {
    throw new Error('id is required');
  }
  return await prisma.comment.update({
    where: { id: comment.id },
    data: {
      ...comment,
      updatedAt: new Date(),
    },
  });
}

export async function deleteComment(id: number): Promise<Comment> {
  return await prisma.comment.delete({
    where: { id },
  });
}
