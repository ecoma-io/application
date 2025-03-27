export interface IPasswordResetSuccessfulEvent {
  readonly eventType: "PasswordResetSuccessful";
  readonly userId: string;
  readonly email: string;
  readonly issuedAt: Date;
}
