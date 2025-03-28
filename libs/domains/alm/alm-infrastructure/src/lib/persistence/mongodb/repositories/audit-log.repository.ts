/**
 * @fileoverview Repository xử lý lưu trữ và truy xuất audit log trong MongoDB
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuditLogReadRepository, IAuditLogWriteRepository } from '@ecoma/alm-domain';
import { AuditLogEntry, AuditLogEntryId } from '@ecoma/alm-domain';
import { AuditLogEntryEntity } from '../entities/audit-log-entry.entity';
import { AuditLogEntryMapper } from '../mappers/audit-log-entry.mapper';
import {
  IQuerySpecification,
  IReadRepository,
  ICursorBasedPaginatedResult,
  IOffsetBasedPaginatedResult,
  ICursorAheadPagination,
  ICursorBackPagination,
  IOffsetPagination
} from '@ecoma/common-domain';

/**
 * Repository xử lý lưu trữ và truy xuất audit log trong MongoDB
 * @implements {IAuditLogReadRepository}
 * @implements {IAuditLogWriteRepository}
 * @since 1.0.0
 */
@Injectable()
export class AuditLogMongoRepository implements IAuditLogReadRepository, IAuditLogWriteRepository {
  constructor(
    @InjectModel(AuditLogEntryEntity.name)
    private readonly auditLogModel: Model<AuditLogEntryEntity>,
  ) {}

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
   * Kiểm tra sự tồn tại của audit log theo ID
   * @param {AuditLogEntryId} id - ID của audit log cần kiểm tra
   * @returns {Promise<boolean>} True nếu tồn tại, false nếu không tồn tại
   */
  async exists(id: AuditLogEntryId): Promise<boolean> {
    const count = await this.auditLogModel.countDocuments({ id: id.value }).exec();
    return count > 0;
  }

  /**
   * Tìm audit log theo query specification
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification để lọc kết quả
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log thỏa mãn điều kiện
   */
  async find(query: IQuerySpecification<AuditLogEntry>): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find()
      .skip(query.getOffset())
      .limit(query.getLimit())
      .exec();
    const results = entities.map(e => AuditLogEntryMapper.toDomain(e));
    return results.filter(r => this.matchesQuery(r, query));
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

    const entities = await this.auditLogModel.find()
      .skip(offset)
      .limit(limit)
      .exec();

    const results = entities.map(e => AuditLogEntryMapper.toDomain(e))
      .filter(r => this.matchesQuery(r, query));

    const total = await this.count(query);

    return {
      items: results,
      total,
      offset,
      limit
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
    throw new Error('Cursor pagination not implemented');
  }

  /**
   * Kiểm tra xem một entity có thỏa mãn query không
   * @param {AuditLogEntry} entity - Entity cần kiểm tra
   * @param {IQuerySpecification<AuditLogEntry>} query - Query specification
   * @returns {boolean} True nếu thỏa mãn
   * @private
   */
  private matchesQuery(entity: AuditLogEntry, query: IQuerySpecification<AuditLogEntry>): boolean {
    const filters = query.getFilters();
    return filters.every(filter => {
      const value = entity[filter.field];
      if (value === null || value === undefined) {
        return false;
      }

      const filterValue = filter.value;
      if (filterValue === null || filterValue === undefined) {
        return false;
      }

      switch (filter.operator) {
        case 'eq':
          return value === filterValue;
        case 'gt':
          if (typeof value !== 'number' || typeof filterValue !== 'number') {
            return false;
          }
          return value > filterValue;
        case 'lt':
          if (typeof value !== 'number' || typeof filterValue !== 'number') {
            return false;
          }
          return value < filterValue;
        case 'gte':
          if (typeof value !== 'number' || typeof filterValue !== 'number') {
            return false;
          }
          return value >= filterValue;
        case 'lte':
          if (typeof value !== 'number' || typeof filterValue !== 'number') {
            return false;
          }
          return value <= filterValue;
        case 'contains':
          if (typeof value !== 'string' || typeof filterValue !== 'string') {
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
    const results = entities.map(e => AuditLogEntryMapper.toDomain(e));
    return results.filter(r => this.matchesQuery(r, query)).length;
  }

  /**
   * Lưu một audit log
   * @param {AuditLogEntry} auditLog - Audit log cần lưu
   * @returns {Promise<void>}
   */
  async save(auditLog: AuditLogEntry): Promise<void> {
    const persistenceData = AuditLogEntryMapper.toPersistence(auditLog);
    await this.auditLogModel.findOneAndUpdate(
      { id: persistenceData.id },
      persistenceData,
      { upsert: true, new: true }
    ).exec();
  }

  /**
   * Lưu nhiều audit log
   * @param {AuditLogEntry[]} auditLogs - Danh sách audit log cần lưu
   * @returns {Promise<void>}
   */
  async saveMany(auditLogs: AuditLogEntry[]): Promise<void> {
    await Promise.all(auditLogs.map(log => this.save(log)));
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
    await this.auditLogModel.deleteMany({
      id: { $in: ids.map(id => id.value) }
    }).exec();
  }

  /**
   * Tìm audit log theo tenant ID
   * @param {string} tenantId - ID của tenant
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log của tenant
   */
  async findByTenantId(tenantId: string): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find({ tenantId }).exec();
    return entities.map(entity => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Tìm audit log theo bounded context
   * @param {string} boundedContext - Tên của bounded context
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log của bounded context
   */
  async findByBoundedContext(boundedContext: string): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find({ boundedContext }).exec();
    return entities.map(entity => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Tìm audit log trong khoảng thời gian
   * @param {Date} startDate - Thời điểm bắt đầu
   * @param {Date} endDate - Thời điểm kết thúc
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log trong khoảng thời gian
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLogEntry[]> {
    const entities = await this.auditLogModel.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
    return entities.map(entity => AuditLogEntryMapper.toDomain(entity));
  }

  /**
   * Xóa các audit log cũ theo chính sách lưu trữ
   * @param {Date} olderThan - Thời điểm giới hạn
   * @returns {Promise<void>}
   */
  async deleteByRetentionPolicy(olderThan: Date): Promise<void> {
    await this.auditLogModel.deleteMany({
      timestamp: { $lt: olderThan }
    }).exec();
  }
}
