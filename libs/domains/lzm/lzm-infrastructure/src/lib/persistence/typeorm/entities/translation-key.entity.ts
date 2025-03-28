import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TranslationSetEntity } from './translation-set.entity';
import { TranslationEntity } from './translation.entity';

/**
 * Enum các trạng thái có thể của khóa bản dịch
 */
export enum TranslationKeyStatusEnum {
  NEEDS_TRANSLATION = 'NeedsTranslation',
  TRANSLATED = 'Translated',
  NEEDS_REVIEW = 'NeedsReview',
}

/**
 * TranslationKey entity cho TypeORM
 */
@Entity('translation_keys')
export class TranslationKeyEntity {
  /**
   * ID duy nhất của khóa bản dịch
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * ID của tập bản dịch chứa khóa này
   */
  @Column('uuid')
  translationSetId: string;

  /**
   * Chuỗi định danh duy nhất của khóa bản dịch trong phạm vi tập
   */
  @Column()
  key: string;

  /**
   * Mô tả ngữ cảnh sử dụng của khóa bản dịch
   */
  @Column({ nullable: true, type: 'text' })
  description?: string;

  /**
   * Nội dung gốc của khóa bản dịch
   */
  @Column({ type: 'text' })
  sourceContent: string;

  /**
   * Trạng thái chung của khóa bản dịch
   */
  @Column({
    type: 'enum',
    enum: TranslationKeyStatusEnum,
    default: TranslationKeyStatusEnum.NEEDS_TRANSLATION
  })
  status: string;

  /**
   * Thời điểm tạo
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Quan hệ nhiều-một với tập bản dịch
   */
  @ManyToOne(() => TranslationSetEntity, (set) => set.translationKeys, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'translationSetId' })
  translationSet: TranslationSetEntity;

  /**
   * Quan hệ một-nhiều với các bản dịch
   */
  @OneToMany(() => TranslationEntity, (translation) => translation.translationKey, {
    cascade: true
  })
  translations: TranslationEntity[];
}
