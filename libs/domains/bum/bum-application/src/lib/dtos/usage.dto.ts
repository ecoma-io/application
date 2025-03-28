/**
 * DTO sử dụng để ghi nhận việc sử dụng tài nguyên
 */
export interface ITrackUsageDto {
  organizationId: string;
  resourceType: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

/**
 * DTO đại diện cho thông tin sử dụng tài nguyên
 */
export interface IUsageRecordDto {
  timestamp: string;
  organizationId: string;
  resourceType: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

/**
 * DTO sử dụng để lấy thông tin sử dụng tài nguyên
 */
export interface IGetUsageDto {
  organizationId: string;
  resourceType: string;
  periodStart?: string;
  periodEnd?: string;
}

/**
 * DTO đại diện cho bản tóm tắt sử dụng tài nguyên
 */
export interface IUsageSummaryDto {
  organizationId: string;
  resourceType: string;
  totalUsage: number;
  periodStart: string;
  periodEnd: string;
  limit: number | null;
  percentageUsed: number | null;
}
