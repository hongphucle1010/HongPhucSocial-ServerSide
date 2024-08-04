import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { routes } from "./routes";
import chatSocket from "./sockets/chat";

require("dotenv").config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true, // Skip the middleware check
  },
});

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
app.use("/*", (req, res) => {
  res.json({
    message: "Error: Route not found",
  });
});

io.on("connection", (socket) => {
  chatSocket(socket, io);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
