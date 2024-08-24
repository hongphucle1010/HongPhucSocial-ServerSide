import prisma from '../../client';
import { NotificationCreateContent, NotificationUpdateContent } from './types';

export async function createNotification(notification: NotificationCreateContent) {
  if (!notification.content || !notification.userId) {
    throw new Error('Missing required fields');
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

export async function updateNotification(notification: NotificationUpdateContent) {
  try {
    if (!notification.id) {
      throw new Error('id is required');
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
