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

export async function getMessageByPairId(currentId: number, otherId: number) {
  return await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: currentId,
          receiverId: otherId,
        },
        {
          senderId: otherId,
          receiverId: currentId,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getMessageByPairUsername(
  currentUsername: string,
  otherUsername: string
) {
  return await prisma.message.findMany({
    where: {
      OR: [
        {
          sender: { username: currentUsername },
          receiver: { username: otherUsername },
        },
        {
          sender: { username: otherUsername },
          receiver: { username: currentUsername },
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getMessageList(currentId: number) {
  return await prisma.$queryRaw`
  WITH LatestMessages AS (
    SELECT CASE
            WHEN "senderId" = ${currentId} THEN "receiverId"
            WHEN "receiverId" = ${currentId} THEN "senderId"
        END AS "userId",
        "content",
        "createdAt"
    FROM "Message"
    WHERE "senderId" = ${currentId}
        OR "receiverId" = ${currentId}
  ),
  RankedMessages AS (
    SELECT "userId",
        "content",
        "createdAt",
        ROW_NUMBER() OVER (
            PARTITION BY "userId"
            ORDER BY "createdAt" DESC
        ) AS rn
    FROM LatestMessages
  )
  SELECT RankedMessages."userId" as "userId",
    "content",
    "firstName",
    "lastName",
    "avatarUrl",
    "createdAt"
  FROM RankedMessages
    JOIN "Profile" ON "Profile"."userId" = RankedMessages."userId"
  WHERE rn = 1
  ORDER BY "createdAt" DESC;`;
}
