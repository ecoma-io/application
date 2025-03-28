import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Index, JoinColumn } from 'typeorm';
import { AssetMetadataEntity } from './asset-metadata.entity';
import { AssetRenditionEntity } from './asset-rendition.entity';
import { AssetHistoryEntity } from './asset-history.entity';
import { FolderEntity } from './folder.entity';

/**
 * TypeORM entity cho bảng asset trong cơ sở dữ liệu.
 */
@Entity('dam_assets')
@Index(['tenantId', 'status'])
@Index(['folderId', 'status'])
export class AssetEntity {
  /**
   * ID duy nhất của tài sản.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của tổ chức sở hữu tài sản. Null cho tài sản nội bộ.
   */
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  @Index()
  tenantId: string | null;

  /**
   * Tên file gốc khi tải lên.
   */
  @Column({ name: 'original_file_name', length: 255 })
  originalFileName: string;

  /**
   * Tên file được lưu trữ nội bộ cho phiên bản file gốc hiện tại.
   */
  @Column({ name: 'stored_file_name', length: 255 })
  storedFileName: string;

  /**
   * Đường dẫn nội bộ đến file gốc hiện tại.
   */
  @Column({ name: 'file_path', length: 1024 })
  filePath: string;

  /**
   * Loại MIME của file gốc.
   */
  @Column({ name: 'mime_type', length: 100 })
  @Index()
  mimeType: string;

  /**
   * Kích thước file gốc (byte).
   */
  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  /**
   * ID của người dùng đã tải lên phiên bản gốc đầu tiên.
   */
  @Column({ name: 'uploaded_by_user_id', type: 'uuid' })
  uploadedByUserId: string;

  /**
   * Thời điểm tải lên phiên bản gốc đầu tiên.
   */
  @Column({ name: 'uploaded_at', type: 'timestamp with time zone' })
  uploadedAt: Date;

  /**
   * Trạng thái tài sản.
   */
  @Column({ length: 50 })
  @Index()
  status: string;

  /**
   * Số phiên bản hiện tại của file gốc.
   */
  @Column({ name: 'current_version', type: 'integer', default: 1 })
  currentVersion: number;

  /**
   * ID của thư mục chứa tài sản. Null nếu không thuộc thư mục nào.
   */
  @Column({ name: 'folder_id', type: 'uuid', nullable: true })
  @Index()
  folderId: string | null;

  /**
   * Thời điểm tạo bản ghi Asset.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Chiều rộng của tài sản (pixel), tùy chọn.
   */
  @Column({ type: 'integer', nullable: true })
  width?: number;

  /**
   * Chiều cao của tài sản (pixel), tùy chọn.
   */
  @Column({ type: 'integer', nullable: true })
  height?: number;

  /**
   * Mối quan hệ với thư mục chứa tài sản.
   */
  @ManyToOne(() => FolderEntity, folder => folder.assets)
  @JoinColumn({ name: 'folder_id' })
  folder?: FolderEntity;

  /**
   * Danh sách metadata của tài sản.
   */
  @OneToMany(() => AssetMetadataEntity, metadata => metadata.asset, { cascade: true })
  metadata?: AssetMetadataEntity[];

  /**
   * Danh sách renditions của tài sản.
   */
  @OneToMany(() => AssetRenditionEntity, rendition => rendition.asset, { cascade: true })
  renditions?: AssetRenditionEntity[];

  /**
   * Danh sách lịch sử phiên bản của tài sản.
   */
  @OneToMany(() => AssetHistoryEntity, history => history.asset, { cascade: true })
  history?: AssetHistoryEntity[];
}
