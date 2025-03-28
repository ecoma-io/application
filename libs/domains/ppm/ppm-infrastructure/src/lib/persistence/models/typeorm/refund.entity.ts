import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentTransactionEntity } from './payment-transaction.entity';

/**
 * TypeORM Entity cho Refund
 */
@Entity('refunds')
export class RefundEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'transaction_id', type: 'varchar', length: 36 })
  transactionId: string;

  @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'currency', type: 'varchar', length: 3 })
  currency: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'gateway_refund_id', type: 'varchar', length: 100, nullable: true })
  gatewayRefundId: string | null;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PaymentTransactionEntity, (transaction) => transaction.refunds)
  @JoinColumn({ name: 'transaction_id' })
  transaction: PaymentTransactionEntity;
}
