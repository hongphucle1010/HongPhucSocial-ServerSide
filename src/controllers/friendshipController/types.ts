import { Request } from 'express';
import { ParsedQs } from 'qs';

interface FriendshipQuery extends ParsedQs {
  id1: string;
  id2: string;
}

export interface FriendshipRequest extends Request {
  query: FriendshipQuery;
}
