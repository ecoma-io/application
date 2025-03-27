export interface IReferenceSetCreatedEvent {
  readonly eventType: "ReferenceSetCreated";
  readonly setId: string;
  readonly name: string;
  readonly description: string;
  readonly isLocalized: boolean;
  readonly createdAt: Date;
  readonly issuedAt: Date;
}
