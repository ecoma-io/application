export interface ITranslationAddedEvent {
  readonly eventType: "TranslationAdded";
  readonly keyId: string;
  readonly locale: string;
  readonly translationId: string;
  readonly content: string;
  readonly status: string;
  readonly issuedAt: Date;
}
