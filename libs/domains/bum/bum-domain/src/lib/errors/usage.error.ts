import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi không tìm thấy bản ghi usage với ID được chỉ định.
 * @extends {DomainError}
 */
export class UsageRecordNotFoundError extends DomainError {
  constructor(recordId: string) {
    super("Usage record {recordId} not found", { recordId });
  }
}

/**
 * Đại diện cho lỗi khi không tìm thấy metric usage với ID được chỉ định.
 * @extends {DomainError}
 */
export class UsageMetricNotFoundError extends DomainError {
  constructor(metricId: string) {
    super("Usage metric {metricId} not found", { metricId });
  }
}

/**
 * Đại diện cho lỗi khi metric usage không hợp lệ vì lý do cụ thể.
 * @extends {DomainError}
 */
export class InvalidUsageMetricError extends DomainError {
  constructor(metricId: string, reason: string) {
    super("Invalid usage metric {metricId}. Reason: {reason}", {
      metricId,
      reason,
    });
  }
}

/**
 * Đại diện cho lỗi khi giá trị usage không hợp lệ vì lý do cụ thể.
 * @extends {DomainError}
 */
export class InvalidUsageValueError extends DomainError {
  constructor(value: number, reason: string) {
    super("Invalid usage value {value}. Reason: {reason}", { value, reason });
  }
}

/**
 * Đại diện cho lỗi khi thời gian usage không hợp lệ vì lý do cụ thể.
 * @extends {DomainError}
 */
export class InvalidUsageTimeError extends DomainError {
  constructor(time: string, reason: string) {
    super("Invalid usage time {time}. Reason: {reason}", { time, reason });
  }
}

/**
 * Đại diện cho lỗi khi không thể cập nhật bản ghi usage vì lý do cụ thể.
 * @extends {DomainError}
 */
export class CannotUpdateUsageRecordError extends DomainError {
  constructor(recordId: string, reason: string) {
    super("Cannot update usage record {recordId}. Reason: {reason}", {
      recordId,
      reason,
    });
  }
}

/**
 * Đại diện cho lỗi khi không thể xóa bản ghi usage vì lý do cụ thể.
 * @extends {DomainError}
 */
export class CannotDeleteUsageRecordError extends DomainError {
  constructor(recordId: string, reason: string) {
    super("Cannot delete usage record {recordId}. Reason: {reason}", {
      recordId,
      reason,
    });
  }
}
