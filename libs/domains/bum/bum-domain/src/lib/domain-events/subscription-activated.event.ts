import { AbstractDomainEvent } from '@ecoma/common-domain';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';

/**
 * Interface cho metadata của event
 */
export interface IEventMetadata {
  [key: string]: unknown;
}

/**
 * Sự kiện khi một đăng ký được kích hoạt
 */
export class SubscriptionActivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: SubscriptionId,
    public readonly organizationId: OrganizationId,
    public readonly pricingPlanId: PricingPlanId,
    public readonly activationDate: Date,
    timestamp?: Date,
    metadata?: IEventMetadata
  ) {
    super(timestamp, metadata);
  }
}
