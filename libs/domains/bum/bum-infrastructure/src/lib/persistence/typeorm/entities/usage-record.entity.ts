import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * Entity TypeORM đại diện cho bản ghi sử dụng tài nguyên trong cơ sở dữ liệu
 */
@Entity('usage_records')
@Index(['organizationId', 'resourceType', 'timestamp'])
export class UsageRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id = '';

  @Column({ type: 'varchar', length: 100 })
  @Index()
  organizationId = '';

  @Column({ type: 'varchar', length: 100 })
  @Index()
  resourceType = '';

  @Column({ type: 'numeric', precision: 20, scale: 2 })
  amount = 0;

  @Column({ type: 'timestamp' })
  @Index()
  timestamp: Date = new Date();

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> = {};

  @CreateDateColumn()
  createdAt: Date = new Date();
}
