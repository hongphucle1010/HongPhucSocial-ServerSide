import { Profile, User } from '@prisma/client';

export interface UserWithProfile extends User {
  profile: Profile;
}
