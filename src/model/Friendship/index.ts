import { FriendshipStatus } from "@prisma/client";
import prisma from "../../client";

interface CreateFriendship {
  requesterId: number;
  requesteeId: number;
  status: FriendshipStatus;
}

export async function createFriendship(friendship: CreateFriendship) {
  if (
    !friendship.requesterId ||
    !friendship.requesteeId ||
    !friendship.status
  ) {
    throw new Error("Missing required fields");
  }
  try {
    return await prisma.friendship.create({
      data: {
        ...friendship,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getFriendshipById(id: number) {
  return await prisma.friendship.findUnique({
    where: { id },
  });
}

interface UpdateFriendship {
  id: number;
  status?: FriendshipStatus;
}

export async function updateFriendship(friendship: UpdateFriendship) {
  try {
    if (!friendship.id) {
      throw new Error("id is required");
    }
    return await prisma.friendship.update({
      where: { id: friendship.id },
      data: {
        ...friendship,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deleteFriendship(id: number) {
  return await prisma.friendship.delete({
    where: { id },
  });
}

export async function getFriendshipByPairId(id1: number, id2: number) {
  try {
    const response = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: id1,
            requesteeId: id2,
          },
          {
            requesterId: id2,
            requesteeId: id1,
          },
        ],
      },
    });
    return response;
  } catch (e: any) {
    return null;
  }
}

export async function getFriendshipByPairUsername(
  username1: string,
  username2: string
) {
  return await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          requester: {
            username: username1,
          },
          requestee: {
            username: username2,
          },
        },
        {
          requester: {
            username: username2,
          },
          requestee: {
            username: username1,
          },
        },
      ],
    },
  });
}

export async function sendFriendshipRequest(
  requesterId: number,
  requesteeId: number
) {
  try {
    // Find if requestee has already sent a request to requester
    const friendship = await getFriendshipByPairId(requesteeId, requesterId);
    if (friendship) {
      if (friendship.status === FriendshipStatus.pending) {
        if (friendship.requesterId === requesterId) {
          throw new Error("Friendship request already sent");
        }
        // Else then accept the request
        else {
          const response = await updateFriendship({
            id: friendship.id,
            status: FriendshipStatus.accepted,
          });
          return response;
        }
      }
      if (friendship.status === FriendshipStatus.accepted) {
        throw new Error("Friendship already exists");
      }
      const response = await updateFriendship({
        id: friendship.id,
        status: FriendshipStatus.pending,
      });
      return response;
    }
    const response = await createFriendship({
      requesterId,
      requesteeId,
      status: FriendshipStatus.pending,
    });
    return response;
  } catch (e: any) {
    throw e;
  }
}

export async function deleteFriendshipByPairId(id1: number, id2: number) {
  const response = await prisma.friendship.deleteMany({
    where: {
      OR: [
        {
          requesterId: id1,
          requesteeId: id2,
        },
        {
          requesterId: id2,
          requesteeId: id1,
        },
      ],
    },
  });
  return response;
}
