export const IS_PUBLIC_KEY = 'isPublic';

export enum ExceptionCause {
    // Globally common exception causes
    RESOURCE_NOT_FOUND = 'resourceNotFound',
    UNKNOWN_ERROR = 'unknownError',

    // Specific exception causes
    USERNAME_ALREADY_EXISTS = 'usernameAlreadyExist',
    INVALID_PASSWORD = 'invalidPassword',
    MISSING_TOKEN = 'missingToken',
    INVALID_TOKEN = 'invalidToken',
}
