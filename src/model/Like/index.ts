import prisma from '../../client';
import { LikeContent } from './types';

export async function createLike(like: LikeContent): Promise<LikeContent> {
  if (!like.postId || !like.userId) {
    throw new Error('Missing required fields');
  }
  try {
    return await prisma.like.create({
      data: {
        ...like,
        createdAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getLikeById(id: number): Promise<LikeContent | null> {
  return await prisma.like.findUnique({
    where: { id },
  });
}

export async function deleteLike(id: number): Promise<LikeContent> {
  return await prisma.like.delete({
    where: { id },
  });
}
