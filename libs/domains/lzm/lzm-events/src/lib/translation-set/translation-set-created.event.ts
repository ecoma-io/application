export interface ITranslationSetCreatedEvent {
  readonly eventType: "TranslationSetCreated";
  readonly setId: string;
  readonly name: string;
  readonly issuedAt: Date;
}
