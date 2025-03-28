import { AbstractDomainEvent } from '@ecoma/common-domain';
import { SubscriptionId } from '../value-objects/subscription-id.value-object';
import { OrganizationId } from '../value-objects/organization-id.value-object';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';
import { IEventMetadata } from './subscription-activated.event';

/**
 * Sự kiện khi gói dịch vụ của đăng ký được thay đổi
 */
export class SubscriptionPlanChangedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: SubscriptionId,
    public readonly organizationId: OrganizationId,
    public readonly oldPlanId: PricingPlanId,
    public readonly newPlanId: PricingPlanId,
    public readonly changeDate: Date,
    timestamp?: Date,
    metadata?: IEventMetadata
  ) {
    super(timestamp, metadata);
  }
}
