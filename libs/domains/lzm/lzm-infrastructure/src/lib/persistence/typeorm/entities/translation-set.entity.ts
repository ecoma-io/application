import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TranslationKeyEntity } from './translation-key.entity';

/**
 * TranslationSet entity cho TypeORM
 */
@Entity('translation_sets')
export class TranslationSetEntity {
  /**
   * ID duy nhất của tập bản dịch
   */
  @PrimaryColumn('uuid')
  id: string;

  /**
   * Tên định danh duy nhất của tập bản dịch
   */
  @Column({ unique: true })
  name: string;

  /**
   * Mô tả về tập bản dịch
   */
  @Column({ nullable: true, type: 'text' })
  description?: string;

  /**
   * Trạng thái hoạt động của tập bản dịch
   */
  @Column({ default: true })
  isActive: boolean;

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
   * Quan hệ một-nhiều với các khóa bản dịch
   */
  @OneToMany(() => TranslationKeyEntity, (key) => key.translationSet, {
    cascade: true
  })
  translationKeys: TranslationKeyEntity[];
}
