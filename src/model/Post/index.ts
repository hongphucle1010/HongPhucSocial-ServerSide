import prisma from "../../client";

interface CreatePost {
  content: string;
  authorId: number;
}

export async function createPost(post: CreatePost) {
  if (!post.content || !post.authorId) {
    throw new Error("Missing required fields");
  }
  try {
    return await prisma.post.create({
      data: {
        ...post,
        authorId:
          typeof post.authorId === "string"
            ? parseInt(post.authorId)
            : post.authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getPostById(id: number) {
  try {
    return await prisma.post.findUnique({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      throw new Error("Post not found");
    }
    throw e;
  }
}

interface UpdatePost {
  id: number;
  content?: string;
}

export async function updatePost(post: UpdatePost) {
  try {
    if (!post.id) {
      throw new Error("id is required");
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

export async function deletePost(id: number) {
  try {
    return await prisma.post.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      throw new Error("Post not found");
    }
    throw e;
  }
}
