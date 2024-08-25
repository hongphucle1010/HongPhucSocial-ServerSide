import { NextFunction, Request, Response } from 'express';
import {
  createMessage,
  getMessageByPairId,
  getMessageByPairUsername,
  getMessageList,
} from '../../model/Message';
import { castToIntMiddleware, normalizeStringMiddleware } from '../validators';
import { getProfileByUserId } from '../../model/Profile';
import { HttpError } from '../../lib/error/HttpErrors';
import { HttpStatus } from '../../lib/statusCode';
import ERROR_MESSAGES from '../../configs/errorMessages';
import expressAsyncHandler from 'express-async-handler';

export const getMessageByIdController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const myId = req.user.id;

    if (!id) {
      throw new HttpError('id is required', HttpStatus.BadRequest);
    }

    if (isNaN(id)) {
      throw new HttpError('Invalid id', HttpStatus.BadRequest);
    }

    if (!myId) {
      throw new HttpError('Invalid user', HttpStatus.BadRequest);
    }

    const response = await getMessageByPairId(myId, id);
    const userProfile = await getProfileByUserId(id);
    res.status(HttpStatus.OK).json({ messageList: response, userProfile });
  },
);

export const getMessageByUsernameController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const username = req.params.username;
    const myUsername = req.user.username;

    if (!username) {
      throw new HttpError(
        ERROR_MESSAGES.message.missingUsername,
        HttpStatus.BadRequest,
      );
    }

    if (!myUsername) {
      throw new HttpError(
        ERROR_MESSAGES.other.invalidUser,
        HttpStatus.BadRequest,
      );
    }

    const response = await getMessageByPairUsername(myUsername, username);
    res.status(HttpStatus.OK).json({ messageList: response });
  },
);

export const sendMessageController = [
  castToIntMiddleware('receiverId'),
  normalizeStringMiddleware('message'),
  expressAsyncHandler(async function (req: any, res: Response) {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      throw new HttpError(
        ERROR_MESSAGES.message.missingReceiverIdAndMessage,
        HttpStatus.BadRequest,
      );
    }

    if (!senderId) {
      throw new HttpError(
        ERROR_MESSAGES.other.invalidUser,
        HttpStatus.BadRequest,
      );
    }

    const response = await createMessage({
      senderId,
      receiverId,
      content: message,
    });
    res.status(HttpStatus.OK).json(response);
  }),
];

export const getMessageListController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const myId = req.user.id;

    if (!myId) {
      throw new HttpError(
        ERROR_MESSAGES.other.invalidUser,
        HttpStatus.BadRequest,
      );
    }

    const response = await getMessageList(myId);
    res.status(HttpStatus.OK).json(response);
  },
);
