import prisma from "../../client";
import { LikeContent } from "./types";

export async function createLike(like: LikeContent) {
  if (!like.postId || !like.userId) {
    throw new Error("Missing required fields");
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

export async function getLikeById(id: number) {
  return await prisma.like.findUnique({
    where: { id },
  });
}

export async function deleteLike(id: number) {
  return await prisma.like.delete({
    where: { id },
  });
}
