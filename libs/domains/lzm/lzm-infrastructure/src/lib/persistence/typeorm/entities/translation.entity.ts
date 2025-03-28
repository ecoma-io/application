import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TranslationKeyEntity } from './translation-key.entity';

/**
 * Enum các trạng thái có thể của bản dịch
 */
export enum TranslationStatusEnum {
  DRAFT = 'Draft',
  TRANSLATED = 'Translated',
  NEEDS_REVIEW = 'NeedsReview',
  APPROVED = 'Approved',
  OUTDATED = 'Outdated',
}

/**
 * Translation entity cho TypeORM
 */
@Entity('translations')
export class TranslationEntity {
  /**
   * ID duy nhất của bản dịch
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của khóa bản dịch
   */
  @Column('uuid')
  translationKeyId: string;

  /**
   * Mã locale/ngôn ngữ
   */
  @Column()
  locale: string;

  /**
   * Nội dung bản dịch
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * Trạng thái của bản dịch
   */
  @Column({
    type: 'enum',
    enum: TranslationStatusEnum,
    default: TranslationStatusEnum.DRAFT
  })
  status: string;

  /**
   * Thông tin về người/hệ thống tạo/cập nhật bản dịch
   */
  @Column({ nullable: true })
  translatedBy?: string;

  /**
   * Thời điểm cập nhật cuối cùng
   */
  @Column()
  lastUpdatedAt: Date;

  /**
   * Thời điểm tạo
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Quan hệ nhiều-một với khóa bản dịch
   */
  @ManyToOne(() => TranslationKeyEntity, (key) => key.translations, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'translationKeyId' })
  translationKey: TranslationKeyEntity;
}
