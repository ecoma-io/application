export interface IReferenceSetDeletedEvent {
  readonly eventType: "ReferenceSetDeleted";
  readonly setId: string;
  readonly name: string;
  readonly issuedAt: Date;
}
