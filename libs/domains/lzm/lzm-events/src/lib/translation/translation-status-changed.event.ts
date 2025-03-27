export interface ITranslationStatusChangedEvent {
  readonly eventType: "TranslationStatusChanged";
  readonly keyId: string;
  readonly locale: string;
  readonly translationId: string;
  readonly oldStatus: string;
  readonly newStatus: string;
  readonly issuedAt: Date;
}
