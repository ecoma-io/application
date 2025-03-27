export interface IEmailVerifiedEvent {
  readonly eventType: "EmailVerified";
  readonly userId: string;
  readonly email: string;
  readonly issuedAt: Date;
}
