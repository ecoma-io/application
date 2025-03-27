export interface IUserLoggedInEvent {
  readonly eventType: "UserLoggedIn";
  readonly userId: string;
  readonly sessionId: string;
  readonly tenantId?: string;
  readonly issuedAt: Date;
}
