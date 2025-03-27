import { ILogger } from "@ecoma/common-domain";

import { UnauthorizedError } from "../errors";
import { IAuditLogQueryAuthorizationPolicy } from "../policies";
import { IAuditLogEntryReadRepo } from "../ports/repository";
import {
  GetAuditLogsQuery,
  GetAuditLogsQueryHandler,
} from "../use-cases/queries";

/**
 * Service xử lý các truy vấn audit log với kiểm tra quyền.
 */
export class AuditLogQueryApplicationService {
  /**
   * Khởi tạo service truy vấn audit log.
   * @param auditLogRepo - Repository để đọc audit log
   * @param logger - Logger để ghi log
   * @param authorizationPolicy - Policy kiểm tra quyền truy vấn
   */
  constructor(
    private readonly auditLogRepo: IAuditLogEntryReadRepo,
    private readonly logger: ILogger,
    private readonly authorizationPolicy: IAuditLogQueryAuthorizationPolicy
  ) {}

  /**
   * Truy vấn audit logs với kiểm tra quyền.
   * @param user - Thông tin người dùng thực hiện truy vấn
   * @param query - Tiêu chí truy vấn audit logs
   * @returns Promise chứa kết quả truy vấn
   * @throws UnauthorizedError nếu người dùng không có quyền truy vấn
   */
  async getAuditLogs(
    user: { id: string; roles: string[]; tenantId?: string },
    query: GetAuditLogsQuery
  ) {
    this.logger.debug("Kiểm tra quyền truy vấn audit logs", {
      user,
      query: query.payload,
    });
    const allowed = await this.authorizationPolicy.canQueryAuditLogs(
      user,
      query.payload
    );
    if (!allowed) {
      this.logger.warn("User không đủ quyền truy vấn audit logs", { user });
      throw new UnauthorizedError(user.id);
    }
    // TODO: DI handler đúng chuẩn, tạm khởi tạo trực tiếp
    const handler = new GetAuditLogsQueryHandler(
      this.auditLogRepo,
      this.logger
    );
    return handler.execute(query);
  }
}
