import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../number';

const AUTHENTICATION_ERROR_MESSAGES = {
  logIn: {
    alreadyLoggedIn: 'You are already logged in.',
    notLoggedIn: 'You are not logged in.',
    invalidCredentials: 'Invalid credentials.',
  },
  signUp: {
    shortUsername: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
    shortPassword: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
  },
};

export default AUTHENTICATION_ERROR_MESSAGES;
