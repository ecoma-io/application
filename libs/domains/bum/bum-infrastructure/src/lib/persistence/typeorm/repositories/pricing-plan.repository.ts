import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '@ecoma/common-application';
import {
  IPricingPlanRepository,
  PricingPlan,
  PricingPlanId,
  FeatureEntitlement,
  ResourceEntitlement
} from '@ecoma/domains/bum/bum-domain';
import { PricingPlanEntity } from '../entities/pricing-plan.entity';

interface IFeatureEntitlementData {
  featureType: string;
  isEnabled: boolean;
}

interface IResourceEntitlementData {
  resourceType: string;
  limit: number;
}

/**
 * Triển khai IPricingPlanRepository sử dụng TypeORM
 */
@Injectable()
export class TypeOrmPricingPlanRepository implements IPricingPlanRepository {
  constructor(
    @InjectRepository(PricingPlanEntity)
    private readonly pricingPlanRepository: Repository<PricingPlanEntity>,
    private readonly logger: ILogger
  ) {}

  /**
   * Tìm pricing plan theo ID
   * @param id ID của pricing plan cần tìm
   */
  async findById(id: PricingPlanId): Promise<PricingPlan | null> {
    this.logger.debug(`Finding pricing plan by ID: ${id.value}`);

    const pricingPlanEntity = await this.pricingPlanRepository.findOne({
      where: { id: id.value }
    });

    if (!pricingPlanEntity) {
      return null;
    }

    return this.mapToDomain(pricingPlanEntity);
  }

  /**
   * Tìm tất cả các pricing plan
   */
  async findAll(): Promise<PricingPlan[]> {
    this.logger.debug('Finding all pricing plans');

    const pricingPlanEntities = await this.pricingPlanRepository.find();

    return pricingPlanEntities.map(entity => this.mapToDomain(entity));
  }

  /**
   * Tìm tất cả các pricing plan đang active
   */
  async findAllActive(): Promise<PricingPlan[]> {
    this.logger.debug('Finding all active pricing plans');

    const pricingPlanEntities = await this.pricingPlanRepository.find({
      where: { isActive: true }
    });

    return pricingPlanEntities.map(entity => this.mapToDomain(entity));
  }

  /**
   * Lưu pricing plan
   * @param pricingPlan Pricing plan cần lưu
   */
  async save(pricingPlan: PricingPlan): Promise<void> {
    this.logger.debug(`Saving pricing plan: ${pricingPlan.id.value}`);

    const pricingPlanEntity = this.mapToEntity(pricingPlan);
    await this.pricingPlanRepository.save(pricingPlanEntity);
  }

  /**
   * Xóa pricing plan
   * @param id ID của pricing plan cần xóa
   */
  async delete(id: PricingPlanId): Promise<void> {
    this.logger.debug(`Deleting pricing plan: ${id.value}`);

    await this.pricingPlanRepository.delete({ id: id.value });
  }

  /**
   * Chuyển đổi từ entity sang domain
   * @param entity Entity cần chuyển đổi
   */
  private mapToDomain(entity: PricingPlanEntity): PricingPlan {
    const pricingPlanId = new PricingPlanId(entity.id);

    const featureEntitlements = (entity.featureEntitlements as IFeatureEntitlementData[]).map(
      fe => new FeatureEntitlement(fe.featureType, fe.isEnabled)
    );

    const resourceEntitlements = (entity.resourceEntitlements as IResourceEntitlementData[]).map(
      re => new ResourceEntitlement(re.resourceType, re.limit)
    );

    return new PricingPlan(
      pricingPlanId,
      entity.name,
      entity.description,
      entity.isActive,
      featureEntitlements,
      resourceEntitlements,
      entity.billingCycle
    );
  }

  /**
   * Chuyển đổi từ domain sang entity
   * @param domain Domain cần chuyển đổi
   */
  private mapToEntity(domain: PricingPlan): PricingPlanEntity {
    const entity = new PricingPlanEntity();

    entity.id = domain.id.value;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;

    entity.featureEntitlements = domain.featureEntitlements.map(fe => ({
      featureType: fe.featureType,
      isEnabled: fe.isEnabled
    }));

    entity.resourceEntitlements = domain.resourceEntitlements.map(re => ({
      resourceType: re.resourceType,
      limit: re.limit
    }));

    entity.billingCycle = domain.billingCycle;

    return entity;
  }
}
