export interface MessageContent {
  senderId: number;
  receiverId: number;
  content: string;
}

interface MessageListElement {
  userId: number;
  content: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: Date;
}
