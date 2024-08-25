import { User } from '@prisma/client';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';
import { NextFunction, Request, Response } from 'express';
import { PassportJwtPayload, UserTokenized } from '../../passport/types';
import { HttpError } from '../../lib/error/HttpErrors';
import { HttpStatus } from '../../lib/statusCode';
import { IVerifyOptions } from 'passport-local';
import ERROR_MESSAGES from '../../configs/errorMessages';
import expressAsyncHandler from 'express-async-handler';

export function generateToken(user: User) {
  const userTokenized: UserTokenized = { id: user.id, username: user.username };
  return jwt.sign(userTokenized, JWT_SECRET, {
    expiresIn: '1h',
  });
}

export const blockLoggedIn = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated())
      throw new HttpError(
        ERROR_MESSAGES.auth.logIn.alreadyLoggedIn,
        HttpStatus.BadRequest,
      );
    next();
  },
);

export const blockNotLoggedIn = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated())
      throw new HttpError(
        ERROR_MESSAGES.auth.logIn.notLoggedIn,
        HttpStatus.Unauthorized,
      );

    next();
  },
);

export const handleLogin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'login',
      async (err: Error, user: User, info: IVerifyOptions) => {
        if (err) {
          return next(
            new HttpError(err.message, HttpStatus.InternalServerError),
          );
        }

        if (!user) {
          return next(new HttpError(info.message, HttpStatus.Unauthorized));
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const token = generateToken(user);
          const { password, ...userWithoutPassword } = user;
          res.json({ token, user: userWithoutPassword });
        });
      },
    )(req, res, next);
  },
);

export const isLoginAuth = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await passport.authenticate(
      'jwt',
      { session: false },
      (err: Error, user: PassportJwtPayload, info?: IVerifyOptions) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return next();
        }
        req.user = user;

        next();
      },
    )(req, res, next);
  },
);

export const loginController = [blockLoggedIn, handleLogin];
export const blockLoggedInMiddleware = [isLoginAuth, blockLoggedIn];
export const blockNotLoggedInMiddleware = [isLoginAuth, blockNotLoggedIn];
