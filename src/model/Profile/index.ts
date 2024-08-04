import prisma from "../../client";

interface CreateProfile {
  name: string;
  bio: string | null;
  avatar: string | null;
  userId: number;
}

export async function createProfile(profile: CreateProfile) {
  if (!profile.userId) {
    throw new Error("User ID is required");
  }
  if (!profile.name) {
    throw new Error("Name is required");
  }
  try {
    return await prisma.profile.create({
      data: profile,
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new Error("Profile already exists");
    }
    throw e;
  }
}

interface UpdateProfile {
  id: number;
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

export async function getProfile(id: number) {
  return await prisma.profile.findUnique({
    where: { id },
  });
}

export async function updateProfile(profile: UpdateProfile) {
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
  return await prisma.profile.delete({
    where: { id },
  });
}
