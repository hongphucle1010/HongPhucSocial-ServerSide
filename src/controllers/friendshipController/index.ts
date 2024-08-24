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

export async function getFriendshipController(
  req: FriendshipRequest,
  res: Response,
) {
  const id1 = parseInt(req.query.id1);
  const id2 = parseInt(req.query.id2);

  try {
    const friendship = await getFriendshipByPairId(id1, id2);
    const friendshipStatus = friendship
      ? friendship.status
      : FriendshipStatus.none;
    res.status(200).json({ status: friendshipStatus });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

export async function sendFriendshipRequestController(req: any, res: Response) {
  const requesterId = req.user.id;
  const requesteeId = parseInt(req.body.requesteeId);
  if (requesterId === requesteeId) {
    res.status(400).json({ error: 'Cannot send friendship request to self' });
    return;
  }
  try {
    const response = await sendFriendshipRequest(requesterId, requesteeId);
    if (response.status === FriendshipStatus.pending) {
      res.status(200).json({
        message: 'Friendship request sent',
        status: ClientFriendshipStatus.pendingToBeAccepted,
      });
    } else {
      res.status(200).json({
        message: 'Accepted friendship request',
        status: response.status,
      });
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
}

export async function deleteFriendshipController(req: any, res: Response) {
  const id1 = req.user.id;
  const id2 = parseInt(req.body.id);

  try {
    const response = await deleteFriendshipByPairId(id1, id2);
    res.status(200).json({ message: 'Friendship deleted', response });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function getListOfFriendsController(req: any, res: Response) {
  const id = req.user.id;

  try {
    const friends = await getListOfFriends(id);
    const friendsList = friends.map((friend) => {
      if (friend.requesteeId === id)
        return { userId: friend.requesterId, ...friend.requester };
      else return { userId: friend.requesteeId, ...friend.requestee };
    });
    res.status(200).json({ friendsList });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}
