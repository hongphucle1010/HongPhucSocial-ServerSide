import prisma from "../../client";

export async function getUserWithProfile(id: number) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function updateUserWithProfile(id: number, data: any) {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        profile: {
          update: data.profile,
        },
      },
      include: { profile: true },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getUserWithProfileByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  } catch (e: any) {
    throw e;
  }
}
