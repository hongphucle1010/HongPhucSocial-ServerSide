import { FriendshipStatus } from '@prisma/client';
import {
  deleteFriendshipByPairId,
  getFriendshipByPairId,
  sendFriendshipRequest,
  getListOfFriends,
} from '../../model/Friendship';
import { Request, Response } from 'express';
import { ClientFriendshipStatus } from '../../model/Friendship/types';
import { FriendshipRequest } from './types';
import { HttpStatus } from '../../lib/statusCode';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';
import SUCCESS_MESSAGES from '../../configs/successMessages';
import expressAsyncHandler from 'express-async-handler';

// export async function getFriendshipController(
//   req: FriendshipRequest,
//   res: Response,
// ) {
//   const id1 = parseInt(req.query.id1);
//   const id2 = parseInt(req.query.id2);

//   const friendship = await getFriendshipByPairId(id1, id2);
//   const friendshipStatus = friendship
//     ? friendship.status
//     : FriendshipStatus.none;
//   res.status(HttpStatus.OK).json({ status: friendshipStatus });
// }
export const getFriendshipController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id1 = parseInt(req.query.id1 as string);
    const id2 = parseInt(req.query.id2 as string);

    const friendship = await getFriendshipByPairId(id1, id2);
    const friendshipStatus = friendship
      ? friendship.status
      : FriendshipStatus.none;
    res.status(HttpStatus.OK).json({ status: friendshipStatus });
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
    const response = await sendFriendshipRequest(requesterId, requesteeId);
    if (response.status === FriendshipStatus.pending) {
      res.status(HttpStatus.OK).json({
        message: SUCCESS_MESSAGES.friendship.friendshipRequestSent,
        status: ClientFriendshipStatus.pendingToBeAccepted,
      });
    } else {
      res.status(HttpStatus.OK).json({
        message: SUCCESS_MESSAGES.friendship.acceptedFriendshipRequest,
        status: response.status,
      });
    }
  },
);

export const deleteFriendshipController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id1 = req.user.id;
    const id2 = parseInt(req.body.id);

    const response = await deleteFriendshipByPairId(id1, id2);
    res
      .status(HttpStatus.OK)
      .json({
        message: SUCCESS_MESSAGES.friendship.friendshipDeleted,
        response,
      });
  },
);

export const getListOfFriendsController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user.id;

    const friends = await getListOfFriends(id);
    const friendsList = friends.map((friend) => {
      if (friend.requesteeId === id)
        return { userId: friend.requesterId, ...friend.requester };
      else return { userId: friend.requesteeId, ...friend.requestee };
    });
    res.status(HttpStatus.OK).json({ friendsList });
  },
);
