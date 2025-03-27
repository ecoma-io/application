export interface ISessionTerminatedEvent {
  readonly eventType: "SessionTerminated";
  readonly userId: string;
  readonly listOfSessionIds: string[];
  readonly issuedAt: Date;
}
