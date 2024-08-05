import { Response, Request, NextFunction } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import { User } from "@prisma/client";
import { isLoginAuth, blockLoggedIn } from "./login";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .escape(),
  body("email").isEmail().normalizeEmail().escape(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid input" });
    }
    next();
  },
];

async function handleSignUp(req: Request, res: Response, next: NextFunction) {
  try {
    passport.authenticate(
      "signup",
      { session: false },
      (error: Error, user: User | null, info: any) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(400).json({ message: info.message });
        }
        res.status(201).json({ message: "Sign up successful", user: user });
      }
    )(req, res, next);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}

const signUpController = [
  isLoginAuth,
  blockLoggedIn,
  ...validateUser,
  handleSignUp,
];
export { signUpController };
