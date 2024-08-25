import { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  getUserByUsername,
  getPasswordById,
} from '../../model/User';
import {
  getUserWithProfile,
  updateUserWithProfile,
} from '../../model/UserWithProfile';
import bcryptjs from 'bcryptjs';
import { HttpStatus } from '../../lib/statusCode';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';
import SUCCESS_MESSAGES from '../../configs/successMessages';
import expressAsyncHandler from 'express-async-handler';
import { User } from '@prisma/client';
import { UserWithProfile } from 'src/model/UserWithProfile/types';

export const createUserController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: User = await createUser(req.body);
    res.status(HttpStatus.Created).json(user);
  },
);

export const getUserByIdController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new HttpError(ERROR_MESSAGES.user.invalidId, HttpStatus.BadRequest);
    }
    const user: Omit<User, 'password'> = await getUserById(userId);
    if (!user) {
      throw new HttpError(ERROR_MESSAGES.user.notFound, HttpStatus.NotFound);
    }
    res.status(HttpStatus.OK).json(user);
  },
);

export const getUserByUsernameController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: User = await getUserByUsername(req.params.username);
    if (!user) {
      throw new HttpError(ERROR_MESSAGES.user.notFound, HttpStatus.NotFound);
    }
    res.status(HttpStatus.OK).json(user);
  },
);

export const updateUserController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      throw new HttpError(ERROR_MESSAGES.user.invalidId, HttpStatus.BadRequest);
    }
    const user: User = await updateUser({ ...req.body, id: userId });
    res.status(HttpStatus.OK).json(user);
  },
);

export const getUserController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new HttpError(ERROR_MESSAGES.user.notFound, HttpStatus.NotFound);
    }
    const user: UserWithProfile = await getUserWithProfile(req.user.id);
    if (!user) {
      throw new HttpError(ERROR_MESSAGES.user.notFound, HttpStatus.NotFound);
    }
    res.status(HttpStatus.OK).json({ ...user });
  },
);

export const updateUserWithProfileController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // const userId = parseInt(req.user?.id);
    const userId = req.user?.id;
    if (userId === undefined) {
      throw new HttpError(ERROR_MESSAGES.user.invalidId, HttpStatus.BadRequest);
    }
    console.log(req.body);
    const user: UserWithProfile = await updateUserWithProfile(userId, req.body);
    const { password, ...userWithoutPassword } = user;
    res.status(HttpStatus.OK).json(userWithoutPassword);
  },
);

export const updatePasswordController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // const userId = parseInt(req.user?.id);
    const userId = req.user?.id;
    if (userId === undefined) {
      throw new HttpError(ERROR_MESSAGES.user.invalidId, HttpStatus.BadRequest);
    }

    const user = await getPasswordById(userId);
    if (!user) {
      throw new HttpError(ERROR_MESSAGES.user.notFound, HttpStatus.NotFound);
    }
    const { password } = user;
    if (bcryptjs.compareSync(req.body.password, password)) {
      const newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
      const user: User = await updateUser({
        id: userId,
        password: newPassword,
      });
      res.status(HttpStatus.OK).json({
        message: SUCCESS_MESSAGES.user.updatePassword,
      });
    } else {
      throw new HttpError(
        ERROR_MESSAGES.user.incorrectPassword,
        HttpStatus.BadRequest,
      );
    }
  },
);
