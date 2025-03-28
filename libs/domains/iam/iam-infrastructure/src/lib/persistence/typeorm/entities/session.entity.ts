import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * Session entity cho TypeORM.
 * Entity này đại diện cho một phiên làm việc của người dùng trong hệ thống.
 * Sử dụng Session Token Stateful để hỗ trợ:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 */
@Entity('sessions')
export class SessionEntity {
  /**
   * ID phiên làm việc.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của người dùng.
   */
  @Column()
  @Index()
  userId: string;

  /**
   * ID của tổ chức (nếu phiên làm việc trong phạm vi tổ chức).
   */
  @Column({ nullable: true })
  organizationId?: string;

  /**
   * Token phiên làm việc.
   */
  @Column()
  @Index({ unique: true })
  token: string;

  /**
   * Thời điểm hết hạn của phiên làm việc.
   */
  @Column()
  @Index()
  expiresAt: Date;

  /**
   * Thời điểm tạo phiên làm việc.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời điểm hoạt động cuối cùng của phiên làm việc.
   * Hỗ trợ phát hiện phiên không hoạt động.
   */
  @Column()
  lastActiveAt: Date;
}
