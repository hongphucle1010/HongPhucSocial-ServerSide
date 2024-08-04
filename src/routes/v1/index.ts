import express from "express";
import { userRouter } from "./userRouter";
import { adminRouter } from "./adminRouter";
import { profileRouter } from "./profileRouter";

export const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/admin/", adminRouter);
routes.use("/profile", profileRouter);
