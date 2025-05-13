import { IErrorDetail } from '@ecoma/common-application'; // Adjust path

export class RegisterUserEmailExistsErrorDetail implements IErrorDetail {
  readonly code = 'IAM_REGISTER_EMAIL_EXISTS';
  constructor(
    public readonly email: string,
    public readonly message = `Email ${email} already in use.`,
    public readonly field = 'email',
  ) {}
}

export class RegisterUserPasswordPolicyErrorDetail implements IErrorDetail {
  readonly code = 'IAM_REGISTER_PASSWORD_POLICY_VIOLATED';
  constructor(
    public readonly message = 'Password does not meet policy requirements.',
    public readonly field = 'password',
  ) {}
  // Optionally, can include more details about which policy was violated
}

// Add other specific error details for this use case if any
