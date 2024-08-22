import { Server, Socket } from "socket.io";
import { createMessage } from "../model/Message";
import {
  SOCKET_JOIN_MESSAGE_LIST_ROOM,
  SOCKET_JOIN_MESSAGE_ROOM,
  SOCKET_LEAVE_MESSAGE_LIST_ROOM,
  SOCKET_LEAVE_MESSAGE_ROOM,
  SOCKET_RECEIVE_MESSAGE,
  SOCKET_SEND_MESSAGE,
} from "../configs/socketSignal";

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
  socket.on(SOCKET_JOIN_MESSAGE_ROOM, (room) => {
    socket.join(room);
    console.log(`$Someone has joined room: ${room}`);
  });

  socket.on(SOCKET_LEAVE_MESSAGE_ROOM, (room) => {
    socket.leave(room);
    console.log(`$Someone has left room: ${room}`);
  });

  socket.on(SOCKET_JOIN_MESSAGE_LIST_ROOM, (room) => {
    socket.join(room);
    console.log(`$Someone has joined room: ${room}`);
  });

  socket.on(SOCKET_LEAVE_MESSAGE_LIST_ROOM, (room) => {
    socket.leave(room);
    console.log(`$Someone has left room: ${room}`);
  });

  // Listen for chat messages
  socket.on(SOCKET_SEND_MESSAGE, async ({ message, senderId, receiverId }) => {
    const response = await createMessage({
      senderId,
      receiverId,
      content: message,
    });
    io.to([getRoomName(senderId, receiverId), `list_${receiverId}`]).emit(
      SOCKET_RECEIVE_MESSAGE,
      {
        id: 0,
        senderId,
        receiverId,
        content: message,
        createdAt: new Date().toISOString(),
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

export default chatSocket;
