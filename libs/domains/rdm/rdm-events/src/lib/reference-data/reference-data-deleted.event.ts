export interface IReferenceDataDeletedEvent {
  readonly eventType: "ReferenceDataDeleted";
  readonly referenceDataId: string;
  readonly setId: string;
  readonly key: string;
  readonly locale?: string;
  readonly issuedAt: Date;
}
