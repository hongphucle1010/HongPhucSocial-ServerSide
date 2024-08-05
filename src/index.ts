import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { routes } from "./routes";
import chatSocket from "./sockets/chat";
import initializePassport from "./passport";
import * as dotenv from "dotenv";
import passport from "passport";
import { User } from "@prisma/client";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true, // Skip the middleware check
  },
});

const port = process.env.PORT || 3000;

initializePassport();

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
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
  chatSocket(socket, io);
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
