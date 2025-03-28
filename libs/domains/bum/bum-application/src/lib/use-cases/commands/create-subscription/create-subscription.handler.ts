import { CommandHandler, ICommandHandler } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import {
  SubscriptionId,
  OrganizationId,
  PricingPlanId,
  SubscriptionStatus,
  Subscription,
  ISubscriptionRepository,
  IPricingPlanRepository
} from '@ecoma/domains/bum/bum-domain';
import { CreateSubscriptionCommand } from './create-subscription.command';
import { IEventPublisherPort } from '../../../interfaces/event-publisher.interface';

/**
 * Handler xử lý command CreateSubscription
 */
@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler implements ICommandHandler<CreateSubscriptionCommand, string> {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly pricingPlanRepository: IPricingPlanRepository,
    private readonly eventPublisher: IEventPublisherPort,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý command tạo subscription mới
   * @param command Command chứa thông tin subscription cần tạo
   * @returns ID của subscription đã tạo
   */
  async execute(command: CreateSubscriptionCommand): Promise<string> {
    this.logger.info(`Creating new subscription for organization ${command.organizationId}`, {
      organizationId: command.organizationId,
      pricingPlanId: command.pricingPlanId
    });

    // Validate pricing plan existence
    const pricingPlanId = new PricingPlanId(command.pricingPlanId);
    const pricingPlan = await this.pricingPlanRepository.findById(pricingPlanId);

    if (!pricingPlan) {
      const error = `Pricing plan with ID ${command.pricingPlanId} not found`;
      this.logger.error(error, {
        pricingPlanId: command.pricingPlanId,
        organizationId: command.organizationId
      });
      throw new Error(error);
    }

    if (!pricingPlan.isActive) {
      const error = `Pricing plan with ID ${command.pricingPlanId} is not active`;
      this.logger.error(error, {
        pricingPlanId: command.pricingPlanId,
        organizationId: command.organizationId
      });
      throw new Error(error);
    }

    // Check if organization already has an active subscription
    const organizationId = new OrganizationId(command.organizationId);
    const existingSubscription = await this.subscriptionRepository.findActiveByOrganizationId(organizationId);

    if (existingSubscription) {
      const error = `Organization ${command.organizationId} already has an active subscription`;
      this.logger.error(error, {
        organizationId: command.organizationId,
        existingSubscriptionId: existingSubscription.id.value
      });
      throw new Error(error);
    }

    // Create new subscription
    const subscriptionId = new SubscriptionId(this.generateId());
    const startDate = new Date(command.startDate);
    const endDate = new Date(command.endDate);

    // Initially create with Active status
    const subscription = new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      SubscriptionStatus.active(),
      startDate,
      endDate,
      command.autoRenew
    );

    // Save subscription
    await this.subscriptionRepository.save(subscription);

    // Publish domain events
    if (subscription.domainEvents.length > 0) {
      await this.eventPublisher.publishAll(subscription.domainEvents);
      subscription.clearEvents();
    }

    this.logger.info(`Subscription created successfully`, {
      subscriptionId: subscriptionId.value,
      organizationId: command.organizationId,
      pricingPlanId: command.pricingPlanId
    });

    return subscriptionId.value;
  }

  /**
   * Generate a unique ID for the subscription
   */
  private generateId(): string {
    return `sub_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }
}
