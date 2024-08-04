import prisma from "../../client";

interface CreateFriendship {
  requesterId: number;
  requesteeId: number;
  status: string;
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
  status?: string;
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
