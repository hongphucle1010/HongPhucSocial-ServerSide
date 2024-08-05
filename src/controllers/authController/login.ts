import { User } from "@prisma/client";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../constants";
import { NextFunction, request, Request, Response } from "express";
import { info } from "console";

export function generateToken(user: User) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function blockLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return res.json({ message: "Already authenticated" });
  }
  next();
}

export function blockNotLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    return res.json({ message: "Not authenticated" });
  }
  next();
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  passport.authenticate("login", async (err: Error, user: User, info: any) => {
    try {
      if (err) {
        const error = new Error("An error occurred.");
        return next(error);
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = generateToken(user);
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
}

/**
 * @deprecated
 */
export async function checkAndDecodeToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bearer = bearerHeader.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = bearer[1];

    const secret = JWT_SECRET;

    const decode = jwt.verify(token, secret);

    if (!decode || typeof decode !== "object") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(decode);
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

// Authentication, if not successful, call the next middleware
export async function isLoginAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: User, info: any) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next();
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  } catch (e) {
    next(e);
  }
}

export const loginController = [isLoginAuth, blockLoggedIn, handleLogin];
