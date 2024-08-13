// Route: /api/v1/friendship
import express from "express";
import {
  deleteFriendshipController,
  getFriendshipController,
  getListOfFriendsController,
  sendFriendshipRequestController,
} from "../../../controllers/friendshipController";
import {
  blockNotLoggedIn,
  isLoginAuth,
} from "../../../controllers/authController/login";

export const friendshipRouter = express.Router();

friendshipRouter.get("/", getFriendshipController);
friendshipRouter.post("/", [
  isLoginAuth,
  blockNotLoggedIn,
  sendFriendshipRequestController,
]);
friendshipRouter.delete("/", [
  isLoginAuth,
  blockNotLoggedIn,
  deleteFriendshipController,
]);
friendshipRouter.get("/list", [
  isLoginAuth,
  blockNotLoggedIn,
  getListOfFriendsController,
]);
