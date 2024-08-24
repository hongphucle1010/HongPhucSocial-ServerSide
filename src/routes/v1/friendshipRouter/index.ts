// Route: /api/v1/friendship
import express, { Request } from 'express';
import {
  deleteFriendshipController,
  getFriendshipController,
  getListOfFriendsController,
  sendFriendshipRequestController,
} from '../../../controllers/friendshipController';

export const friendshipRouter = express.Router();

friendshipRouter.get('/', getFriendshipController);
friendshipRouter.post('/', sendFriendshipRequestController);
friendshipRouter.delete('/', deleteFriendshipController);
friendshipRouter.get('/list', getListOfFriendsController);
