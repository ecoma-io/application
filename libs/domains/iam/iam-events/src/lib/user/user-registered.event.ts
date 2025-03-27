export interface IUserRegisteredEvent {
  readonly eventType: "UserRegistered";
  readonly userId: string;
  readonly email: string;
  readonly profile: {
    firstName: string;
    lastName: string;
    locale: string;
  };
  readonly issuedAt: Date;
}
