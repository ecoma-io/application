import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PaymentTransactionEntity } from './payment-transaction.entity';

/**
 * TypeORM Entity cho PaymentAttempt
 */
@Entity('payment_attempts')
export class PaymentAttemptEntity {
  @PrimaryColumn({ name: 'id', type: 'varchar', length: 36 })
  id: string;

  @Column({ name: 'transaction_id', type: 'varchar', length: 36 })
  transactionId: string;

  @Column({ name: 'attempt_date', type: 'timestamp' })
  attemptDate: Date;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'gateway_response', type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any> | null;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => PaymentTransactionEntity, (transaction) => transaction.attempts)
  @JoinColumn({ name: 'transaction_id' })
  transaction: PaymentTransactionEntity;
}
