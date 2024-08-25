export interface UserCreateContent {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}
export interface UserUpdateContent {
  id: number;
  username?: string;
  email?: string;
  password?: string;
}
