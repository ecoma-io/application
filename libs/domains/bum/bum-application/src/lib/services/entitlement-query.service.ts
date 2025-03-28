import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { IEntitlementQueryPort } from '../interfaces/entitlement-query.interface';
import { CheckFeatureEntitlementQuery } from '../use-cases/queries/check-feature-entitlement/check-feature-entitlement.query';
import { CheckResourceEntitlementQuery } from '../use-cases/queries/check-resource-entitlement/check-resource-entitlement.query';
import { GetResourceLimitQuery } from '../use-cases/queries/get-resource-limit/get-resource-limit.query';

/**
 * Service triển khai IEntitlementQueryPort, cho phép truy vấn quyền lợi của tổ chức
 */
@Injectable()
export class EntitlementQueryService implements IEntitlementQueryPort {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly logger: ILogger
  ) {}

  /**
   * Kiểm tra xem tổ chức có quyền lợi sử dụng một tính năng cụ thể không
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param featureType Loại tính năng cần kiểm tra
   */
  async hasFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean> {
    this.logger.debug(`EntitlementQueryService: Checking feature entitlement`, {
      organizationId,
      featureType
    });

    const query = new CheckFeatureEntitlementQuery(organizationId, featureType);
    return this.queryBus.execute(query);
  }

  /**
   * Kiểm tra xem tổ chức có thể tiêu thụ thêm tài nguyên không
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param currentUsage Lượng sử dụng hiện tại
   * @param additionalUsage Lượng sử dụng thêm cần kiểm tra
   */
  async canConsumeResource(
    organizationId: string,
    resourceType: string,
    currentUsage: number,
    additionalUsage: number
  ): Promise<boolean> {
    this.logger.debug(`EntitlementQueryService: Checking resource consumption capability`, {
      organizationId,
      resourceType,
      currentUsage,
      additionalUsage
    });

    const query = new CheckResourceEntitlementQuery(
      organizationId,
      resourceType,
      currentUsage,
      additionalUsage
    );

    return this.queryBus.execute(query);
  }

  /**
   * Lấy giới hạn tài nguyên hiện tại của tổ chức
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param resourceType Loại tài nguyên cần kiểm tra
   */
  async getResourceLimit(organizationId: string, resourceType: string): Promise<number | null> {
    this.logger.debug(`EntitlementQueryService: Getting resource limit`, {
      organizationId,
      resourceType
    });

    const query = new GetResourceLimitQuery(organizationId, resourceType);
    return this.queryBus.execute(query);
  }
}
