export interface ITranslationImportCompletedEvent {
  readonly eventType: "TranslationImportCompleted";
  readonly importId: string;
  readonly importedByUserId: string;
  readonly numberOfRecordsProcessed: number;
  readonly numberOfRecordsImported: number;
  readonly numberOfRecordsFailed: number;
  readonly completedAt: Date;
  readonly issuedAt: Date;
}
