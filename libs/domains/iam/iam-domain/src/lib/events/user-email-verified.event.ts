import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

/**
 * Event emitted when a user's email is verified.
 */
export class UserEmailVerifiedEvent extends AbstractDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
