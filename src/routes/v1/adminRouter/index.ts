// Route: /api/v1/admin
import express from "express";

import { userRouter } from "../userRouter";
import { deleteUserController } from "../../../controllers/userController/admin";

export const adminRouter = express.Router();

adminRouter.use("/user", userRouter);
adminRouter.delete("/user/:id", deleteUserController);
