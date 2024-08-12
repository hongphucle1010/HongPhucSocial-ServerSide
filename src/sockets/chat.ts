import { Server, Socket } from "socket.io";
import { createMessage } from "../model/Message";

export const getRoomName = (userId1: number, userId2: number) => {
  // Ensure user IDs are strings
  const id1 = String(userId1);
  const id2 = String(userId2);

  // Sort user IDs
  const sortedIds = [id1, id2].sort();

  // Concatenate sorted user IDs
  return `room_${sortedIds[0]}_${sortedIds[1]}`;
};

const chatSocket = (socket: Socket, io: Server) => {
  console.log("A user connected: ", socket.id);

  // Join a specific chat room
  socket.on("joinMessageRoom", (room) => {
    socket.join(room);
    console.log(`$Someone has joined room: ${room}`);
  });

  // Listen for chat messages
  socket.on("sendMessage", async ({ message, senderId, receiverId }) => {
    const response = await createMessage({
      senderId,
      receiverId,
      content: message,
    });
    io.to(getRoomName(senderId, receiverId)).emit("getMessage", {
      id: 0,
      senderId,
      receiverId,
      content: message,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

export default chatSocket;
