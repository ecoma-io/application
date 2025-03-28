import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entity TypeORM đại diện cho Subscription trong cơ sở dữ liệu
 */
@Entity('subscriptions')
export class SubscriptionEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id = '';

  @Column({ type: 'varchar', length: 100 })
  organizationId = '';

  @Column({ type: 'varchar', length: 100 })
  pricingPlanId = '';

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['Active', 'Suspended', 'Cancelled', 'PendingPayment', 'TrialPeriod']
  })
  status = 'PendingPayment';

  @Column({ type: 'timestamp' })
  startDate: Date = new Date();

  @Column({ type: 'timestamp' })
  endDate: Date = new Date();

  @Column({ type: 'boolean', default: false })
  autoRenew = false;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
