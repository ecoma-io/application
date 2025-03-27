export interface IReferenceSetUpdatedEvent {
  readonly eventType: "ReferenceSetUpdated";
  readonly setId: string;
  readonly name: string;
  readonly description: string;
  readonly isLocalized: boolean;
  readonly updatedAt: Date;
  readonly issuedAt: Date;
}
