import { Server, Socket } from "socket.io";

const chatSocket = (socket: Socket, io: Server) => {
  console.log("A user connected: ", socket.id);

  // Join a specific chat room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    console.log(`${username} has joined room: ${room}`);

    // Broadcast to the room that a user has joined
    socket.broadcast.to(room).emit("message", {
      user: "system",
      text: `${username} has joined the chat`,
    });

    // Welcome the user
    socket.emit("message", {
      user: "system",
      text: `Welcome to the chat, ${username}`,
    });
  });

  // Listen for chat messages
  socket.on("chatMessage", ({ message, room }) => {
    io.to(room).emit("message", {
      user: socket.id,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

export default chatSocket;
