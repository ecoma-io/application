export interface ITranslationUpdatedEvent {
  readonly eventType: "TranslationUpdated";
  readonly keyId: string;
  readonly locale: string;
  readonly translationId: string;
  readonly content: string;
  readonly status: string;
  readonly issuedAt: Date;
}
