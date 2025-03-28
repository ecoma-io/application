import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
// UserStatus được sử dụng trong các mapper và các lớp domain, không trực tiếp trong entity

/**
 * User entity cho TypeORM.
 */
@Entity('users')
export class UserEntity {
  /**
   * ID của User.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * Email của User.
   */
  @Column()
  @Index({ unique: true })
  email: string;

  /**
   * Hash mật khẩu của User.
   */
  @Column()
  passwordHash: string;

  /**
   * Họ của User.
   */
  @Column()
  firstName: string;

  /**
   * Tên của User.
   */
  @Column()
  lastName: string;

  /**
   * Trạng thái của User.
   */
  @Column({ default: 'PendingConfirmation' })
  status: string;

  /**
   * Locale của User.
   */
  @Column()
  locale: string;

  /**
   * Token xác minh email.
   */
  @Column({ nullable: true })
  emailVerificationToken?: string;

  /**
   * Thời điểm hết hạn token xác minh email.
   */
  @Column({ nullable: true })
  emailVerificationTokenExpiresAt?: Date;

  /**
   * Token đặt lại mật khẩu.
   */
  @Column({ nullable: true })
  passwordResetToken?: string;

  /**
   * Thời điểm hết hạn token đặt lại mật khẩu.
   */
  @Column({ nullable: true })
  passwordResetTokenExpiresAt?: Date;

  /**
   * Thời điểm tạo User.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời điểm cập nhật User gần nhất.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
