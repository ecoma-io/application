import { AbstractValueObject } from "@ecoma/common-domain";
import { Maybe } from "@ecoma/common-types";
import { InvalidAuditLogQueryCriteriaError } from "../../errors/audit-log/invalid-audit-log-query-criteria.error";
import { InitiatorType } from "../initiator/initiator.vo";

/**
 * Enum định nghĩa thứ tự sắp xếp
 */
export enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

/**
 * Enum định nghĩa trạng thái
 */
export enum AuditLogStatus {
  Success = "Success",
  Failure = "Failure",
}

/**
 * Enum định nghĩa danh mục
 */
export enum AuditLogCategory {
  Security = "Security",
  Operational = "Operational",
  Business = "Business",
  Configuration = "Configuration",
}

/**
 * Enum định nghĩa mức độ nghiêm trọng
 */
export enum AuditLogSeverity {
  Critical = "Critical",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Informational = "Informational",
}

/**
 * Interface mô tả khoảng thời gian
 */
export interface IDateRange {
  /** Thời điểm bắt đầu */
  from?: Date;
  /** Thời điểm kết thúc */
  to?: Date;
}

/**
 * Interface mô tả bộ lọc dựa trên nội dung ContextData
 */
export interface IContextDataFilter {
  /** Khóa cần tìm trong ContextData */
  key: string;
  /** Giá trị cần so sánh */
  value?: unknown;
  /** Toán tử so sánh (mặc định là equals) */
  operator?: "equals" | "contains" | "startsWith" | "exists";
}

/**
 * Props của AuditLogQueryCriteria value object
 */
export interface IAuditLogQueryCriteriaProps {
  /** ID của tổ chức */
  tenantId?: Maybe<string>;
  /** Loại tác nhân */
  initiatorType?: Maybe<InitiatorType>;
  /** ID của tác nhân */
  initiatorId?: Maybe<string>;
  /** Tên Bounded Context */
  boundedContext?: Maybe<string>;
  /** Loại hành động */
  actionType?: Maybe<string>;
  /** Danh mục */
  category?: Maybe<AuditLogCategory>;
  /** Mức độ nghiêm trọng */
  severity?: Maybe<AuditLogSeverity>;
  /** Loại thực thể */
  entityType?: Maybe<string>;
  /** ID của thực thể */
  entityId?: Maybe<string>;
  /** Khoảng thời gian hành động xảy ra */
  timestampRange?: Maybe<IDateRange>;
  /** Khoảng thời gian bản ghi được tạo */
  createdAtRange?: Maybe<IDateRange>;
  /** Trạng thái */
  status?: Maybe<AuditLogStatus>;
  /** Danh sách bộ lọc dựa trên ContextData */
  contextDataFilters?: Maybe<IContextDataFilter[]>;
  /** Số trang */
  pageNumber: number;
  /** Số lượng bản ghi trên mỗi trang */
  pageSize: number;
  /** Trường cần sắp xếp */
  sortBy?: Maybe<string>;
  /** Thứ tự sắp xếp */
  sortOrder?: Maybe<SortOrder>;
}

/**
 * Value Object đại diện cho các tiêu chí dùng để truy vấn audit logs.
 * Được sử dụng để lọc và phân trang kết quả truy vấn.
 */
export class AuditLogQueryCriteria extends AbstractValueObject<IAuditLogQueryCriteriaProps> {
  /** Số trang mặc định */
  private static readonly DEFAULT_PAGE_NUMBER = 1;
  /** Số lượng bản ghi trên mỗi trang mặc định */
  private static readonly DEFAULT_PAGE_SIZE = 20;
  /** Số lượng bản ghi tối đa trên mỗi trang */
  private static readonly MAX_PAGE_SIZE = 100;

  /**
   * Tạo mới một AuditLogQueryCriteria
   * @param props - Các thuộc tính của AuditLogQueryCriteria
   */
  private constructor(props: IAuditLogQueryCriteriaProps) {
    super(props);
  }

  /**
   * Factory method để tạo một AuditLogQueryCriteria
   *
   * @param props - Các thuộc tính của tiêu chí truy vấn
   * @returns Instance mới của AuditLogQueryCriteria
   * @throws {InvalidAuditLogQueryCriteriaError} nếu dữ liệu không hợp lệ
   */
  public static create(
    props: Partial<IAuditLogQueryCriteriaProps> = {}
  ): AuditLogQueryCriteria {
    // Validate và áp dụng giá trị mặc định cho số trang và kích thước trang
    const pageNumber =
      props.pageNumber ?? AuditLogQueryCriteria.DEFAULT_PAGE_NUMBER;
    const pageSize = props.pageSize ?? AuditLogQueryCriteria.DEFAULT_PAGE_SIZE;

    if (pageNumber < 1) {
      throw new InvalidAuditLogQueryCriteriaError(
        "Page number must be greater than or equal to 1"
      );
    }

    if (pageSize < 1) {
      throw new InvalidAuditLogQueryCriteriaError(
        "Page size must be greater than or equal to 1"
      );
    }

    if (pageSize > AuditLogQueryCriteria.MAX_PAGE_SIZE) {
      throw new InvalidAuditLogQueryCriteriaError(
        `Page size must be less than or equal to ${AuditLogQueryCriteria.MAX_PAGE_SIZE}`
      );
    }

    // Validate DateRange nếu có
    if (props.timestampRange) {
      validateDateRange(props.timestampRange, "timestamp");
    }

    if (props.createdAtRange) {
      validateDateRange(props.createdAtRange, "createdAt");
    }

    // Validate contextDataFilters nếu có
    if (props.contextDataFilters && props.contextDataFilters.length > 0) {
      props.contextDataFilters.forEach((filter, index) => {
        if (!filter.key || filter.key.trim() === "") {
          throw new InvalidAuditLogQueryCriteriaError(
            `Context data filter at index ${index} must have a non-empty key`
          );
        }
      });
    }

    return new AuditLogQueryCriteria({
      tenantId: props.tenantId,
      initiatorType: props.initiatorType,
      initiatorId: props.initiatorId,
      boundedContext: props.boundedContext,
      actionType: props.actionType,
      category: props.category,
      severity: props.severity,
      entityType: props.entityType,
      entityId: props.entityId,
      timestampRange: props.timestampRange,
      createdAtRange: props.createdAtRange,
      status: props.status,
      contextDataFilters: props.contextDataFilters,
      pageNumber,
      pageSize,
      sortBy: props.sortBy,
      sortOrder: props.sortOrder ?? SortOrder.Descending,
    });
  }

  /**
   * Lấy ID của tổ chức
   */
  get tenantId(): Maybe<string> {
    return this.props.tenantId;
  }

  /**
   * Lấy loại tác nhân
   */
  get initiatorType(): Maybe<InitiatorType> {
    return this.props.initiatorType;
  }

  /**
   * Lấy ID của tác nhân
   */
  get initiatorId(): Maybe<string> {
    return this.props.initiatorId;
  }

  /**
   * Lấy tên Bounded Context
   */
  get boundedContext(): Maybe<string> {
    return this.props.boundedContext;
  }

  /**
   * Lấy loại hành động
   */
  get actionType(): Maybe<string> {
    return this.props.actionType;
  }

  /**
   * Lấy danh mục
   */
  get category(): Maybe<AuditLogCategory> {
    return this.props.category;
  }

  /**
   * Lấy mức độ nghiêm trọng
   */
  get severity(): Maybe<AuditLogSeverity> {
    return this.props.severity;
  }

  /**
   * Lấy loại thực thể
   */
  get entityType(): Maybe<string> {
    return this.props.entityType;
  }

  /**
   * Lấy ID của thực thể
   */
  get entityId(): Maybe<string> {
    return this.props.entityId;
  }

  /**
   * Lấy khoảng thời gian hành động xảy ra
   */
  get timestampRange(): Maybe<IDateRange> {
    return this.props.timestampRange;
  }

  /**
   * Lấy khoảng thời gian bản ghi được tạo
   */
  get createdAtRange(): Maybe<IDateRange> {
    return this.props.createdAtRange;
  }

  /**
   * Lấy trạng thái
   */
  get status(): Maybe<AuditLogStatus> {
    return this.props.status;
  }

  /**
   * Lấy danh sách bộ lọc dựa trên ContextData
   */
  get contextDataFilters(): Maybe<IContextDataFilter[]> {
    return this.props.contextDataFilters;
  }

  /**
   * Lấy số trang
   */
  get pageNumber(): number {
    return this.props.pageNumber;
  }

  /**
   * Lấy số lượng bản ghi trên mỗi trang
   */
  get pageSize(): number {
    return this.props.pageSize;
  }

  /**
   * Lấy trường cần sắp xếp
   */
  get sortBy(): Maybe<string> {
    return this.props.sortBy;
  }

  /**
   * Lấy thứ tự sắp xếp
   */
  get sortOrder(): SortOrder {
    return this.props.sortOrder ?? SortOrder.Descending;
  }

  /**
   * Tính offset dựa trên số trang và kích thước trang
   *
   * @returns Offset cho truy vấn phân trang
   */
  public calculateOffset(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }

  /**
   * Tạo một AuditLogQueryCriteria mới với số trang đã được cập nhật
   *
   * @param pageNumber - Số trang mới
   * @returns Instance mới của AuditLogQueryCriteria
   */
  public withPageNumber(pageNumber: number): AuditLogQueryCriteria {
    return AuditLogQueryCriteria.create({
      ...this.props,
      pageNumber,
    });
  }

  /**
   * Tạo một AuditLogQueryCriteria mới với kích thước trang đã được cập nhật
   *
   * @param pageSize - Kích thước trang mới
   * @returns Instance mới của AuditLogQueryCriteria
   */
  public withPageSize(pageSize: number): AuditLogQueryCriteria {
    return AuditLogQueryCriteria.create({
      ...this.props,
      pageSize,
    });
  }

  /**
   * Tạo một AuditLogQueryCriteria mới với thông tin sắp xếp đã được cập nhật
   *
   * @param sortBy - Trường cần sắp xếp
   * @param sortOrder - Thứ tự sắp xếp
   * @returns Instance mới của AuditLogQueryCriteria
   */
  public withSort(
    sortBy: string,
    sortOrder?: SortOrder
  ): AuditLogQueryCriteria {
    return AuditLogQueryCriteria.create({
      ...this.props,
      sortBy,
      sortOrder,
    });
  }
}

/**
 * Hàm helper để validate DateRange
 * @param range - Khoảng thời gian cần validate
 * @param fieldName - Tên trường đang validate
 * @throws {InvalidAuditLogQueryCriteriaError} nếu dữ liệu không hợp lệ
 */
function validateDateRange(range: IDateRange, fieldName: string): void {
  if (range.from && range.to && range.from > range.to) {
    throw new InvalidAuditLogQueryCriteriaError(
      `${fieldName} range 'from' date must be before or equal to 'to' date`
    );
  }
}
