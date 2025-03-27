import { RetentionPolicy } from "@ecoma/alm-domain";
import { IGenericResult, IQueryHandler } from "@ecoma/common-application";
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

type GetRetentionPoliciesResult = IGenericResult<
  IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>,
  string
>;

export class GetRetentionPoliciesQueryHandler
  implements
    IQueryHandler<GetRetentionPoliciesQuery, GetRetentionPoliciesResult>
{
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyReadRepo,
    private readonly logger: ILogger
  ) {}

  async handle(
    query: GetRetentionPoliciesQuery
  ): Promise<GetRetentionPoliciesResult> {
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
      return {
        success: false,
        error: "VALIDATION_ERROR",
        details: JSON.stringify(errors),
        data: {
          items: [],
          total: 0,
          offset: query.payload.offset,
          limit: query.payload.limit,
        },
      };
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
        success: true,
        error: "",
        details: "",
        data: {
          items: result.items.map((policy: RetentionPolicy) =>
            RetentionPolicyMapper.toQueryDto(policy)
          ),
          total: result.total,
          offset: result.offset,
          limit: result.limit,
        },
      };
    } catch (error) {
      this.logger.error("Lỗi khi truy vấn retention policies", error as Error, {
        query: query.payload,
      });
      return {
        success: false,
        error: "QUERY_FAILED",
        details: (error as Error).message,
        data: {
          items: [],
          total: 0,
          offset: query.payload.offset,
          limit: query.payload.limit,
        },
      };
    }
  }
}
