export interface IEmailVerificationInitiatedEvent {
  readonly eventType: "EmailVerificationInitiated";
  readonly userId: string;
  readonly email: string;
  readonly issuedAt: Date;
}
