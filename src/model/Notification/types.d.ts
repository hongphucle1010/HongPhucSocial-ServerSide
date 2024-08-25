export interface NotificationCreateContent {
  content: string;
  userId: number;
}

export interface NotificationUpdateContent {
  id: number;
  read?: boolean;
}
