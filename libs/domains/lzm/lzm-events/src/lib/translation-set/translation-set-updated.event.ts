export interface ITranslationSetUpdatedEvent {
  readonly eventType: "TranslationSetUpdated";
  readonly setId: string;
  readonly name: string;
  readonly issuedAt: Date;
}
