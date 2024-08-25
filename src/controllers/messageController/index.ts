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
import { GetMessageByIdResponse, GetMessageResponse } from './types';
import { MessageContent, MessageListElement } from 'src/model/Message/types';

export const getMessageByIdController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const myId = req.user.id;

    if (!id) {
      throw new HttpError(
        ERROR_MESSAGES.other.missingId,
        HttpStatus.BadRequest,
      );
    }

    if (isNaN(id)) {
      throw new HttpError(
        ERROR_MESSAGES.other.invalidId,
        HttpStatus.BadRequest,
      );
    }

    if (!myId) {
      throw new HttpError(
        ERROR_MESSAGES.other.invalidUser,
        HttpStatus.BadRequest,
      );
    }

    const getMessageResult = await getMessageByPairId(myId, id);
    const userProfile = await getProfileByUserId(id);
    const response: GetMessageByIdResponse = {
      messageList: getMessageResult,
      userProfile,
    };
    res.status(HttpStatus.OK).json(response);
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

    const getMessageResult = await getMessageByPairUsername(
      myUsername,
      username,
    );
    const response: GetMessageResponse = { messageList: getMessageResult };
    res.status(HttpStatus.OK).json(response);
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

    const response: MessageContent = await createMessage({
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

    const response: MessageListElement[] = await getMessageList(myId);
    res.status(HttpStatus.OK).json(response);
  },
);
