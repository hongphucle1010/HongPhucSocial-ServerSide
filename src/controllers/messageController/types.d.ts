import { Profile } from '@prisma/client';
import { MessageContent } from 'src/model/Message/types';

export interface GetMessageResponse {
  messageList: MessageContent[];
}

export interface GetMessageByIdResponse extends GetMessageResponse {
  userProfile: Profile;
}
