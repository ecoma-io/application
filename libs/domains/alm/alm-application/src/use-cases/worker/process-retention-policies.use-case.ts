import {
  AbstractLogger,
  CriteriaQueryFilterDTO,
  PaginationType,
  SortDirection,
} from "@ecoma/common-application";
import { Injectable } from "@nestjs/common";
import {
  IAuditLogReadRepository,
  IQueueService,
  IRetentionPolicyReadRepository,
} from "../../ports";

@Injectable()
export class ProcessRetentionPoliciesUseCase {
  constructor(
    private readonly retentionPolicyRepo: IRetentionPolicyReadRepository,
    private readonly auditLogRepo: IAuditLogReadRepository,
    private readonly queueService: IQueueService,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(ProcessRetentionPoliciesUseCase.name);
  }

  async execute(batchSize = 1000): Promise<{
    processedPolicies: number;
    totalEntriesQueued: number;
  }> {
    let processedPolicies = 0;
    let totalEntriesQueued = 0;

    // Lấy tất cả active policies
    const { items: policies } = await this.getActivePolicies();

    for (const policy of policies) {
      try {
        let lastProcessedId: string | undefined;
        let hasMoreEntries = true;

        // Xử lý theo batch để tránh quá tải memory
        while (hasMoreEntries) {
          const filterConditions: CriteriaQueryFilterDTO[] = [
            {
              field: "timestamp",
              operator: "<=",
              value: new Date(
                Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000
              ),
            },
          ];

          // Thêm điều kiện boundedContext nếu có
          if (policy.boundedContext) {
            filterConditions.push({
              field: "boundedContext",
              operator: "=",
              value: policy.boundedContext,
            });
          }

          // Thêm điều kiện actionType nếu có
          if (policy.actionType) {
            filterConditions.push({
              field: "actionType",
              operator: "=",
              value: policy.actionType,
            });
          }

          // Thêm điều kiện entityType nếu có
          if (policy.entityType) {
            filterConditions.push({
              field: "entityType",
              operator: "=",
              value: policy.entityType,
            });
          }

          // Thêm điều kiện tenantId nếu có
          if (policy.tenantId) {
            filterConditions.push({
              field: "tenantId",
              operator: "=",
              value: policy.tenantId,
            });
          }

          const result = await this.auditLogRepo.find({
            filters: {
              and: filterConditions,
            },
            pagination: {
              paginationType: PaginationType.CURSOR,
              limit: batchSize,
              after: lastProcessedId,
            },
            sorts: [
              {
                field: "id",
                direction: SortDirection.ASC,
              },
            ],
          });

          if (result.items.length > 0) {
            // Đẩy IDs lên queue để xóa
            const auditLogIds = result.items.map(
              (item: { id: { toString: () => string } }) => item.id.toString()
            );

            // Sử dụng queue service để đẩy IDs lên queue
            await this.queueService.queueAuditLogsForDeletion(auditLogIds);

            totalEntriesQueued += auditLogIds.length;
            lastProcessedId =
              result.items[result.items.length - 1].id.toString();

            this.logger.info(
              `Queued ${auditLogIds.length} entries for deletion based on policy ${policy.id}`
            );
          }

          // Kiểm tra nếu đã hết entries cần xử lý
          hasMoreEntries = result.items.length === batchSize;
        }

        processedPolicies++;
      } catch (error) {
        this.logger.error(
          `Error processing policy ${policy.id}`,
          error as Error
        );
      }
    }

    return { processedPolicies, totalEntriesQueued };
  }

  private async getActivePolicies() {
    return this.retentionPolicyRepo.find({
      filters: {
        and: [
          {
            field: "isActive",
            operator: "=",
            value: true,
          },
        ],
      },
    });
  }
}
