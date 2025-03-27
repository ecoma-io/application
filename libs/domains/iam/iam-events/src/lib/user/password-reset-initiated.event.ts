export interface IPasswordResetInitiatedEvent {
  readonly eventType: "PasswordResetInitiated";
  readonly userId: string;
  readonly email: string;
  readonly issuedAt: Date;
}
