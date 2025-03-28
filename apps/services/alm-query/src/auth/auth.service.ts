/**
 * @fileoverview Service xử lý xác thực quyền truy cập audit logs
 * @since 1.0.0
 */

import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

/**
 * Service xử lý xác thực quyền truy cập audit logs
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authBypass: boolean;

  /**
   * Constructor
   * @param iamClient - Client để gọi IAM service
   * @param configService - Config service để lấy biến môi trường
   */
  constructor(
    @Inject("IAM_SERVICE") private readonly iamClient: ClientProxy,
    private readonly configService: ConfigService
  ) {
    // Kiểm tra xem có bypass auth không (chỉ dùng trong môi trường test)
    this.authBypass = this.configService.get<string>("AUTH_BYPASS") === "true";
    if (this.authBypass) {
      this.logger.warn(
        "WARNING: Authentication bypass is enabled. This should only be used for testing!"
      );
    }
  }

  /**
   * Kiểm tra quyền truy cập audit logs
   * @param userId - ID của người dùng
   * @param tenantId - ID của tenant
   * @returns {Promise<boolean>} - true nếu có quyền truy cập, false nếu không
   */
  async canAccessAuditLogs(userId: string, tenantId: string): Promise<boolean> {
    // Nếu auth bypass được bật, luôn trả về true
    if (this.authBypass) {
      this.logger.debug(
        `Auth bypass enabled, granting access to user ${userId} for tenant ${tenantId}`
      );
      return true;
    }

    try {
      // Gọi đến IAM service để kiểm tra quyền
      const hasAccess = await firstValueFrom(
        this.iamClient.send("iam.permissions.check", {
          userId,
          tenantId,
          permission: "audit_logs.read",
        })
      );

      return hasAccess;
    } catch (error) {
      this.logger.error(
        `Error checking permissions: ${error.message}`,
        error.stack
      );
      // Trong trường hợp lỗi, mặc định từ chối quyền truy cập
      return false;
    }
  }
}
