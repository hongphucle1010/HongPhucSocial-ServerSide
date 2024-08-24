import prisma from '../../client';
import { UserCreateContent, UserUpdateContent } from './types';

export async function createUser(user: UserCreateContent) {
  if (!user.email || !user.username || !user.password) {
    throw new Error('Missing required fields');
  }
  try {
    return await prisma.user.create({
      data: {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      throw new Error('Username or email already exists');
    }
    throw e;
  }
}

export async function createAdminUser(user: UserCreateContent) {
  if (!user.email || !user.username || !user.password) {
    throw new Error('Missing required fields');
  }
  if (user.isAdmin === false) {
    throw new Error('isAdmin must be true');
  }

  try {
    return await prisma.user.create({
      data: {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      throw new Error('Username or email already exists');
    }
    throw e;
  }
}

export async function getUserById(id: number) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getPasswordById(id: number) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findFirst({
      where: {
        username,
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirst({
      where: {
        email,
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function updateUser(user: UserUpdateContent) {
  try {
    if (!user.id) {
      throw new Error('id is required');
    }
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        ...user,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      throw new Error('Username or email already exists');
    }
    throw e;
  }
}

export async function updatePassword(id: number, password: string) {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        password,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.$transaction([
      prisma.post.deleteMany({
        where: {
          authorId: id,
        },
      }),
      prisma.comment.deleteMany({
        where: {
          authorId: id,
        },
      }),
      prisma.like.deleteMany({
        where: {
          userId: id,
        },
      }),
      prisma.friendship.deleteMany({
        where: {
          requesterId: id,
        },
      }),
      prisma.friendship.deleteMany({
        where: {
          requesteeId: id,
        },
      }),
      prisma.message.deleteMany({
        where: {
          senderId: id,
        },
      }),
      prisma.message.deleteMany({
        where: {
          receiverId: id,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          userId: id,
        },
      }),
      prisma.profile.deleteMany({
        where: {
          userId: id,
        },
      }),
      prisma.user.delete({
        where: { id },
      }),
    ]);

    return { message: 'User and related data deleted successfully' };
  } catch (e: any) {
    console.error(e);
    if (e.code === 'P2025') {
      throw new Error('User not found');
    }
    throw e;
  }
}
