/**
 * @fileoverview Handler xử lý query lấy danh sách audit log
 * @since 1.0.0
 */

import { IQueryHandler } from '@ecoma/common-application';
import { AuditLogEntry, UnauthorizedAccessError } from '@ecoma/alm-domain';
import { GetAuditLogsQuery } from '../get-audit-logs.query';
import { IAuditLogRepository } from '../../interfaces/persistence/audit-log.repository';
import { IAuthorizationService } from '../../interfaces/iam/authorization.service';

/**
 * Handler xử lý query lấy danh sách audit log
 */
export class GetAuditLogsHandler implements IQueryHandler<GetAuditLogsQuery, AuditLogEntry[]> {
  /**
   * Khởi tạo một instance của GetAuditLogsHandler
   * @param {IAuditLogRepository} auditLogRepository - Repository xử lý audit log
   * @param {IAuthorizationService} authorizationService - Service xử lý phân quyền
   */
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly authorizationService: IAuthorizationService
  ) {}

  /**
   * Xử lý query lấy danh sách audit log
   * @param {GetAuditLogsQuery} query - Query cần xử lý
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log thỏa mãn tiêu chí
   * @throws {UnauthorizedAccessError} Nếu người dùng không có quyền truy cập
   */
  async handle(query: GetAuditLogsQuery): Promise<AuditLogEntry[]> {
    // Kiểm tra quyền truy cập
    const hasAccess = await this.authorizationService.canAccessAuditLogs(query.criteria);
    if (!hasAccess) {
      throw new UnauthorizedAccessError('Không có quyền truy cập audit logs');
    }

    // Thực hiện truy vấn
    return this.auditLogRepository.findByCriteria(query.criteria);
  }
}
