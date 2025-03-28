import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '@ecoma/common-application';
import {
  ISubscriptionRepository,
  Subscription,
  SubscriptionId,
  OrganizationId,
  PricingPlanId,
  SubscriptionStatus
} from '@ecoma/domains/bum/bum-domain';
import { SubscriptionEntity } from '../entities/subscription.entity';

/**
 * Triển khai ISubscriptionRepository sử dụng TypeORM
 */
@Injectable()
export class TypeOrmSubscriptionRepository implements ISubscriptionRepository {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly logger: ILogger
  ) {}

  /**
   * Tìm subscription theo ID
   * @param id ID của subscription cần tìm
   */
  async findById(id: SubscriptionId): Promise<Subscription | null> {
    this.logger.debug(`Finding subscription by ID: ${id.value}`);

    const subscriptionEntity = await this.subscriptionRepository.findOne({
      where: { id: id.value }
    });

    if (!subscriptionEntity) {
      return null;
    }

    return this.mapToDomain(subscriptionEntity);
  }

  /**
   * Tìm subscription theo tổ chức
   * @param organizationId ID của tổ chức
   */
  async findByOrganizationId(organizationId: OrganizationId): Promise<Subscription[]> {
    this.logger.debug(`Finding subscriptions by organization ID: ${organizationId.value}`);

    const subscriptionEntities = await this.subscriptionRepository.find({
      where: { organizationId: organizationId.value }
    });

    return subscriptionEntities.map(entity => this.mapToDomain(entity));
  }

  /**
   * Tìm subscription đang active của tổ chức
   * @param organizationId ID của tổ chức
   */
  async findActiveByOrganizationId(organizationId: OrganizationId): Promise<Subscription | null> {
    this.logger.debug(`Finding active subscription for organization ID: ${organizationId.value}`);

    const subscriptionEntity = await this.subscriptionRepository.findOne({
      where: {
        organizationId: organizationId.value,
        status: 'Active'
      }
    });

    if (!subscriptionEntity) {
      return null;
    }

    return this.mapToDomain(subscriptionEntity);
  }

  /**
   * Lưu subscription
   * @param subscription Subscription cần lưu
   */
  async save(subscription: Subscription): Promise<void> {
    this.logger.debug(`Saving subscription: ${subscription.id.value}`);

    const subscriptionEntity = this.mapToEntity(subscription);
    await this.subscriptionRepository.save(subscriptionEntity);
  }

  /**
   * Xóa subscription
   * @param id ID của subscription cần xóa
   */
  async delete(id: SubscriptionId): Promise<void> {
    this.logger.debug(`Deleting subscription: ${id.value}`);

    await this.subscriptionRepository.delete({ id: id.value });
  }

  /**
   * Chuyển đổi từ entity sang domain
   * @param entity Entity cần chuyển đổi
   */
  private mapToDomain(entity: SubscriptionEntity): Subscription {
    const subscriptionId = new SubscriptionId(entity.id);
    const organizationId = new OrganizationId(entity.organizationId);
    const pricingPlanId = new PricingPlanId(entity.pricingPlanId);
    const status = SubscriptionStatus.fromString(entity.status);

    return new Subscription(
      subscriptionId,
      organizationId,
      pricingPlanId,
      status,
      entity.startDate,
      entity.endDate,
      entity.autoRenew
    );
  }

  /**
   * Chuyển đổi từ domain sang entity
   * @param domain Domain cần chuyển đổi
   */
  private mapToEntity(domain: Subscription): SubscriptionEntity {
    const entity = new SubscriptionEntity();

    entity.id = domain.subscriptionId.value;
    entity.organizationId = domain.organizationIdValue.value;
    entity.pricingPlanId = domain.pricingPlanIdValue.value;
    entity.status = domain.statusValue.value;
    entity.startDate = domain.startDateValue;
    entity.endDate = domain.endDateValue;
    entity.autoRenew = domain.autoRenewValue;

    return entity;
  }
}
