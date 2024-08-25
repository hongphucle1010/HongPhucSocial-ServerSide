import { Profile, User } from '@prisma/client';

type UserWithoutPassword = Omit<User, 'password'>;
interface UserWithProfile extends UserWithoutPassword {
  profile: Profile;
}

export interface LogInResponse {
  token: string;
  user: UserWithoutPassword;
}

export interface SignUpResponse {
  message: string;
  user: UserWithProfile;
}
