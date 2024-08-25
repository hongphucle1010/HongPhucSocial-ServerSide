import prisma from '../../client';
import { UserWithProfile } from './types';

export async function getUserWithProfile(id: number): Promise<UserWithProfile> {
  return await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
}

export async function updateUserWithProfile(
  id: number,
  data: any,
): Promise<UserWithProfile> {
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
}

export async function getUserWithProfileByEmail(
  email: string,
): Promise<UserWithProfile> {
  return await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
}
