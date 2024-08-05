import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { getUserByEmail } from "../model/User";
import bcryptjs from "bcryptjs";

export const initializeLogin = () => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        // Verify the user's credentials and call the 'done' callback
        // with the user object or an error
        try {
          const user = await getUserByEmail(email);

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          if (bcryptjs.compareSync(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" }); /*  */
          }
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
