import { NextFunction, Response } from "express";
import {
  createMessage,
  getMessageByPairId,
  getMessageByPairUsername,
  getMessageList,
} from "../../model/Message";
import { body } from "express-validator";
import { castToIntMiddleware, normalizeStringMiddleware } from "../validators";
import { normalize } from "path";
import { getProfileByUserId } from "../../model/Profile";

export async function getMessageByIdController(req: any, res: Response) {
  const id = parseInt(req.params.id);
  const myId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }

  if (!myId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const response = await getMessageByPairId(myId, id);
    const userProfile = await getProfileByUserId(id);
    res.status(200).json({ messageList: response, userProfile });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getMessageByUsernameController(req: any, res: Response) {
  const username = req.params.username;
  const myUsername = req.user.username;

  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }

  if (!myUsername) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const response = await getMessageByPairUsername(myUsername, username);
    res.status(200).json({ messageList: response });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export const sendMessageController = [
  castToIntMiddleware("receiverId"),
  normalizeStringMiddleware("message"),
  async function (req: any, res: Response) {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "receiverId and message is required" });
    }

    if (!senderId) {
      return res.status(400).json({ message: "Invalid user" });
    }

    try {
      const response = await createMessage({
        senderId,
        receiverId,
        content: message,
      });
      res.status(200).json(response);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  },
];

export async function getMessageListController(req: any, res: Response) {
  const myId = req.user.id;

  if (!myId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const response = await getMessageList(myId);
    res.status(200).json(response);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
}
