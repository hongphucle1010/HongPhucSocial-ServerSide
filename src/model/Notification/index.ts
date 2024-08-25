import { Notification } from '@prisma/client';
import prisma from '../../client';
import { NotificationCreateContent, NotificationUpdateContent } from './types';

export async function createNotification(
  notification: NotificationCreateContent,
): Promise<Notification> {
  if (!notification.content || !notification.userId) {
    throw new Error('Missing required fields');
  }
  return await prisma.notification.create({
    data: {
      ...notification,
      createdAt: new Date(),
    },
  });
}

export async function getNotificationById(
  id: number,
): Promise<Notification | null> {
  return await prisma.notification.findUnique({
    where: { id },
  });
}

export async function updateNotification(
  notification: NotificationUpdateContent,
): Promise<Notification> {
  if (!notification.id) {
    throw new Error('id is required');
  }
  return await prisma.notification.update({
    where: { id: notification.id },
    data: {
      ...notification,
    },
  });
}

export async function deleteNotification(id: number): Promise<Notification> {
  return await prisma.notification.delete({
    where: { id },
  });
}
