import { body } from 'express-validator';

export const castToIntMiddleware = (keyName: string) => body(keyName).toInt();
export const castToStringMiddleware = (keyName: string) =>
  body(keyName).toString();

export const normalizeStringMiddleware = (keyName: string) =>
  body(keyName).trim();
