import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AssetEntity } from './asset.entity';

/**
 * TypeORM entity cho bảng asset_metadata trong cơ sở dữ liệu.
 */
@Entity('dam_asset_metadata')
@Index(['assetId', 'key', 'locale'], { unique: true })
export class AssetMetadataEntity {
  /**
   * ID duy nhất của metadata.
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của tài sản mà metadata thuộc về.
   */
  @Column({ name: 'asset_id', type: 'uuid' })
  @Index()
  assetId: string;

  /**
   * Khóa metadata (ví dụ: "title", "description", "tags", "alt_text").
   */
  @Column({ length: 100 })
  @Index()
  key: string;

  /**
   * Giá trị metadata.
   */
  @Column({ type: 'text' })
  value: string;

  /**
   * Mã locale nếu là metadata đa ngôn ngữ (liên kết với RDM/LZM). Null cho metadata chung.
   */
  @Column({ length: 10, nullable: true })
  @Index()
  locale: string | null;

  /**
   * Thời điểm tạo metadata.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * Thời điểm cập nhật metadata cuối cùng.
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Mối quan hệ với tài sản.
   */
  @ManyToOne(() => AssetEntity, asset => asset.metadata)
  @JoinColumn({ name: 'asset_id' })
  asset?: AssetEntity;
}
