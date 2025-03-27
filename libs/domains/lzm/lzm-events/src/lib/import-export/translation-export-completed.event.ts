export interface ITranslationExportCompletedEvent {
  readonly eventType: "TranslationExportCompleted";
  readonly exportId: string;
  readonly exportedByUserId: string;
  readonly numberOfRecordsExported: number;
  readonly completedAt: Date;
  readonly issuedAt: Date;
}
