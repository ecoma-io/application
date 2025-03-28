import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity cho bảng notifications
 */
@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id = '';

  @Column('uuid')
  templateId = '';

  @Column('varchar')
  channel = '';

  @Column('varchar')
  locale = '';

  @Column('jsonb')
  context: Record<string, unknown> = {};

  @Column('uuid')
  recipientId = '';

  @Column('uuid')
  organizationId = '';

  @Column('varchar')
  status = '';

  @Column('varchar')
  subject = '';

  @Column('text')
  content = '';

  @Column('varchar', { nullable: true })
  failureReason?: string;

  @Column('timestamp with time zone', { nullable: true })
  sentAt?: Date;

  @Column('timestamp with time zone', { nullable: true })
  deliveredAt?: Date;

  @Column('timestamp with time zone', { nullable: true })
  readAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt = new Date();

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt = new Date();

  constructor(partial?: Partial<NotificationEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
