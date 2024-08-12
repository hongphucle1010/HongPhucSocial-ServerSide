// Route: /api/v1/message
import express from "express";
import {
  getMessageByIdController,
  getMessageByUsernameController,
  sendMessageController,
} from "../../../controllers/messageController";

export const messageRouter = express.Router();

// messageRouter.get("/:username", getMessageByUsernameController);
messageRouter.get("/:id", getMessageByIdController);
messageRouter.post("/", sendMessageController);
