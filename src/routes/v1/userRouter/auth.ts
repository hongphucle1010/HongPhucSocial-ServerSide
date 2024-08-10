// Route: /api/v1/auth
import express, { Request, Response } from "express";
import { signUpController } from "../../../controllers/authController/signup";
import { loginController } from "../../../controllers/authController/login";
import { isLoginAuth } from "../../../controllers/authController/login";

export const authRouter = express.Router();

authRouter.post("/signup", signUpController);
authRouter.post("/login", loginController);
authRouter.get("/status", [
    async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      return res.json({ message: "Authenticated", user: req.user });
    }
    return res.json({ message: "Not authenticated", user: null });
  },
]);
