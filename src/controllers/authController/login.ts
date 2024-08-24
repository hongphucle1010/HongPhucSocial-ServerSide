import { User } from '@prisma/client';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';
import { NextFunction, request, Request, Response } from 'express';
import {
  PassportJwtPayload,
  PassportMessage,
  UserTokenized,
} from '../../passport/types';
import { HttpError, HttpStatus } from '../../lib/error/HttpError';

export function generateToken(user: User) {
  const userTokenized: UserTokenized = { id: user.id, username: user.username };
  return jwt.sign(userTokenized, JWT_SECRET, {
    expiresIn: '1h',
  });
}

export function blockLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated())
    throw new HttpError('Already authenticated', HttpStatus.BadRequest);
  next();
}

export function blockNotLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.isAuthenticated())
    throw new HttpError('Not authenticated', HttpStatus.Unauthorized);

  next();
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  passport.authenticate(
    'login',
    async (err: Error, user: User, info: PassportMessage) => {
      try {
        if (err) {
          const error = new Error('An error occurred.');
          return next(error);
        }

        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const token = generateToken(user);
          const { password, ...userWithoutPassword } = user;
          return res.json({ token, user: userWithoutPassword });
        });
      } catch (error) {
        return next(error);
      }
    },
  )(req, res, next);
}

/**
 * @deprecated
 */
export async function checkAndDecodeToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bearer = bearerHeader.split(' ');
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = bearer[1];

    const secret = JWT_SECRET;

    const decode = jwt.verify(token, secret);

    if (!decode || typeof decode !== 'object') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json(decode);
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Authentication, if not successful, call the next middleware
export async function isLoginAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await passport.authenticate(
      'jwt',
      { session: false },
      (err: Error, user: PassportJwtPayload, info?: PassportMessage) => {
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
  } catch (e) {
    next(e);
  }
}

export const loginController = [blockLoggedIn, handleLogin];
export const blockLoggedInMiddleware = [isLoginAuth, blockLoggedIn];
export const blockNotLoggedInMiddleware = [isLoginAuth, blockNotLoggedIn];
