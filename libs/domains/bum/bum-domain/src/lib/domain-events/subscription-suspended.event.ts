import { AbstractDomainEvent } from '@ecoma/common-domain';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';
import { IEventMetadata } from './subscription-activated.event';

/**
 * Sự kiện khi một đăng ký bị tạm ngưng
 */
export class SubscriptionSuspendedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: SubscriptionId,
    public readonly organizationId: OrganizationId,
    public readonly reason: string,
    public readonly suspensionDate: Date,
    timestamp?: Date,
    metadata?: IEventMetadata
  ) {
    super(timestamp, metadata);
  }
}
