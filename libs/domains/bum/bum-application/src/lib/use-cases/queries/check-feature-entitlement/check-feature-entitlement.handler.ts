import { QueryHandler, IQueryHandler } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { CheckFeatureEntitlementQuery } from './check-feature-entitlement.query';
import { IEntitlementQueryPort } from '../../../interfaces/entitlement-query.port';

/**
 * Handler xử lý query CheckFeatureEntitlement
 */
@QueryHandler(CheckFeatureEntitlementQuery)
export class CheckFeatureEntitlementHandler
  implements IQueryHandler<CheckFeatureEntitlementQuery, boolean> {
  constructor(
    private readonly entitlementQueryPort: IEntitlementQueryPort,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý query kiểm tra quyền sử dụng tính năng
   * @param query Query chứa organizationId và featureType
   * @returns true nếu có quyền, false nếu không
   */
  async execute(query: CheckFeatureEntitlementQuery): Promise<boolean> {
    this.logger.debug(
      `Checking feature entitlement for organization ${query.organizationId} and feature ${query.featureType}`,
      {
        organizationId: query.organizationId,
        featureType: query.featureType
      }
    );

    try {
      const result = await this.entitlementQueryPort.checkFeatureEntitlement(
        query.organizationId,
        query.featureType
      );

      this.logger.debug(
        `Feature entitlement check result: ${result ? 'Allowed' : 'Denied'}`,
        {
          organizationId: query.organizationId,
          featureType: query.featureType,
          result
        }
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error checking feature entitlement: ${error.message}`,
        {
          organizationId: query.organizationId,
          featureType: query.featureType,
          error
        }
      );

      // Mặc định không cho phép nếu có lỗi
      return false;
    }
  }
}
