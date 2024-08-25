import { User } from '@prisma/client';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';
import { NextFunction, request, Request, Response } from 'express';
import { PassportJwtPayload, UserTokenized } from '../../passport/types';
import { HttpError } from '../../lib/error/HttpErrors';
import { HttpStatus } from '../../lib/statusCode';
import { IVerifyOptions } from 'passport-local';
import ERROR_MESSAGES from '../../configs/errorMessages';

export function generateToken(user: User) {
  const userTokenized: UserTokenized = { id: user.id, username: user.username };
  return jwt.sign(userTokenized, JWT_SECRET, {
    expiresIn: '1h',
  });
}

export function blockLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated())
    throw new HttpError(
      ERROR_MESSAGES.auth.logIn.alreadyLoggedIn,
      HttpStatus.BadRequest,
    );
  next();
}

export function blockNotLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.isAuthenticated())
    throw new HttpError(
      ERROR_MESSAGES.auth.logIn.notLoggedIn,
      HttpStatus.Unauthorized,
    );

  next();
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    'login',
    async (err: Error, user: User, info: IVerifyOptions) => {
      if (err) {
        throw new HttpError(err.message, HttpStatus.InternalServerError);
      }

      if (!user) {
        throw new HttpError(info.message, HttpStatus.Unauthorized);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = generateToken(user);
        const { password, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
      });
    },
  )(req, res, next);
}

// Authentication, if not successful, call the next middleware
export async function isLoginAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
}

export const loginController = [blockLoggedIn, handleLogin];
export const blockLoggedInMiddleware = [isLoginAuth, blockLoggedIn];
export const blockNotLoggedInMiddleware = [isLoginAuth, blockNotLoggedIn];
