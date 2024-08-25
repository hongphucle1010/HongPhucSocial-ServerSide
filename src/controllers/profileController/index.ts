import { Request, Response } from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileByUsername,
} from '../../model/Profile';
import { FriendshipStatus } from '@prisma/client';
import { getFriendshipByPairId } from '../../model/Friendship';
import { ClientFriendshipStatus } from '../../model/Friendship/types';
import { HttpStatus } from '../../lib/statusCode';
import { HttpError } from '../../lib/error/HttpErrors';
import ERROR_MESSAGES from '../../configs/errorMessages';
import { ProfileRequestByUsername } from './types';

export async function createProfileController(req: Request, res: Response) {
  const profile = await createProfile(req.body);
  res.status(HttpStatus.Created).json(profile);
}

export async function getProfileController(req: Request, res: Response) {
  const profileId = parseInt(req.params.id);
  if (isNaN(profileId)) {
    throw new HttpError(
      ERROR_MESSAGES.profile.invalidId,
      HttpStatus.BadRequest,
    );
  }
  const profile = await getProfile(profileId);
  res.status(HttpStatus.OK).json(profile);
}

export async function getProfileByUsernameController(
  req: ProfileRequestByUsername,
  res: Response,
) {
  const username = req.params.username;
  const profile = await getProfileByUsername(username);
  const currentUserId = parseInt(req.query.currentUserId);

  const findFriendStatus = async () => {
    if (!currentUserId) {
      return FriendshipStatus.none;
    } else if (!profile.userId) {
      return FriendshipStatus.none;
    } else if (profile.userId === req.user.id) {
      return FriendshipStatus.none;
    } else {
      // Find friendship status
      const friendshipStatus = await getFriendshipByPairId(
        currentUserId,
        profile.userId,
      );
      if (!friendshipStatus?.status) {
        return FriendshipStatus.none;
      }
      if (friendshipStatus.status === FriendshipStatus.pending) {
        if (friendshipStatus.requesterId === currentUserId) {
          return ClientFriendshipStatus.pendingToBeAccepted;
        } else return ClientFriendshipStatus.pendingToAccept;
      }
      return friendshipStatus.status;
    }
  };

  const friendStatus = await findFriendStatus();

  const user = {
    profile: profile,
    username: username,
    friendStatus: friendStatus,
  };
  res.status(HttpStatus.OK).json(user);
}

export async function updateProfileController(req: Request, res: Response) {
  const profileId = parseInt(req.params.id);
  if (isNaN(profileId)) {
    throw new HttpError(
      ERROR_MESSAGES.profile.invalidId,
      HttpStatus.BadRequest,
    );
  }
  const profile = await updateProfile({ ...req.body, id: profileId });
  res.status(HttpStatus.OK).json(profile);
}

export async function deleteProfileController(req: Request, res: Response) {
  const profileId = parseInt(req.params.id);
  if (isNaN(profileId)) {
    throw new HttpError(
      ERROR_MESSAGES.profile.invalidId,
      HttpStatus.BadRequest,
    );
  }
  await deleteProfile(profileId);
  res.status(HttpStatus.NoContent).send();
}
