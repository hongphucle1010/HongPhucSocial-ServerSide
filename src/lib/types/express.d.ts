// src/lib/types/express.d.ts
import { PassportJwtPayload as CustomUser } from '../../passport/types';

declare global {
  namespace Express {
    interface User extends CustomUser {}

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;
    }
  }

  namespace MyResponse {
    interface ResponseWithMessage {
      message: string;
      response: any;
    }
  }
}
