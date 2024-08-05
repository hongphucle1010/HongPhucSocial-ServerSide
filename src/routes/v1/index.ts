// Route: /api/v1
import express from "express";
import { userRouter } from "./userRouter";
import { adminRouter } from "./adminRouter";
import { profileRouter } from "./profileRouter";
import { postRouter } from "./postRouter";
import { authRouter } from "./userRouter/auth";

export const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/admin/", adminRouter);
routes.use("/profile", profileRouter);
routes.use("/post", postRouter);
routes.use("/auth", authRouter);
