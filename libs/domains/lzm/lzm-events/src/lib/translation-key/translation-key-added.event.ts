export interface ITranslationKeyAddedEvent {
  readonly eventType: "TranslationKeyAdded";
  readonly keyId: string;
  readonly key: string;
  readonly setId?: string;
  readonly sourceContent: string;
  readonly issuedAt: Date;
}
