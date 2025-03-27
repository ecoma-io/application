export interface ITranslationKeyUpdatedEvent {
  readonly eventType: "TranslationKeyUpdated";
  readonly keyId: string;
  readonly key: string;
  readonly sourceContent: string;
  readonly issuedAt: Date;
}
