import { Request, Response } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getProfileByUserId,
  getProfileByUsername,
} from "../../model/Profile";
import { FriendshipStatus } from "@prisma/client";
import {
  getFriendshipByPairId,
} from "../../model/Friendship";
import { ClientFriendshipStatus } from "../../model/Friendship/types";

export async function createProfileController(req: Request, res: Response) {
  try {
    const profile = await createProfile(req.body);
    res.status(201).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getProfileController(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    const profile = await getProfile(profileId);
    res.status(200).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function getProfileByUsernameController(req: any, res: Response) {
  try {
    const username = req.params.username;
    const profile = await getProfileByUsername(username);
    const currentUserId = parseInt(req.query?.currentUserId);

    const findFriendStatus = async () => {
      if (!currentUserId) {
        return FriendshipStatus.none;
      } else if (!profile?.userId) {
        return FriendshipStatus.none;
      } else if (profile?.userId === (req?.user as any)?.id) {
        return FriendshipStatus.none;
      } else {
        // Find friendship status
        const friendshipStatus = await getFriendshipByPairId(
          currentUserId,
          profile.userId
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
    res.status(200).json(user);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function updateProfileController(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    const profile = await updateProfile({ ...req.body, id: profileId });
    res.status(200).json(profile);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

export async function deleteProfileController(req: Request, res: Response) {
  try {
    const profileId = parseInt(req.params.id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID");
    }
    await deleteProfile(profileId);
    res.status(204).send();
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
