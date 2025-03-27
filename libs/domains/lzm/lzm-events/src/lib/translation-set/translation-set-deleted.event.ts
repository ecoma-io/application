export interface ITranslationSetDeletedEvent {
  readonly eventType: "TranslationSetDeleted";
  readonly setId: string;
  readonly name: string;
  readonly issuedAt: Date;
}
