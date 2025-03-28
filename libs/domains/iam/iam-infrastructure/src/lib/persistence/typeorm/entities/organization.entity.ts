import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
// OrganizationStatus được sử dụng trong các mapper và các lớp domain, không trực tiếp trong entity

/**
 * Organization entity cho TypeORM.
 */
@Entity('organizations')
export class OrganizationEntity {
  /**
   * ID của Organization.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * Tên của Organization.
   */
  @Column()
  @Index({ unique: true })
  name: string;

  /**
   * Slug của Organization.
   */
  @Column()
  @Index({ unique: true })
  slug: string;

  /**
   * Trạng thái của Organization.
   */
  @Column({ default: 'Active' })
  status: string;

  /**
   * Mã quốc gia của Organization.
   */
  @Column()
  country: string;

  /**
   * ID của logo asset (nếu có).
   */
  @Column({ nullable: true })
  logoAssetId?: string;

  /**
   * Thời điểm tạo Organization.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời điểm cập nhật Organization gần nhất.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
