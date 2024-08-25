import { FriendshipStatus } from '@prisma/client';

export const enum ClientFriendshipStatus {
  none = 'none',
  pendingToBeAccepted = 'pendingToBeAccepted',
  pendingToAccept = 'pendingToAccept',
  accepted = 'accepted',
  rejected = 'rejected',
}

export interface FriendshipCreateContent {
  requesterId: number;
  requesteeId: number;
  status: FriendshipStatus;
}

export interface FriendshipUpdateContent {
  id: number;
  status?: FriendshipStatus;
}

export interface FriendsListProfile {
  username: string;
  profile: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
  };
}

export interface FriendsList {
  requesteeId: number;
  requesterId: number;
  requestee: FriendsListProfile;
  requester: FriendsListProfile;
}
