import { QueryHandler, IQueryHandler } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { CheckResourceEntitlementQuery } from './check-resource-entitlement.query';
import { IEntitlementQueryPort } from '../../../interfaces/entitlement-query.port';

/**
 * Handler xử lý query kiểm tra khả năng sử dụng tài nguyên
 */
@QueryHandler(CheckResourceEntitlementQuery)
export class CheckResourceEntitlementHandler implements IQueryHandler<CheckResourceEntitlementQuery, boolean> {
  constructor(
    private readonly entitlementQueryPort: IEntitlementQueryPort,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý query kiểm tra khả năng sử dụng tài nguyên
   * @param query Query chứa thông tin tổ chức và tài nguyên cần kiểm tra
   * @returns Kết quả kiểm tra khả năng sử dụng tài nguyên
   */
  async execute(query: CheckResourceEntitlementQuery): Promise<boolean> {
    this.logger.debug(
      `Checking resource entitlement for organization ${query.organizationId}`,
      {
        organizationId: query.organizationId,
        resourceType: query.resourceType,
        currentUsage: query.currentUsage,
        additionalUsage: query.additionalUsage
      }
    );

    try {
      const result = await this.entitlementQueryPort.checkResourceEntitlement(
        query.organizationId,
        query.resourceType,
        query.additionalUsage
      );

      this.logger.debug(
        `Resource entitlement check result: ${result ? 'Allowed' : 'Denied'}`,
        {
          organizationId: query.organizationId,
          resourceType: query.resourceType,
          currentUsage: query.currentUsage,
          additionalUsage: query.additionalUsage,
          result
        }
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error checking resource entitlement: ${error.message}`,
        {
          organizationId: query.organizationId,
          resourceType: query.resourceType,
          currentUsage: query.currentUsage,
          additionalUsage: query.additionalUsage,
          error
        }
      );

      // Mặc định không cho phép nếu có lỗi
      return false;
    }
  }
}
