export interface ITranslationImportFailedEvent {
  readonly eventType: "TranslationImportFailed";
  readonly importId: string;
  readonly importedByUserId: string;
  readonly failureReason: string;
  readonly failedAt: Date;
  readonly issuedAt: Date;
}
