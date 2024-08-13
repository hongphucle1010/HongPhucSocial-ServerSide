"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const chat_1 = __importDefault(require("./sockets/chat"));
const passport_1 = __importDefault(require("./passport"));
const dotenv = __importStar(require("dotenv"));
const passport_2 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const fix_1 = __importDefault(require("./fix"));
dotenv.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true, // Skip the middleware check
    },
    cors: {
        origin: process.env.CORS_ORIGIN,
    },
});
io.use((socket, next) => {
    const originalOnevent = socket.onevent;
    socket.onevent = (packet) => {
        const eventName = packet.data[0];
        console.log(`Received event: ${eventName}`, packet.data);
        originalOnevent.call(socket, packet);
    };
    const originalEmit = socket.emit;
    socket.emit = (...args) => {
        const eventName = args[0];
        console.log(`Emitting event: ${eventName}`, args);
        originalEmit.apply(socket, args);
    };
    next();
});
const port = process.env.PORT || 3000;
(0, passport_1.default)();
app.use((0, cors_1.default)());
app.use(passport_2.default.initialize());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api", routes_1.routes);
app.use("/fix", fix_1.default);
app.use("/*", (req, res) => {
    res.json({
        message: "Error: Route not found",
    });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
});
io.on("connection", (socket) => {
    (0, chat_1.default)(socket, io);
});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map