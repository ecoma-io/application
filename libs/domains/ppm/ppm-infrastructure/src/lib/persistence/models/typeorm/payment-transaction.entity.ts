import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentAttemptEntity } from './payment-attempt.entity';
import { RefundEntity } from './refund.entity';

/**
 * TypeORM Entity cho PaymentTransaction
 */
@Entity('payment_transactions')
export class PaymentTransactionEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'organization_id', type: 'varchar', length: 36 })
  organizationId: string;

  @Column({ name: 'transaction_type', type: 'varchar', length: 20 })
  transactionType: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'currency', type: 'varchar', length: 3 })
  currency: string;

  @Column({ name: 'payment_method_type', type: 'varchar', length: 50 })
  paymentMethodType: string;

  @Column({ name: 'payment_method_details', type: 'jsonb' })
  paymentMethodDetails: Record<string, any>;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'external_order_id', type: 'varchar', length: 100, nullable: true })
  externalOrderId: string | null;

  @Column({ name: 'external_customer_id', type: 'varchar', length: 100, nullable: true })
  externalCustomerId: string | null;

  @Column({ name: 'gateway_id', type: 'varchar', length: 36 })
  gatewayId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PaymentAttemptEntity, (attempt) => attempt.transaction, {
    cascade: true,
    eager: true,
  })
  attempts: PaymentAttemptEntity[];

  @OneToMany(() => RefundEntity, (refund) => refund.transaction, {
    cascade: true,
    eager: true,
  })
  refunds: RefundEntity[];
}
