// Route: /api/v1/user
import express from "express";
import {
  createUserController,
  getUserByIdController,
  getUserController,
  updatePasswordController,
  updateUserController,
  updateUserWithProfileController,
} from "../../../controllers/userController";
import {
  blockNotLoggedIn,
  isLoginAuth,
} from "../../../controllers/authController/login";

export const userRouter = express.Router();

userRouter.use(isLoginAuth);


userRouter.post("/", createUserController);

userRouter.get("/", [blockNotLoggedIn, getUserController]);

userRouter.put("/", [blockNotLoggedIn, updateUserWithProfileController]);
userRouter.put("/password", [blockNotLoggedIn, updatePasswordController]);
// userRouter.put("/:id", updateUserController);
