export interface CreatePost {
  content: string;
  authorId: number;
}
export interface UpdatePost {
  id: number;
  content?: string;
}
