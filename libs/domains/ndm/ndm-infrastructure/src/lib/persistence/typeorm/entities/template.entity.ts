import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity cho bảng templates
 */
@Entity('templates')
export class TemplateEntity {
  @PrimaryColumn('uuid')
  id = '';

  @Column('varchar')
  name = '';

  @Column('text')
  description = '';

  @Column('varchar')
  channel = '';

  @Column('varchar')
  subject = '';

  @Column('text')
  content = '';

  @Column('varchar')
  locale = '';

  @Column('uuid')
  organizationId = '';

  @Column('jsonb')
  requiredContextKeys: string[] = [];

  @Column('boolean', { default: true })
  isActive = true;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt = new Date();

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt = new Date();

  constructor(partial?: Partial<TemplateEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
