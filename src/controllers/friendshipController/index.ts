import { FriendshipStatus } from '@prisma/client';
import {
  deleteFriendshipByPairId,
  getFriendshipByPairId,
  sendFriendshipRequest,
  getListOfFriends,
} from '../../model/Friendship';
import { Request, Response } from 'express';
import { ClientFriendshipStatus } from '../../model/Friendship/types';
import {
  FriendshipRequest,
  FriendsListResponse,
  GetFriendshipResponse,
  SendFriendshipRequestResponse,
} from './types';
import { HttpStatus } from '../../lib/statusCode';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';
import SUCCESS_MESSAGES from '../../configs/successMessages';
import expressAsyncHandler from 'express-async-handler';

export const getFriendshipController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id1 = parseInt(req.query.id1 as string);
    const id2 = parseInt(req.query.id2 as string);

    const friendship = await getFriendshipByPairId(id1, id2);
    const friendshipStatus = friendship
      ? friendship.status
      : FriendshipStatus.none;
    const response: GetFriendshipResponse = { status: friendshipStatus };
    res.status(HttpStatus.OK).json(response);
  },
);

export const sendFriendshipRequestController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const requesterId = req.user.id;
    const requesteeId = parseInt(req.body.requesteeId);
    if (requesterId === requesteeId) {
      throw new HttpError(
        ERROR_MESSAGES.friendship.selfRequest,
        HttpStatus.BadRequest,
      );
    }
    const requestResult = await sendFriendshipRequest(requesterId, requesteeId);

    const response: SendFriendshipRequestResponse =
      requestResult.status === FriendshipStatus.pending
        ? {
            // Pending status
            message: SUCCESS_MESSAGES.friendship.friendshipRequestSent,
            status: ClientFriendshipStatus.pendingToBeAccepted,
          }
        : {
            // Accepted status
            message: SUCCESS_MESSAGES.friendship.acceptedFriendshipRequest,
            status: requestResult.status,
          };
    res.status(HttpStatus.OK).json(response);
  },
);

export const deleteFriendshipController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id1 = req.user.id;
    const id2 = parseInt(req.body.id);

    const response = await deleteFriendshipByPairId(id1, id2);
    const responseWithMessage: MyResponse.ResponseWithMessage = {
      message: SUCCESS_MESSAGES.friendship.friendshipDeleted,
      response,
    };
    res.status(HttpStatus.OK).json(responseWithMessage);
  },
);

export const getListOfFriendsController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user.id;

    const friends = await getListOfFriends(id);
    const friendsList = friends.map((friend): FriendsListResponse => {
      if (friend.requesteeId === id)
        return { userId: friend.requesterId, ...friend.requester };
      else return { userId: friend.requesteeId, ...friend.requestee };
    });
    res.status(HttpStatus.OK).json({ friendsList });
  },
);
