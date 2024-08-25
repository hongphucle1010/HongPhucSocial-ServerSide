import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';
import { User } from '@prisma/client';
import { isLoginAuth, blockLoggedIn } from './login';
import { createProfile } from '../../model/Profile';
import { HttpError } from '../../lib/error/HttpErrors';
import { HttpStatus } from '../../lib/statusCode';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../../configs/number';
import ERROR_MESSAGES from '../../configs/errorMessages';
import SUCCESS_MESSAGES from '../../configs/successMessages';

const validateUser = [
  body('username')
    .trim()
    .isLength({ min: MIN_USERNAME_LENGTH })
    .withMessage(ERROR_MESSAGES.auth.signUp.shortUsername)
    .escape(),
  body('email').isEmail().normalizeEmail().escape(),
  body('password')
    .isLength({ min: MIN_PASSWORD_LENGTH })
    .withMessage(ERROR_MESSAGES.auth.signUp.shortPassword),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      throw new HttpError(
        ERROR_MESSAGES.other.invalidInput,
        HttpStatus.BadRequest,
        errors.array(),
      );
    }
    next();
  },
];

async function handleSignUp(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'signup',
    { session: false },
    async (error: Error, user: User | null, info: any) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        throw new HttpError(info.message, HttpStatus.BadRequest);
      }
      const { password, ...userWithoutPassword } = user;
      const profile = await createProfile({
        userId: user.id,
        firstName: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
      });
      const userWithProfile = { ...userWithoutPassword, profile };
      res
        .status(HttpStatus.Created)
        .json({ message: SUCCESS_MESSAGES.auth.signUp, user: userWithProfile });
    },
  )(req, res, next);
}

const signUpController = [blockLoggedIn, ...validateUser, handleSignUp];
export { signUpController };
