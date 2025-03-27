export interface IReferenceDataCreatedEvent {
  readonly eventType: "ReferenceDataCreated";
  readonly referenceDataId: string;
  readonly setId: string;
  readonly key: string;
  readonly value: unknown;
  readonly locale?: string;
  readonly createdAt: Date;
  readonly issuedAt: Date;
}
