import {
  IAuditLogEntryReadRepo,
  IAuditLogEntryWriteRepo,
} from "@ecoma/alm-application";
import {
  AuditLogEntry,
  AuditLogEntryId,
  AuditLogQueryCriteria,
  IAuditLogQueryCriteriaProps,
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

import { AuditLogEntity } from "../entities/audit-log.entity";
import { AuditLogMapper } from "../mappers/audit-log.mapper";

/**
 * Lớp đại diện cho kho lưu trữ nhật ký kiểm toán.
 * @implements IAuditLogEntryWriteRepo
 * @implements IAuditLogEntryReadRepo
 */
@Injectable()
export class AuditLogRepository
  implements IAuditLogEntryWriteRepo, IAuditLogEntryReadRepo
{
  /**
   * Khởi tạo kho lưu trữ nhật ký kiểm toán.
   * @param model Mô hình của MongoDB.
   * @param logger Đối tượng ghi log.
   */
  constructor(
    @InjectModel(AuditLogEntity.name)
    private readonly model: Model<AuditLogEntity>,
    private readonly logger: ILogger
  ) {}

  /**
   * Lưu nhật ký kiểm toán.
   * @param auditLog Nhật ký kiểm toán cần lưu.
   * @returns Promise không có giá trị trả về.
   */
  async save(auditLog: AuditLogEntry): Promise<void> {
    try {
      const entity = AuditLogMapper.toPersistence(auditLog);
      await this.model.findOneAndUpdate({ id: entity.id }, entity, {
        upsert: true,
      });
    } catch (error) {
      this.logger.error("Cannot save audit log", error as Error);
      throw error;
    }
  }

  /**
   * Tìm nhật ký kiểm toán theo ID.
   * @param id ID của nhật ký kiểm toán cần tìm.
   * @returns Promise trả về nhật ký kiểm toán nếu tìm thấy, ngược lại trả về null.
   */
  async findById(id: AuditLogEntryId): Promise<AuditLogEntry | null> {
    try {
      const entity = await this.model.findOne({ id: id.value });
      return entity ? AuditLogMapper.toDomain(entity) : null;
    } catch (error) {
      this.logger.error("Audit log not found", error as Error);
      throw error;
    }
  }

  /**
   * Tìm tất cả nhật ký kiểm toán của một người thuê.
   * @param tenantId ID của người thuê.
   * @returns Promise trả về mảng các nhật ký kiểm toán.
   */
  async findByTenantId(tenantId: string): Promise<AuditLogEntry[]> {
    try {
      const entities = await this.model.find({ tenantId });
      return entities.map(AuditLogMapper.toDomain);
    } catch (error) {
      this.logger.error("Cannot find audit logs by tenantId", error as Error);
      throw error;
    }
  }

  /**
   * Xóa tất cả nhật ký kiểm toán của một người thuê.
   * @param tenantId ID của người thuê.
   * @returns Promise không có giá trị trả về.
   */
  async deleteByTenantId(tenantId: string): Promise<void> {
    try {
      await this.model.deleteMany({ tenantId });
    } catch (error) {
      this.logger.error("Cannot delete audit logs by tenantId", error as Error);
      throw error;
    }
  }

  /**
   * Xóa các nhật ký kiểm toán đã hết hạn.
   * @param beforeDate Ngày trước đó để xóa các nhật ký kiểm toán.
   * @returns Promise không có giá trị trả về.
   */
  async deleteExpiredLogs(beforeDate: Date): Promise<void> {
    try {
      await this.model.deleteMany({ timestamp: { $lt: beforeDate } });
    } catch (error) {
      this.logger.error("Cannot delete expired audit logs", error as Error);
      throw error;
    }
  }

  async find(
    specification: IQuerySpecification<AuditLogEntry>
  ): Promise<AuditLogEntry[]> {
    try {
      const query = this.buildQuery(specification);
      const entities = await this.model.find(query);
      return entities.map(AuditLogMapper.toDomain);
    } catch (error) {
      this.logger.error("Cannot find audit logs", error as Error);
      throw error;
    }
  }

  async findWithOffsetPagination(
    specification: IQuerySpecification<AuditLogEntry>,
    pagination: IOffsetPagination
  ): Promise<IOffsetBasedPaginatedResult<AuditLogEntry>> {
    try {
      const query = this.buildQuery(specification);
      const [entities, total] = await Promise.all([
        this.model.find(query).skip(pagination.offset).limit(pagination.limit),
        this.model.countDocuments(query),
      ]);
      return {
        items: entities.map(AuditLogMapper.toDomain),
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      };
    } catch (error) {
      this.logger.error(
        "Cannot find audit logs with offset pagination",
        error as Error
      );
      throw error;
    }
  }

  async findWithCursorPagination(
    specification: IQuerySpecification<AuditLogEntry>,
    pagination: ICursorAheadPagination | ICursorBackPagination
  ): Promise<ICursorBasedPaginatedResult<AuditLogEntry>> {
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
        .map(AuditLogMapper.toDomain);
      const lastEntity = hasMore ? entities[pagination.limit - 1] : null;
      return {
        items,
        limit: pagination.limit,
        nextCursor: lastEntity ? lastEntity.id : undefined,
      };
    } catch (error) {
      this.logger.error(
        "Cannot find audit logs with cursor pagination",
        error as Error
      );
      throw error;
    }
  }

  async findByCriteria(
    criteria: AuditLogQueryCriteria
  ): Promise<{ data: AuditLogEntry[]; total: number }> {
    try {
      const query = this.buildCriteriaQuery(criteria);
      const [entities, total] = await Promise.all([
        this.model
          .find(query)
          .skip((criteria.pageNumber - 1) * criteria.pageSize)
          .limit(criteria.pageSize),
        this.model.countDocuments(query),
      ]);
      return {
        data: entities.map(AuditLogMapper.toDomain),
        total,
      };
    } catch (error) {
      this.logger.error("Cannot find audit logs by criteria", error as Error);
      throw error;
    }
  }

  async delete(id: UuidId): Promise<void> {
    try {
      await this.model.deleteOne({ id: id.value });
    } catch (error) {
      this.logger.error("Cannot delete audit log", error as Error);
      throw error;
    }
  }

  async deleteMany(ids: UuidId[]): Promise<void> {
    try {
      await this.model.deleteMany({ id: { $in: ids.map((id) => id.value) } });
    } catch (error) {
      this.logger.error("Cannot delete audit logs", error as Error);
      throw error;
    }
  }

  private buildQuery(
    specification: IQuerySpecification<AuditLogEntry>
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    for (const filter of specification.getFilters()) {
      const value = filter.value as unknown;
      query[filter.field as string] = value;
    }
    return query;
  }

  private buildCriteriaQuery(
    criteria: AuditLogQueryCriteria
  ): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    const criteriaProps = criteria as unknown as IAuditLogQueryCriteriaProps;

    if (criteriaProps.tenantId) query["tenantId"] = criteriaProps.tenantId;
    if (criteriaProps.boundedContext)
      query["boundedContext"] = criteriaProps.boundedContext;
    if (criteriaProps.actionType)
      query["actionType"] = criteriaProps.actionType;
    if (criteriaProps.category) query["category"] = criteriaProps.category;
    if (criteriaProps.severity) query["severity"] = criteriaProps.severity;
    if (criteriaProps.entityType)
      query["entityType"] = criteriaProps.entityType;
    if (criteriaProps.entityId) query["entityId"] = criteriaProps.entityId;
    if (criteriaProps.status) query["status"] = criteriaProps.status;

    if (criteriaProps.timestampRange) {
      query["timestamp"] = {
        ...(criteriaProps.timestampRange.from && {
          $gte: criteriaProps.timestampRange.from,
        }),
        ...(criteriaProps.timestampRange.to && {
          $lte: criteriaProps.timestampRange.to,
        }),
      };
    }

    if (criteriaProps.createdAtRange) {
      query["createdAt"] = {
        ...(criteriaProps.createdAtRange.from && {
          $gte: criteriaProps.createdAtRange.from,
        }),
        ...(criteriaProps.createdAtRange.to && {
          $lte: criteriaProps.createdAtRange.to,
        }),
      };
    }

    return query;
  }
}
