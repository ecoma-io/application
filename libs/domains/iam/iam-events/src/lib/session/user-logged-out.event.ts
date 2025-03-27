export interface IUserLoggedOutEvent {
  readonly eventType: "UserLoggedOut";
  readonly userId: string;
  readonly sessionId: string;
  readonly issuedAt: Date;
}
