import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Interface đại diện cho quyền lợi tính năng được lưu trong cơ sở dữ liệu
 */
interface IFeatureEntitlementData {
  featureType: string;
  isEnabled: boolean;
}

/**
 * Interface đại diện cho quyền lợi tài nguyên được lưu trong cơ sở dữ liệu
 */
interface IResourceEntitlementData {
  resourceType: string;
  limit: number;
}

/**
 * Entity TypeORM đại diện cho PricingPlan trong cơ sở dữ liệu
 */
@Entity('pricing_plans')
export class PricingPlanEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id = '';

  @Column({ type: 'varchar', length: 100 })
  name = '';

  @Column({ type: 'text' })
  description = '';

  @Column({ type: 'boolean', default: true })
  isActive = true;

  @Column({ type: 'jsonb' })
  featureEntitlements: IFeatureEntitlementData[] = [];

  @Column({ type: 'jsonb' })
  resourceEntitlements: IResourceEntitlementData[] = [];

  @Column({ type: 'int' })
  billingCycle = 0;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
