import prisma from "../../client";

interface CreateComment {
  content: string;
  postId: number;
  authorId: number;
}

export async function createComment(comment: CreateComment) {
  if (!comment.content || !comment.postId || !comment.authorId) {
    throw new Error("Missing required fields");
  }
  try {
    return await prisma.comment.create({
      data: {
        ...comment,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getCommentById(id: number) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

interface UpdateComment {
  id: number;
  content?: string;
}

export async function updateComment(comment: UpdateComment) {
  try {
    if (!comment.id) {
      throw new Error("id is required");
    }
    return await prisma.comment.update({
      where: { id: comment.id },
      data: {
        ...comment,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deleteComment(id: number) {
  return await prisma.comment.delete({
    where: { id },
  });
}
