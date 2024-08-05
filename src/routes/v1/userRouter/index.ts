// Route: /api/v1/user
import express from "express";
import {
  createUserController,
  getUserByIdController,
  updateUserController,
} from "../../../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/", createUserController);

userRouter.get("/:id", getUserByIdController);

userRouter.put("/:id", updateUserController);
