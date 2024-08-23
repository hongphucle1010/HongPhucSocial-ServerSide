import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { routes } from "./routes";
import chatSocket from "./sockets/chat";
import initializePassport from "./passport";
import * as dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import fix from "./fix";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true, // Skip the middleware check
  },
  cors: {
    origin: [
      process.env.CORS_ORIGIN_1 as string,
      process.env.CORS_ORIGIN_2 as string,
    ],
  },
});

io.use((socket, next) => {
  const originalOnevent = (socket as any).onevent;
  (socket as any).onevent = (packet: any) => {
    const eventName = packet.data[0];
    console.log(`Received event: ${eventName}`, packet.data);
    originalOnevent.call(socket, packet);
  };

  const originalEmit = socket.emit;
  socket.emit = (...args): any => {
    const eventName = args[0];
    console.log(`Emitting event: ${eventName}`, args);
    originalEmit.apply(socket, args);
  };

  next();
});

const port = process.env.PORT || 3000;

initializePassport();
app.use(cors());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
app.use("/fix", fix);
app.use("/*", (req, res) => {
  res.json({
    message: "Error: Route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

io.on("connection", (socket) => {
  try {
    chatSocket(socket, io);
  } catch (error) {
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
