// Route: /api/v1
import express from "express";
import { userRouter } from "./userRouter";
import { adminRouter } from "./adminRouter";
import { profileRouter } from "./profileRouter";
import { postRouter } from "./postRouter";
import { authRouter } from "./userRouter/auth";
import { isLoginAuth } from "../../controllers/authController/login";
import { friendshipRouter } from "./friendshipRouter";

export const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/admin/", [isLoginAuth, adminRouter]);
routes.use("/profile", profileRouter);
routes.use("/post", postRouter);
routes.use("/auth", [isLoginAuth, authRouter]);
routes.use("/friendship", friendshipRouter);