import { JwtPayload } from 'jsonwebtoken';

export interface UserTokenized {
  id: number;
  username: string;
}

export interface PassportJwtPayload extends UserTokenized, JwtPayload {}
