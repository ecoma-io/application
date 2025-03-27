import { ApplicationError } from '@ecoma/common-application';

export class UnauthorizedError extends ApplicationError<{ userId: string }> {
  constructor(userId: string) {
    super('User with ID: {userId} is not authorized to perform this action', { userId }, { userId });
  }
}
