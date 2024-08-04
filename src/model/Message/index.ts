import prisma from "../../client";

interface CreateMessage {
  senderId: number;
  receiverId: number;
  content: string;
}

export async function createMessage(message: CreateMessage) {
  if (!message.senderId || !message.receiverId || !message.content) {
    throw new Error("Missing required fields");
  }
  try {
    return await prisma.message.create({
      data: {
        ...message,
        createdAt: new Date(),
      },
    });
  } catch (e: any) {
    throw e;
  }
}

export async function getMessageById(id: number) {
  return await prisma.message.findUnique({
    where: { id },
  });
}

export async function deleteMessage(id: number) {
  return await prisma.message.delete({
    where: { id },
  });
}
