import prisma from "../../client";

interface CreateUser {
  username: string;
  email: string;
  password: string;
}

export async function createUser(user: CreateUser) {
  if (!user.email || !user.username || !user.password) {
    throw new Error("Missing required fields");
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
    if (e.code === "P2002") {
      throw new Error("Username or email already exists");
    }
    throw e;
  }
}

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

interface UpdateUser {
  id: number;
  username?: string;
  email?: string;
  password?: string;
}

export async function updateUser(user: UpdateUser) {
  try {
    if (!user.id) {
      throw new Error("id is required");
    }
    return await prisma.user.update({
      where: { id: user.id },
      data: {
        ...user,
        updatedAt: new Date(),
      },
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new Error("Username or email already exists");
    }
    throw e;
  }
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
