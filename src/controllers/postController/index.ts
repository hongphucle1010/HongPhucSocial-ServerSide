import { Request, Response } from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from '../../model/Post';
import { HttpStatus } from '../../lib/statusCode';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';

export async function createPostController(req: Request, res: Response) {
  const post = await createPost(req.body);
  res.status(HttpStatus.Created).json(post);
}

export async function getPostController(req: Request, res: Response) {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  const post = await getPostById(postId);
  res.status(HttpStatus.OK).json(post);
}

export async function updatePostController(req: Request, res: Response) {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  const post = await updatePost({ ...req.body, id: postId });
  res.status(HttpStatus.OK).json(post);
}

export async function deletePostController(req: Request, res: Response) {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  await deletePost(postId);
  res.status(HttpStatus.NoContent).send();
}
