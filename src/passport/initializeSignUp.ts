import passport from "passport";
import { Request } from "express";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { createUser } from "../model/User";

export function initializeSignUp() {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req: Request, email: string, password: string, done) => {
        try {
          const { username } = req.body;
          if (!email || !username || !password) {
            return done(null, false, { message: "Missing required fields" });
          }

          const hashPassword = await bcryptjs.hash(password, 10);
          const user = await createUser({
            email,
            username,
            password: hashPassword,
          });
          
          return done(null, user);
        } catch (error) {
          if (error instanceof Error) {
            return done(null, false, { message: error.message });
          }
          console.error(error);
          return done(error);
        }
      }
    )
  );
}
