import { JwtPayload } from 'jsonwebtoken';

export interface PassportMessage {
  message: string;
}

export interface UserTokenized {
  id: number;
  username: string;
}

export interface PassportJwtPayload extends UserTokenized, JwtPayload {}
