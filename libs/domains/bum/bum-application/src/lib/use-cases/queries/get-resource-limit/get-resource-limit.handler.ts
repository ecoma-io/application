import { QueryHandler, IQueryHandler } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { GetResourceLimitQuery } from './get-resource-limit.query';
import { IEntitlementQueryPort } from '../../../interfaces/entitlement-query.port';

/**
 * Handler xử lý query lấy giới hạn tài nguyên
 */
@QueryHandler(GetResourceLimitQuery)
export class GetResourceLimitHandler implements IQueryHandler<GetResourceLimitQuery, number | null> {
  constructor(
    private readonly entitlementQueryPort: IEntitlementQueryPort,
    private readonly logger: ILogger
  ) {}

  /**
   * Xử lý query lấy giới hạn tài nguyên
   * @param query Query chứa thông tin tổ chức và loại tài nguyên
   * @returns Giới hạn tài nguyên hoặc null nếu không tìm thấy
   */
  async execute(query: GetResourceLimitQuery): Promise<number | null> {
    this.logger.debug(`Getting resource limit for organization ${query.organizationId}`, {
      organizationId: query.organizationId,
      resourceType: query.resourceType
    });

    try {
      const result = await this.entitlementQueryPort.getResourceLimit(
        query.organizationId,
        query.resourceType
      );

      this.logger.debug(`Resource limit retrieved: ${result}`, {
        organizationId: query.organizationId,
        resourceType: query.resourceType,
        result
      });

      return result;
    } catch (error) {
      this.logger.error(`Error getting resource limit: ${error.message}`, {
        organizationId: query.organizationId,
        resourceType: query.resourceType,
        error
      });

      // Return null if there's an error
      return null;
    }
  }
}
