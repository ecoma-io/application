import { ICommand } from '@ecoma/common-application'; // Adjust path

export class RegisterUserCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly locale: string,
  ) {}
}
