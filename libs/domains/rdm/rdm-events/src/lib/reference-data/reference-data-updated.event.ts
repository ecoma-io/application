export interface IReferenceDataUpdatedEvent {
  readonly eventType: "ReferenceDataUpdated";
  readonly referenceDataId: string;
  readonly setId: string;
  readonly key: string;
  readonly value: unknown;
  readonly locale?: string;
  readonly updatedAt: Date;
  readonly issuedAt: Date;
}
