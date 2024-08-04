import prisma from "../../client";

interface CreateNotification {
  content: string;
  userId: number;
}

export async function createNotification(notification: CreateNotification) {
  if (!notification.content || !notification.userId) {
    throw new Error("Missing required fields");
  }
  try {
    return await prisma.notification.create({
      data: {
        ...notification,
        createdAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getNotificationById(id: number) {
  return await prisma.notification.findUnique({
    where: { id },
  });
}

interface UpdateNotification {
  id: number;
  read?: boolean;
}

export async function updateNotification(notification: UpdateNotification) {
  try {
    if (!notification.id) {
      throw new Error("id is required");
    }
    return await prisma.notification.update({
      where: { id: notification.id },
      data: {
        ...notification,
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function deleteNotification(id: number) {
  return await prisma.notification.delete({
    where: { id },
  });
}
