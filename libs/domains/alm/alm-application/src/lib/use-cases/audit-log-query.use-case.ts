/**
 * @fileoverview Use case xử lý việc truy vấn audit log
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { IQueryBus } from '@ecoma/common-application';
import { GetAuditLogsQuery } from '../queries/get-audit-logs.query';
import { AuditLogDto } from '../dtos/audit-log.dto';
import { AuditLogQueryCriteriaDto } from '../dtos/audit-log-query-criteria.dto';

/**
 * Use case xử lý việc truy vấn audit log
 */
@Injectable()
export class AuditLogQueryUseCase {
  /**
   * Khởi tạo một instance của AuditLogQueryUseCase
   * @param {IQueryBus} queryBus - Query bus để gửi query
   */
  constructor(private readonly queryBus: IQueryBus) {}

  /**
   * Truy vấn danh sách audit log theo tiêu chí
   * @param {AuditLogQueryCriteriaDto} criteria - Tiêu chí truy vấn
   * @returns {Promise<AuditLogDto[]>} Danh sách audit log thỏa mãn tiêu chí
   */
  async query(criteria: AuditLogQueryCriteriaDto): Promise<AuditLogDto[]> {
    const query = new GetAuditLogsQuery(criteria, {
      timestamp: new Date(),
      version: '1.0'
    });
    return this.queryBus.execute(query);
  }
}
