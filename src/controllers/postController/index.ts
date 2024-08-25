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
import expressAsyncHandler from 'express-async-handler';

export const createPostController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const post = await createPost(req.body);
    res.status(HttpStatus.Created).json(post);
  },
);

export const getPostController = expressAsyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  const post = await getPostById(postId);
  res.status(HttpStatus.OK).json(post);
});

export const updatePostController = expressAsyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  const post = await updatePost({ ...req.body, id: postId });
  res.status(HttpStatus.OK).json(post);
});

export const deletePostController = expressAsyncHandler(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  if (isNaN(postId)) {
    throw new HttpError(ERROR_MESSAGES.post.invalidId, HttpStatus.BadRequest);
  }
  await deletePost(postId);
  res.status(HttpStatus.NoContent).send();
});
