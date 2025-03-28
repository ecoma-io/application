import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { AssetEntity } from './asset.entity';

/**
 * TypeORM entity cho bảng folder trong cơ sở dữ liệu.
 */
@Entity('dam_folders')
@Index(['tenantId', 'parentFolderId'])
@Index(['path', 'tenantId'], { unique: true })
export class FolderEntity {
  /**
   * ID duy nhất của thư mục.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của tổ chức sở hữu thư mục. Null cho thư mục nội bộ.
   */
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string | null;

  /**
   * Tên thư mục.
   */
  @Column({ length: 255 })
  name: string;

  /**
   * Mô tả thư mục, tùy chọn.
   */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * ID của thư mục cha. Null cho thư mục gốc.
   */
  @Column({ name: 'parent_folder_id', type: 'uuid', nullable: true })
  @Index()
  parentFolderId: string | null;

  /**
   * Đường dẫn đầy đủ của thư mục, phân cách bằng '/'.
   */
  @Column({ length: 1024 })
  @Index()
  path: string;

  /**
   * ID của người dùng đã tạo thư mục.
   */
  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId: string;

  /**
   * Thời điểm tạo thư mục.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Thứ tự sắp xếp trong thư mục cha.
   */
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  /**
   * Mối quan hệ với thư mục cha.
   */
  @ManyToOne(() => FolderEntity, folder => folder.childFolders)
  @JoinColumn({ name: 'parent_folder_id' })
  parentFolder?: FolderEntity;

  /**
   * Danh sách các thư mục con.
   */
  @OneToMany(() => FolderEntity, folder => folder.parentFolder)
  childFolders?: FolderEntity[];

  /**
   * Danh sách các tài sản trong thư mục.
   */
  @OneToMany(() => AssetEntity, asset => asset.folder)
  assets?: AssetEntity[];
}
