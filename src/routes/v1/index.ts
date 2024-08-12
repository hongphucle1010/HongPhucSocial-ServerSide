// Route: /api/v1
import express from "express";
import { userRouter } from "./userRouter";
import { adminRouter } from "./adminRouter";
import { profileRouter } from "./profileRouter";
import { postRouter } from "./postRouter";
import { authRouter } from "./userRouter/auth";
import {
  blockNotLoggedIn,
  isLoginAuth,
} from "../../controllers/authController/login";
import { friendshipRouter } from "./friendshipRouter";
import { messageRouter } from "./messageRouter";
import { getMessageListController } from "../../controllers/messageController";

export const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/admin/", [isLoginAuth, blockNotLoggedIn, adminRouter]);
routes.use("/profile", profileRouter);
routes.use("/post", postRouter);
routes.use("/auth", [isLoginAuth, authRouter]);
routes.use("/friendship", friendshipRouter);
routes.use("/message", [isLoginAuth, blockNotLoggedIn, messageRouter]);
routes.use("/messageList", [
  isLoginAuth,
  blockNotLoggedIn,
  getMessageListController,
]);
