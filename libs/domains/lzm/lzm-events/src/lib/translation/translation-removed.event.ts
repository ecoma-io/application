export interface ITranslationRemovedEvent {
  readonly eventType: "TranslationRemoved";
  readonly keyId: string;
  readonly locale: string;
  readonly translationId: string;
  readonly issuedAt: Date;
}
