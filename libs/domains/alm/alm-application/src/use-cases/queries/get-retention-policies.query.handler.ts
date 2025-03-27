import { RetentionPolicy } from "@ecoma/alm-domain";
import {
  ILogger,
  IOffsetBasedPaginatedResult,
  IOffsetPagination,
  IQuerySpecification,
} from "@ecoma/common-domain";
import { validateSync } from "class-validator";

import { RetentionPolicyQueryDto } from "../../dtos/queries/retention-policy.query.dto";
import { RetentionPolicyMapper } from "../../mappers/retention-policy.mapper";
import { IRetentionPolicyReadRepo } from "../../ports/repository";
import { GetRetentionPoliciesQuery } from "./get-retention-policies.query";

export class GetRetentionPoliciesQueryHandler {
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyReadRepo,
    private readonly logger: ILogger
  ) {}

  async execute(
    query: GetRetentionPoliciesQuery
  ): Promise<IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>> {
    this.logger.debug("Bắt đầu xử lý GetRetentionPoliciesQuery", {
      payload: query.payload,
    });

    // Validate query
    const errors = validateSync(query.payload, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      this.logger.warn("Dữ liệu không hợp lệ", { errors });
      throw new Error("VALIDATION_ERROR: " + JSON.stringify(errors));
    }

    try {
      // Xây dựng query specification
      const querySpec: IQuerySpecification<RetentionPolicy> = {
        getFilters: () => {
          const filters: {
            field: keyof RetentionPolicy;
            operator: string;
            value: unknown;
          }[] = [];
          if (query.payload.filters) {
            // Cast filters to match expected type
            filters.push(
              ...(query.payload.filters as {
                field: keyof RetentionPolicy;
                operator: string;
                value: unknown;
              }[])
            );
          }
          if (query.payload.activeOnly) {
            filters.push({
              field: "isActive" as keyof RetentionPolicy,
              operator: "=",
              value: true,
            });
          }
          return filters;
        },
        getSorts: () =>
          (query.payload.sorts || [
            { field: "createdAt", direction: "desc" },
          ]) as { field: keyof RetentionPolicy; direction: "desc" | "asc" }[],
        getLimit: () => query.payload.limit,
        getOffset: () => query.payload.offset,
      };

      const pagination: IOffsetPagination = {
        offset: query.payload.offset,
        limit: query.payload.limit,
      };

      // Thực hiện truy vấn
      const result = await this.retentionPolicyRepo.findWithOffsetPagination(
        querySpec,
        pagination
      );

      // Map kết quả sang DTO
      return {
        items: result.items.map((policy: RetentionPolicy) =>
          RetentionPolicyMapper.toQueryDto(policy)
        ),
        total: result.total,
        offset: result.offset,
        limit: result.limit,
      };
    } catch (error) {
      this.logger.error("Lỗi khi truy vấn retention policies", error as Error, {
        query: query.payload,
      });
      throw error;
    }
  }
}
