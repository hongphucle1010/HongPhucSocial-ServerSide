export interface CommentContent {
  content: string;
  postId: number;
  authorId: number;
}

export interface CommentUpdateContent {
  id: number;
  content?: string;
}
