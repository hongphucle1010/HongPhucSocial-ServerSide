import { Request, Response } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from "../../model/Post";

export async function createPostController(req: Request, res: Response) {
  try {
    const post = await createPost(req.body);
    res.status(201).json(post);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getPostController(req: Request, res: Response) {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      throw new Error("Invalid post ID");
    }
    const post = await getPostById(postId);
    res.status(200).json(post);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updatePostController(req: Request, res: Response) {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      throw new Error("Invalid post ID");
    }
    const post = await updatePost({ ...req.body, id: postId });
    res.status(200).json(post);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function deletePostController(req: Request, res: Response) {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      throw new Error("Invalid post ID");
    }
    await deletePost(postId);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
