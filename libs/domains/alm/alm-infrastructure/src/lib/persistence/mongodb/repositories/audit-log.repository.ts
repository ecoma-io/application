/**
 * @fileoverview Repository xử lý lưu trữ và truy xuất audit log trong MongoDB
 * @since 1.0.0
 */

import {
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogReadRepository,
  IAuditLogWriteRepository,
} from "@ecoma/alm-domain";
import {
  ICursorAheadPagination,
  ICursorBackPagination,
  ICursorBasedPaginatedResult,
  IOffsetBasedPaginatedResult,
  IOffsetPagination,
  IQuerySpecification,
} from "@ecoma/common-domain";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLogEntryEntity } from "../entities/audit-log-entry.entity";
import { AuditLogEntryMapper } from "../mappers/audit-log-entry.mapper";

/**
 * Repository xử lý lưu trữ và truy xuất audit log trong MongoDB
 * @implements {IAuditLogReadRepository}
 * @implements {IAuditLogWriteRepository}
 * @since 1.0.0
 */
@Injectable()
export class AuditLogMongoRepository
  implements IAuditLogReadRepository, IAuditLogWriteRepository
{
  private readonly logger = new Logger(AuditLogMongoRepository.name);

  constructor(
    @InjectModel(AuditLogEntryEntity.name)
    private readonly auditLogModel: Model<AuditLogEntryEntity>
  ) {
    // Log để debug
    this.logger.log(
      `AuditLogMongoRepository: Đã khởi tạo với model AuditLogEntryEntity`
    );
  }

  /**
   * Tìm audit log theo ID
   * @param {AuditLogEntryId} id - ID của audit log cần tìm
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findById(id: AuditLogEntryId): Promise<AuditLogEntry | null> {
    const entity = await this.auditLogModel.findOne({ id: id.value }).exec();
    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Tìm audit log theo Event ID
   * @param {string} eventId - Event ID cần tìm
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByEventId(eventId: string): Promise<AuditLogEntry | null> {
    this.logger.debug(`Tìm audit log theo eventId: ${eventId}`);
    const entity = await this.auditLogModel.findOne({ eventId }).exec();
    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Tìm audit log theo Resource ID
   * @param {string} resourceId - Resource ID cần tìm
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByResourceId(resourceId: string): Promise<AuditLogEntry | null> {
    this.logger.debug(`Tìm audit log theo resource.id: ${resourceId}`);

    const entity = await this.auditLogModel
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .findOne({ "resource.id": resourceId })
      .exec();
    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Tìm audit log theo Metadata Source
   * @param {string} source - Metadata source cần tìm
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByMetadataSource(source: string): Promise<AuditLogEntry | null> {
    this.logger.debug(`Tìm audit log theo metadata.source: ${source}`);

    const entity = await this.auditLogModel
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .findOne({ "metadata.source": source })
      .exec();
    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Kiểm tra sự tồn tại của audit log theo ID
   * @param {AuditLogEntryId} id - ID của audit log cần kiểm tra
   * @returns {Promise<boolean>} True nếu tồn tại, false nếu không tồn tại
   */
  async exists(id: AuditLogEntryId): Promise<boolean> {
    const count = await this.auditLogModel
      .countDocuments({ id: id.value })
      .exec();
    return count > 0;
  }

  /**
   * Tìm audit log theo query specification
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification để lọc kết quả
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log thỏa mãn điều kiện
   */
  async find(
    query: IQuerySpecification<AuditLogEntry>
  ): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel
      .find()
      .skip(query.getOffset())
      .limit(query.getLimit())
      .exec();
    const results = entities.map((e) => AuditLogEntryMapper.toDomain(e));
    return results.filter((r) => this.matchesQuery(r, query));
  }

  /**
   * Tìm audit log với offset pagination
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification để lọc kết quả
   * @param {IOffsetPagination} pagination - Thông tin phân trang
   * @returns {Promise<IOffsetBasedPaginatedResult<AuditLogEntry>>} Kết quả phân trang
   */
  async findWithOffsetPagination(
    query: IQuerySpecification<AuditLogEntry>,
    pagination: IOffsetPagination
  ): Promise<IOffsetBasedPaginatedResult<AuditLogEntry>> {
    const { offset, limit } = pagination;

    const entities = await this.auditLogModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();

    const results = entities
      .map((e) => AuditLogEntryMapper.toDomain(e))
      .filter((r) => this.matchesQuery(r, query));

    const total = await this.count(query);

    return {
      items: results,
      total,
      offset,
      limit,
    };
  }

  /**
   * Tìm audit log với cursor pagination
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification để lọc kết quả
   * @param {ICursorAheadPagination | ICursorBackPagination} pagination - Thông tin phân trang
   * @returns {Promise<ICursorBasedPaginatedResult<AuditLogEntry>>} Kết quả phân trang
   */
  async findWithCursorPagination(
    query: IQuerySpecification<AuditLogEntry>,
    pagination: ICursorAheadPagination | ICursorBackPagination
  ): Promise<ICursorBasedPaginatedResult<AuditLogEntry>> {
    throw new Error("Cursor pagination not implemented");
  }

  /**
   * Kiểm tra xem một entity có thỏa mãn query không
   * @param {AuditLogEntry} entity - Entity cần kiểm tra
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification
   * @returns {boolean} True nếu thỏa mãn
   * @private
   */
  private matchesQuery(
    entity: AuditLogEntry,
    query: IQuerySpecification<AuditLogEntry>
  ): boolean {
    const filters = query.getFilters();
    return filters.every((filter) => {
      const value = entity[filter.field];
      if (value === null || value === undefined) {
        return false;
      }

      const filterValue = filter.value;
      if (filterValue === null || filterValue === undefined) {
        return false;
      }

      switch (filter.operator) {
        case "eq":
          return value === filterValue;
        case "gt":
          if (typeof value !== "number" || typeof filterValue !== "number") {
            return false;
          }
          return value > filterValue;
        case "lt":
          if (typeof value !== "number" || typeof filterValue !== "number") {
            return false;
          }
          return value < filterValue;
        case "gte":
          if (typeof value !== "number" || typeof filterValue !== "number") {
            return false;
          }
          return value >= filterValue;
        case "lte":
          if (typeof value !== "number" || typeof filterValue !== "number") {
            return false;
          }
          return value <= filterValue;
        case "contains":
          if (typeof value !== "string" || typeof filterValue !== "string") {
            return false;
          }
          return value.includes(filterValue);
        default:
          return false;
      }
    });
  }

  /**
   * Đếm số lượng audit log thỏa mãn điều kiện
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification để lọc kết quả
   * @returns {Promise<number>} Số lượng audit log thỏa mãn điều kiện
   */
  async count(query: IQuerySpecification<AuditLogEntry>): Promise<number> {
    const entities = await this.auditLogModel.find().exec();
    const results = entities.map((e) => AuditLogEntryMapper.toDomain(e));
    return results.filter((r) => this.matchesQuery(r, query)).length;
  }

  /**
   * Lưu một audit log
   * @param {AuditLogEntry} auditLog - Audit log cần lưu
   * @returns {Promise<void>}
   */
  async save(auditLog: AuditLogEntry): Promise<void> {
    const persistenceData = AuditLogEntryMapper.toPersistence(auditLog);
    this.logger.debug(
      `Lưu audit log: ${JSON.stringify({
        id: persistenceData.id,
        eventId: persistenceData.eventId,
        tenantId: persistenceData.tenantId,
        resourceId: persistenceData.resource?.id,
        action: persistenceData.action,
      })}`
    );

    try {
      await this.auditLogModel
        .findOneAndUpdate({ id: persistenceData.id }, persistenceData, {
          upsert: true,
          new: true,
        })
        .exec();
      this.logger.debug(
        `Đã lưu audit log thành công với ID: ${persistenceData.id}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : "";
      this.logger.error(`Lỗi khi lưu audit log: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  /**
   * Lưu nhiều audit log
   * @param {AuditLogEntry[]} auditLogs - Danh sách audit log cần lưu
   * @returns {Promise<void>}
   */
  async saveMany(auditLogs: AuditLogEntry[]): Promise<void> {
    await Promise.all(auditLogs.map((log) => this.save(log)));
  }

  /**
   * Xóa một audit log theo ID
   * @param {AuditLogEntryId} id - ID của audit log cần xóa
   * @returns {Promise<void>}
   */
  async delete(id: AuditLogEntryId): Promise<void> {
    await this.auditLogModel.deleteOne({ id: id.value }).exec();
  }

  /**
   * Xóa nhiều audit log theo danh sách ID
   * @param {AuditLogEntryId[]} ids - Danh sách ID của các audit log cần xóa
   * @returns {Promise<void>}
   */
  async deleteMany(ids: AuditLogEntryId[]): Promise<void> {
    await this.auditLogModel
      .deleteMany({
        id: { $in: ids.map((id) => id.value) },
      })
      .exec();
  }

  /**
   * Tìm audit log theo tenant ID
   * @param {string} tenantId - ID của tenant
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log của tenant
   */
  async findByTenantId(tenantId: string): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find({ tenantId }).exec();
    return entities.map((entity) => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Tìm audit log theo bounded context
   * @param {string} boundedContext - Tên của bounded context
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log của bounded context
   */
  async findByBoundedContext(boundedContext: string): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find({ boundedContext }).exec();
    return entities.map((entity) => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Tìm audit log trong khoảng thời gian
   * @param {Date} startDate - Thời điểm bắt đầu
   * @param {Date} endDate - Thời điểm kết thúc
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log trong khoảng thời gian
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel
      .find({
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
    return entities.map((entity) => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Xóa các audit log cũ theo chính sách lưu trữ
   * @param {Date} olderThan - Thời điểm giới hạn
   * @returns {Promise<void>}
   */
  async deleteByRetentionPolicy(olderThan: Date): Promise<void> {
    this.logger.debug(`Xóa audit logs cũ hơn: ${olderThan.toISOString()}`);

    try {
      await this.auditLogModel.deleteMany({
        timestamp: { $lt: olderThan },
      });
    } catch (error: unknown) {
      this.logger.error("Lỗi khi xóa audit logs theo chính sách giữ", error);
      throw new Error(
        `Lỗi khi xóa audit logs theo chính sách giữ: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Xóa các audit logs cũ hơn ngày cho trước
   * @param {Date} cutoffDate - Ngày cắt, các logs cũ hơn ngày này sẽ bị xóa
   * @returns {Promise<{deletedCount: number}>} Số lượng bản ghi đã xóa
   */
  async deleteAuditLogsBefore(cutoffDate: Date): Promise<{deletedCount: number}> {
    this.logger.debug(`Deleting audit logs older than: ${cutoffDate.toISOString()}`);

    try {
      const result = await this.auditLogModel.deleteMany({
        timestamp: { $lt: cutoffDate },
      });
      
      return { deletedCount: result.deletedCount || 0 };
    } catch (error: unknown) {
      this.logger.error("Error deleting old audit logs", error);
      throw new Error(
        `Error deleting old audit logs: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Tìm audit log theo tenantId và eventId
   * @param {string} tenantId - ID của tenant
   * @param {string} eventId - ID của event
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByTenantIdAndEventId(
    tenantId: string,
    eventId: string
  ): Promise<AuditLogEntry | null> {
    this.logger.debug(
      `Tìm audit log theo tenantId: ${tenantId} và eventId: ${eventId}`
    );
    const entity = await this.auditLogModel
      .findOne({
        tenantId,
        eventId,
      })
      .exec();

    if (entity) {
      this.logger.debug(
        `Tìm thấy audit log với tenantId: ${tenantId} và eventId: ${eventId}`
      );
    } else {
      this.logger.debug(
        `Không tìm thấy audit log với tenantId: ${tenantId} và eventId: ${eventId}`
      );
    }

    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Tìm audit log theo tenantId và resourceId
   * @param {string} tenantId - ID của tenant
   * @param {string} resourceId - ID của resource
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByTenantIdAndResourceId(
    tenantId: string,
    resourceId: string
  ): Promise<AuditLogEntry | null> {
    this.logger.debug(
      `Tìm audit log theo tenantId: ${tenantId} và resource.id: ${resourceId}`
    );
    const entity = await this.auditLogModel
      .findOne({
        tenantId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "resource.id": resourceId,
      })
      .exec();

    if (entity) {
      this.logger.debug(
        `Tìm thấy audit log với tenantId: ${tenantId} và resource.id: ${resourceId}`
      );
    } else {
      this.logger.debug(
        `Không tìm thấy audit log với tenantId: ${tenantId} và resource.id: ${resourceId}`
      );
    }

    return entity ? AuditLogEntryMapper.toDomain(entity) : null;
  }

  /**
   * Nâng cao tìm kiếm theo eventId với nhiều thông tin hơn
   * @param {string} eventId - ID của event
   * @returns {Promise<AuditLogEntry | null>} Audit log nếu tìm thấy, null nếu không tìm thấy
   */
  async findByEventIdEnhanced(eventId: string): Promise<AuditLogEntry | null> {
    this.logger.debug(`Tìm kiếm nâng cao audit log theo eventId: ${eventId}`);

    // Tìm chính xác eventId
    const entity = await this.auditLogModel.findOne({ eventId }).exec();

    if (entity) {
      this.logger.debug(`Tìm thấy audit log với eventId: ${eventId}`);
      this.logger.debug(
        `Chi tiết: id=${entity.id}, tenantId=${entity.tenantId}, resource.id=${entity.resource?.id}`
      );
      return AuditLogEntryMapper.toDomain(entity);
    }

    // Nếu không tìm thấy, thử tìm kiếm một phần (đối với trường hợp eventId thay đổi format)
    this.logger.debug(
      `Không tìm thấy eventId chính xác, thử tìm kiếm một phần của eventId`
    );
    const partialMatchEntities = await this.auditLogModel
      .find({
        eventId: { $regex: eventId.split("-")[0], $options: "i" },
      })
      .exec();

    if (partialMatchEntities.length > 0) {
      this.logger.debug(
        `Tìm thấy ${partialMatchEntities.length} audit logs với eventId một phần.`
      );
      const firstMatch = partialMatchEntities[0];
      this.logger.debug(
        `Sử dụng kết quả đầu tiên: id=${firstMatch.id}, eventId=${firstMatch.eventId}`
      );
      return AuditLogEntryMapper.toDomain(firstMatch);
    }

    this.logger.debug(
      `Không tìm thấy bất kỳ audit log nào với eventId: ${eventId}`
    );
    return null;
  }
}
