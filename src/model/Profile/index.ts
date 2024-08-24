import prisma from "../../client";
import { ProfileCreateContent, ProfileUpdateContent } from "./types";

export async function createProfile(profile: ProfileCreateContent) {
  if (!profile.userId) {
    throw new Error("User ID is required");
  }
  try {
    return await prisma.profile.create({
      data: {
        ...profile,
        userId:
          typeof profile.userId === "string"
            ? parseInt(profile.userId)
            : profile.userId,
      },
    });
  } catch (e: any) {
    console.log(e);
    if (e.code === "P2002") {
      throw new Error("Profile already exists");
    }
    throw e;
  }
}

export async function getProfile(id: number) {
  return await prisma.profile.findUnique({
    where: { id },
  });
}

export async function getProfileByUserId(userId: number) {
  return await prisma.profile.findFirst({
    where: { userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
      userId: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function getProfileByUsername(username: string) {
  return await prisma.profile.findFirst({
    where: { user: { username } },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
      userId: true,
    },
  });
}

export async function updateProfile(profile: ProfileUpdateContent) {
  try {
    if (!profile.id) {
      throw new Error("id is required");
    }
    return await prisma.profile.update({
      where: { id: profile.id },
      data: profile,
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deleteProfile(id: number) {
  try {
    return await prisma.profile.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      throw new Error("Profile not found");
    }
    throw e;
  }
}
