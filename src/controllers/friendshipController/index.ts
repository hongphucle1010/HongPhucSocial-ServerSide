import { FriendshipStatus } from "@prisma/client";
import {
  deleteFriendshipByPairId,
  getFriendshipByPairId,
  getFriendshipByPairUsername,
  sendFriendshipRequest,
  ClientFriendshipStatus,
} from "../../model/Friendship";
import { Response } from "express";

export async function getFriendshipController(req: any, res: Response) {
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
    res.status(400).json({ error: "Cannot send friendship request to self" });
    return;
  }
  try {
    const response = await sendFriendshipRequest(requesterId, requesteeId);
    if (response.status === FriendshipStatus.pending) {
      res.status(200).json({
        message: "Friendship request sent",
        status: ClientFriendshipStatus.pendingToBeAccepted,
      });
    } else {
      res.status(200).json({
        message: "Accepted friendship request",
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
    res.status(200).json({ message: "Friendship deleted", response });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}
