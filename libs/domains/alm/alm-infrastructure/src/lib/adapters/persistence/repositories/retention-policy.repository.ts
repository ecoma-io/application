import {
  IRetentionPolicyReadRepo,
  IRetentionPolicyWriteRepo,
} from "@ecoma/alm-application";
import {
  IRetentionPolicyProps,
  RetentionPolicy,
  RetentionPolicyId,
} from "@ecoma/alm-domain";
import {
  ICursorAheadPagination,
  ICursorBackPagination,
  ICursorBasedPaginatedResult,
  ILogger,
  IOffsetBasedPaginatedResult,
  IOffsetPagination,
  IQuerySpecification,
  UuidId,
} from "@ecoma/common-domain";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RetentionPolicyEntity } from "../entities/retention-policy.entity";
import { RetentionPolicyMapper } from "../mappers/retention-policy.mapper";

/**
 * Lớp đại diện cho kho lưu trữ chính sách lưu trữ.
 * @implements IRetentionPolicyWriteRepo
 * @implements IRetentionPolicyReadRepo
 */
@Injectable()
export class RetentionPolicyRepository
  implements IRetentionPolicyWriteRepo, IRetentionPolicyReadRepo
{
  /**
   * Khởi tạo kho lưu trữ chính sách lưu trữ.
   * @param model Mô hình của MongoDB.
   * @param logger Đối tượng ghi log.
   */
  constructor(
    @InjectModel(RetentionPolicyEntity.name)
    private readonly model: Model<RetentionPolicyEntity>,
    private readonly logger: ILogger
  ) {}

  /**
   * Lưu chính sách lưu trữ.
   * @param policy Chính sách lưu trữ cần lưu.
   * @returns Promise<void>
   */
  async save(policy: RetentionPolicy): Promise<void> {
    try {
      const entity = RetentionPolicyMapper.toPersistence(policy);
      await this.model.findOneAndUpdate({ id: entity.id }, entity, {
        upsert: true,
      });
    } catch (error) {
      this.logger.error("Failed to save retention policy", error as Error);
      throw error;
    }
  }

  /**
   * Cập nhật chính sách lưu trữ.
   * @param id ID của chính sách lưu trữ cần cập nhật.
   * @param update Các thông tin cần cập nhật.
   * @returns Promise<void>
   */
  async update(
    id: UuidId,
    update: Partial<IRetentionPolicyProps>
  ): Promise<void> {
    try {
      await this.model.findOneAndUpdate({ id: id.value }, { $set: update });
    } catch (error) {
      this.logger.error("Failed to update retention policy", error as Error);
      throw error;
    }
  }

  /**
   * Tìm chính sách lưu trữ theo ID.
   * @param id ID của chính sách lưu trữ cần tìm.
   * @returns Promise<RetentionPolicy | null>
   */
  async findById(id: RetentionPolicyId): Promise<RetentionPolicy | null> {
    try {
      const entity = await this.model.findOne({ id: id.value });
      return entity ? RetentionPolicyMapper.toDomain(entity) : null;
    } catch (error) {
      this.logger.error(
        "Failed to find retention policy by id",
        error as Error
      );
      throw error;
    }
  }

  /**
   * Tìm các chính sách lưu trữ đang hoạt động.
   * @returns Promise<RetentionPolicy[]>
   */
  async findActive(): Promise<RetentionPolicy[]> {
    try {
      const entities = await this.model.find({ isActive: true });
      return entities.map(RetentionPolicyMapper.toDomain);
    } catch (error) {
      this.logger.error(
        "Failed to find active retention policies",
        error as Error
      );
      throw error;
    }
  }

  /**
   * Tìm chính sách lưu trữ theo tên.
   * @param name Tên của chính sách lưu trữ cần tìm.
   * @returns Promise<RetentionPolicy | null>
   */
  async findByName(name: string): Promise<RetentionPolicy | null> {
    try {
      const entity = await this.model.findOne({ name });
      return entity ? RetentionPolicyMapper.toDomain(entity) : null;
    } catch (error) {
      this.logger.error(
        "Failed to find retention policy by name",
        error as Error
      );
      throw error;
    }
  }

  /**
   * Xóa chính sách lưu trữ.
   * @param id ID của chính sách lưu trữ cần xóa.
   * @returns Promise<void>
   */
  async delete(id: RetentionPolicyId): Promise<void> {
    try {
      await this.model.deleteOne({ id: id.value });
    } catch (error) {
      this.logger.error("Failed to delete retention policy", error as Error);
      throw error;
    }
  }

  /**
   * Xóa nhiều chính sách lưu trữ.
   * @param ids Danh sách ID của các chính sách lưu trữ cần xóa.
   * @returns Promise<void>
   */
  async deleteMany(ids: RetentionPolicyId[]): Promise<void> {
    try {
      await this.model.deleteMany({ id: { $in: ids.map((id) => id.value) } });
    } catch (error) {
      this.logger.error("Failed to delete retention policies", error as Error);
      throw error;
    }
  }

  /**
   * Tìm các chính sách lưu trữ theo bộ lọc.
   * @param specification Bộ lọc để tìm kiếm các chính sách lưu trữ.
   * @returns Promise<RetentionPolicy[]>
   */
  async find(
    specification: IQuerySpecification<RetentionPolicy>
  ): Promise<RetentionPolicy[]> {
    try {
      const query = this.buildQuery(specification);
      const entities = await this.model.find(query);
      return entities.map(RetentionPolicyMapper.toDomain);
    } catch (error) {
      this.logger.error("Failed to find retention policies", error as Error);
      throw error;
    }
  }

  /**
   * Tìm các chính sách lưu trữ với phân trang theo offset.
   * @param specification Bộ lọc để tìm kiếm các chính sách lưu trữ.
   * @param pagination Thông tin phân trang.
   * @returns Promise<IOffsetBasedPaginatedResult<RetentionPolicy>>
   */
  async findWithOffsetPagination(
    specification: IQuerySpecification<RetentionPolicy>,
    pagination: IOffsetPagination
  ): Promise<IOffsetBasedPaginatedResult<RetentionPolicy>> {
    try {
      const query = this.buildQuery(specification);
      const [entities, total] = await Promise.all([
        this.model.find(query).skip(pagination.offset).limit(pagination.limit),
        this.model.countDocuments(query),
      ]);
      return {
        items: entities.map(RetentionPolicyMapper.toDomain),
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      };
    } catch (error) {
      this.logger.error(
        "Failed to find retention policies with offset pagination",
        error as Error
      );
      throw error;
    }
  }

  /**
   * Tìm các chính sách lưu trữ với phân trang theo cursor.
   * @param specification Bộ lọc để tìm kiếm các chính sách lưu trữ.
   * @param pagination Thông tin phân trang.
   * @returns Promise<ICursorBasedPaginatedResult<RetentionPolicy>>
   */
  async findWithCursorPagination(
    specification: IQuerySpecification<RetentionPolicy>,
    pagination: ICursorAheadPagination | ICursorBackPagination
  ): Promise<ICursorBasedPaginatedResult<RetentionPolicy>> {
    try {
      const query = this.buildQuery(specification);
      if (pagination.cursor) {
        const mongoQuery = query as Record<string, unknown>;
        mongoQuery["_id"] = { $gt: pagination.cursor };
      }
      const entities = await this.model.find(query).limit(pagination.limit + 1);
      const hasMore = entities.length > pagination.limit;
      const items = entities
        .slice(0, pagination.limit)
        .map(RetentionPolicyMapper.toDomain);
      const lastEntity = hasMore ? entities[pagination.limit - 1] : null;
      return {
        items,
        limit: pagination.limit,
        nextCursor: lastEntity ? lastEntity.id : undefined,
      };
    } catch (error) {
      this.logger.error(
        "Failed to find retention policies with cursor pagination",
        error as Error
      );
      throw error;
    }
  }

  private buildQuery(
    specification: IQuerySpecification<RetentionPolicy>
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    for (const filter of specification.getFilters()) {
      const value = filter.value as unknown;
      query[filter.field as string] = value;
    }
    return query;
  }
}
