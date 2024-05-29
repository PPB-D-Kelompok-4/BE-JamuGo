import { MessagesKey } from './messagesKey';

export const messages_en = {
  // Common Error messages
  [MessagesKey.NODATAFOUND]: 'No data found',
  [MessagesKey.INTERNALSERVERERROR]: 'Internal server error',
  [MessagesKey.UNKNOWNERROR]: 'An unknown error occurred',
  [MessagesKey.BADREQUEST]: 'Bad request.',
  [MessagesKey.UNAUTHORIZED]: 'Unauthorized.',
  [MessagesKey.SPESIFICDATANOTFOUND]: '{0} not found.',
  [MessagesKey.ERRORCREATION]:
    'Failed to create {0}. The creation method did not return a valid model instance.',
  [MessagesKey.ERRORCREATEUSER]: 'Failed to create user in Firebase.',
  [MessagesKey.EMAILALREADYEXISTS]: 'Email already exists.',
  [MessagesKey.IMAGEDELETIONERROR]: 'Failed to delete image file.',

  // Common Success messages
  [MessagesKey.SUCCESSGET]: 'Data has been found.',
  [MessagesKey.SUCCESSGETBYID]:
    'Data has been found by the specified criteria.',
  [MessagesKey.SUCCESSCREATE]: 'Data has been created.',
  [MessagesKey.SUCCESSBULKCREATE]: 'Data has been bulk created.',
  [MessagesKey.SUCCESSUPDATE]: 'Data has been updated.',
  [MessagesKey.SUCCESSBULKUPDATE]: 'Data has been bulk updated.',
  [MessagesKey.SUCCESSHARDDELETE]: 'Data has been permanently deleted.',
  [MessagesKey.SUCCESSSOFTDELETE]: 'Data has been soft deleted.',
  [MessagesKey.SUCCESSRESTORE]: 'Data has been restored.',
  [MessagesKey.SUCCESSRESETPASSWORD]: 'Password reset email has been sent.',

  // Repository messages
  [MessagesKey.ERRORFINDINGALL]: 'Error finding all instances',
  [MessagesKey.ERRORFINDINGBYID]: 'Error finding instance by ID',
  [MessagesKey.ERRORCREATE]: 'Error occurred while creating the data.',
  [MessagesKey.ERRORBULKCREATE]: 'Error occurred while bulk creating data.',
  [MessagesKey.ERRORHARDDELETING]:
    'Error occurred while permanently deleting the data.',
  [MessagesKey.ERRORSOFTDELETING]:
    'Error occurred while soft deleting the data.',
  [MessagesKey.ERRORRESTORING]: 'Error occurred while restoring the data.',

  // Business Logic messages
  [MessagesKey.INVALIDPASSWORD]:
    'Invalid password. Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
  [MessagesKey.CUSTOMERROLENOTFOUND]: 'Customer role not found.',
  [MessagesKey.NOFILEUPLOADED]: 'No file uploaded.',
  [MessagesKey.INVALIDCREDENTIALS]: 'Invalid credentials.',
  [MessagesKey.USERNOTFOUND]: 'User not found.',
  [MessagesKey.USERUPDATENOTFOUND]: 'User update not found.',
  [MessagesKey.INVALIDEMAIL]: 'Invalid email format.',
};
