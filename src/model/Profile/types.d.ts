export interface ProfileCreateContent {
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  userId: number;
}

export interface ProfileUpdateContent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}
