import { DomainError } from '@ecoma/common-domain';

export class EmailAlreadyExistsError extends DomainError<unknown, { email: string }> {
  constructor(public readonly email: string) {
    super(
      `User with email '{email}' already exists.`,
      { email },
      { errorType: 'EmailAlreadyExists' } // Example detail
    );
    this.name = EmailAlreadyExistsError.name;
  }
}
