import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { OrganizationEntity } from './organization.entity';

/**
 * Membership entity cho TypeORM.
 */
@Entity('memberships')
export class MembershipEntity {
  /**
   * ID của membership.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của người dùng.
   */
  @Column()
  userId: string;

  /**
   * ID của tổ chức. Nếu là null, đây là mối quan hệ của người dùng nội bộ Ecoma.
   */
  @Column({ nullable: true })
  organizationId?: string;

  /**
   * ID của vai trò được gán cho người dùng trong phạm vi này.
   */
  @Column()
  roleId: string;

  /**
   * Thời điểm người dùng bắt đầu mối quan hệ này.
   */
  @CreateDateColumn()
  joinedAt: Date;

  /**
   * Mối quan hệ với User.
   */
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /**
   * Mối quan hệ với Organization (nếu có).
   */
  @ManyToOne(() => OrganizationEntity, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: OrganizationEntity;
} 