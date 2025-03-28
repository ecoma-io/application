import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITranslationSetRepository, TranslationSet } from '@ecoma/domains/lzm/lzm-domain';
import { TranslationSetEntity } from '../entities/translation-set.entity';
import { TranslationSetMapper } from '../mappers/translation-set.mapper';

/**
 * Triển khai ITranslationSetRepository sử dụng TypeORM
 */
@Injectable()
export class TypeOrmTranslationSetRepository implements ITranslationSetRepository {
  /**
   * Khởi tạo repository
   * @param repository TypeORM repository cho TranslationSetEntity
   */
  constructor(
    @InjectRepository(TranslationSetEntity)
    private readonly repository: Repository<TranslationSetEntity>
  ) {}

  /**
   * Lưu một TranslationSet
   * @param translationSet TranslationSet domain object cần lưu
   * @returns Promise với TranslationSet đã lưu
   */
  async save(translationSet: TranslationSet): Promise<TranslationSet> {
    // Chuyển đổi từ domain object sang entity
    const entity = TranslationSetMapper.toPersistence(translationSet);

    // Lưu entity vào database
    const savedEntity = await this.repository.save(entity);

    // Chuyển đổi từ entity trở lại domain object
    return TranslationSetMapper.toDomain(savedEntity);
  }

  /**
   * Tìm một TranslationSet theo ID
   * @param id ID của TranslationSet cần tìm
   * @returns Promise với TranslationSet nếu tìm thấy, null nếu không
   */
  async findById(id: string): Promise<TranslationSet | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['translationKeys', 'translationKeys.translations']
    });

    if (!entity) {
      return null;
    }

    return TranslationSetMapper.toDomain(entity);
  }

  /**
   * Tìm một TranslationSet theo tên
   * @param name Tên của TranslationSet cần tìm
   * @returns Promise với TranslationSet nếu tìm thấy, null nếu không
   */
  async findByName(name: string): Promise<TranslationSet | null> {
    const entity = await this.repository.findOne({
      where: { name }
    });

    if (!entity) {
      return null;
    }

    return TranslationSetMapper.toDomain(entity);
  }

  /**
   * Lấy danh sách tất cả TranslationSet, có thể phân trang
   * @param page Số trang (bắt đầu từ 0)
   * @param limit Số lượng item trên mỗi trang
   * @returns Promise với mảng các TranslationSet
   */
  async findAll(page: number = 0, limit: number = 10): Promise<TranslationSet[]> {
    const entities = await this.repository.find({
      skip: page * limit,
      take: limit,
      order: { name: 'ASC' }
    });

    return entities.map(entity => TranslationSetMapper.toDomain(entity));
  }

  /**
   * Lấy tổng số TranslationSet
   * @returns Promise với số lượng TranslationSet
   */
  async count(): Promise<number> {
    return this.repository.count();
  }

  /**
   * Xóa một TranslationSet theo ID
   * @param id ID của TranslationSet cần xóa
   * @returns Promise với true nếu xóa thành công, false nếu không tìm thấy
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  /**
   * Kiểm tra xem tên TranslationSet đã tồn tại chưa
   * @param name Tên cần kiểm tra
   * @param excludeId ID của TranslationSet cần loại trừ khỏi việc kiểm tra (cho trường hợp cập nhật)
   * @returns Promise với true nếu tên đã tồn tại, false nếu chưa
   */
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const query = this.repository.createQueryBuilder('translationSet')
      .where('translationSet.name = :name', { name });

    if (excludeId) {
      query.andWhere('translationSet.id != :id', { id: excludeId });
    }

    const count = await query.getCount();
    return count > 0;
  }
}
