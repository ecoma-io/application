import { RetentionPolicy } from "@ecoma/alm-domain";
import {
  AbstractLogger,
  CusorBasedPaginatedDTO,
  OffsetBasedPaginatedDTO,
} from "@ecoma/common-application";
import { RetentionPolicyQueryDto } from "../../dto";
import { IRetentionPolicyReadRepository } from "../../ports";

export class GetRetentionPoliciesQueryHandler {
  constructor(
    private readonly retentionPolicyReadRepo: IRetentionPolicyReadRepository,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(GetRetentionPoliciesQueryHandler.name);
  }

  async execute(
    query: RetentionPolicyQueryDto
  ): Promise<
    | CusorBasedPaginatedDTO<RetentionPolicy>
    | OffsetBasedPaginatedDTO<RetentionPolicy>
  > {
    const logId = `get-retention-policies_${Date.now()}`;

    try {
      this.logger.info(`Querying retention policies [${logId}]`, {
        filters: Object.keys(query.filters || {}).length,
        paginationType: query.pagination?.paginationType,
      });

      this.logger.debug(`Query details [${logId}]`, {
        filters: query.filters,
        sorts: query.sorts,
      });

      const result = await this.retentionPolicyReadRepo.find(query);

      this.logger.info(
        `Retrieved ${result.items.length} retention policies [${logId}]`,
        {
          total: result.total,
        }
      );

      // Convert domain objects to plain objects to ensure all properties are serialized correctly
      const plainItems = result.items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        boundedContext: item.boundedContext,
        retentionDays: item.retentionDays,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      if (query.pagination?.paginationType === "cursor") {
        return {
          success: true,
          data: plainItems,
          total: result.total,
          afterCursor: result.afterCursor || null,
          beforeCusor: result.beforeCursor || null,
        } as CusorBasedPaginatedDTO<any>;
      } else {
        return {
          success: true,
          data: plainItems,
          total: result.total,
        } as OffsetBasedPaginatedDTO<any>;
      }
    } catch (err) {
      const error = err as Error;

      this.logger.error(
        `Failed to query retention policies [${logId}] - ${error.message}`
      );

      throw error;
    }
  }
}
