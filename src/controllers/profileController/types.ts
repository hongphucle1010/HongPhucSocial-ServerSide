import { ParsedQs } from 'qs';
import { Request } from 'express';

interface ProfileQueryByUsername extends ParsedQs {
  currentUserId: string;
}

export interface ProfileRequestByUsername extends Request {
  query: ProfileQueryByUsername;
}
