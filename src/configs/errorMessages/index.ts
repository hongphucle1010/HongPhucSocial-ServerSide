import AUTHENTICATION_ERROR_MESSAGES from './auth';
import FRIENDSHIP_ERROR_MESSAGES from './friendship';
import MESSAGE_ERROR_MESSAGES from './message';
import POST_ERROR_MESSAGES from './post';
import PROFILE_ERROR_MESSAGES from './profile';
import USER_ERROR_MESSAGES from './user';

const ERROR_MESSAGES = {
  auth: AUTHENTICATION_ERROR_MESSAGES,
  friendship: FRIENDSHIP_ERROR_MESSAGES,
  message: MESSAGE_ERROR_MESSAGES,
  post: POST_ERROR_MESSAGES,
  profile: PROFILE_ERROR_MESSAGES,
  user: USER_ERROR_MESSAGES,
  other: {
    invalidInput: 'Invalid input',
    invalidUser: 'Invalid user',
  },
};

export default ERROR_MESSAGES;
