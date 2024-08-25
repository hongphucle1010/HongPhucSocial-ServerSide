import { ParsedQs } from 'qs';
import { Request } from 'express';
import { FriendshipStatus, Profile } from '@prisma/client';
import { ClientFriendshipStatus } from 'src/model/Friendship/types';

interface ProfileQueryByUsername extends ParsedQs {
  currentUserId: string;
}

export interface ProfileRequestByUsername extends Request {
  query: ProfileQueryByUsername;
}

export interface GetProfileByUsernameResponse {
  username: string;
  profile: Omit<Profile, 'id'>;
  friendStatus: ClientFriendshipStatus | FriendshipStatus;
}

export interface UploadAvatarResponse {
  message: string;
  url: string;
}