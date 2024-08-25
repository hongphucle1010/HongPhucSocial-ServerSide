import { FriendshipStatus } from '@prisma/client';
import { Request } from 'express';
import { ParsedQs } from 'qs';
import {
  ClientFriendshipStatus,
  FriendsList,
  FriendsListProfile,
} from 'src/model/Friendship/types';

interface FriendshipQuery extends ParsedQs {
  id1: string;
  id2: string;
}

export interface FriendshipRequest extends Request {
  query: FriendshipQuery;
}

export interface GetFriendshipResponse {
  status: FriendshipStatus;
}

export interface SendFriendshipRequestResponse {
  message: string;
  status: ClientFriendshipStatus | FriendshipStatus;
}

export interface FriendsListResponse extends FriendsListProfile {
  userId: number;
}
