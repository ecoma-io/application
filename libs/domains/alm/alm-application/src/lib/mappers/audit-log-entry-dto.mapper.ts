import { AuditLogEntry, AuditContext, AuditLogQueryCriteria, IContextDataFilter, IDateRange, Initiator, InitiatorType, AuditLogStatus } from '@ecoma/alm-domain'
import { AuditLogEntryDto, ContextDataFilterDto, DateRangeDto, FindAuditLogEntriesQueryDto, InitiatorDto, PaginatedAuditLogEntriesResponseDto, CreateAuditLogEntryCommandDto } from '../dtos';

/**
 * Mapper chuyển đổi giữa AuditLogEntry Domain và DTO.
 */
export class AuditLogEntryDtoMapper {
  /**
   * Chuyển đổi từ Domain AuditLogEntry sang DTO.
   * @param domain AuditLogEntry domain object
   * @returns AuditLogEntryDto
   */
  public toDto(domain: AuditLogEntry): AuditLogEntryDto {
    const dto = new AuditLogEntryDto();
    dto.id = domain.stringId;
    dto.eventId = domain.eventId;
    dto.timestamp = domain.timestamp;
    dto.initiator = this.toInitiatorDto(domain.initiator);
    dto.boundedContext = domain.boundedContext;
    dto.actionType = domain.actionType;
    dto.category = domain.category;
    dto.severity = domain.severity;
    dto.entityId = domain.entityId;
    dto.entityType = domain.entityType;
    dto.tenantId = domain.tenantId;
    dto.contextData = domain.contextData.value;
    dto.status = domain.status;
    dto.failureReason = domain.failureReason;
    dto.createdAt = domain.createdAt;
    return dto;
  }

  /**
   * Chuyển đổi danh sách AuditLogEntry domain sang kết quả phân trang DTO.
   * @param domains Danh sách AuditLogEntry domain objects
   * @param total Tổng số bản ghi
   * @param criteria Tiêu chí truy vấn
   * @returns PaginatedAuditLogEntriesResponseDto
   */
  public toPaginatedDto(
    domains: AuditLogEntry[],
    total: number,
    criteria: AuditLogQueryCriteria
  ): PaginatedAuditLogEntriesResponseDto {
    const pageNumber = criteria.pageNumber;
    const pageSize = criteria.pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const result = new PaginatedAuditLogEntriesResponseDto();
    result.items = domains.map(domain => this.toDto(domain));
    result.total = total;
    result.pageNumber = pageNumber;
    result.pageSize = pageSize;
    result.totalPages = totalPages;
    result.hasNextPage = pageNumber < totalPages;
    result.hasPreviousPage = pageNumber > 1;

    return result;
  }

  /**
   * Chuyển đổi từ DTO FindAuditLogEntriesQueryDto sang Domain AuditLogQueryCriteria.
   * @param dto FindAuditLogEntriesQueryDto object
   * @returns AuditLogQueryCriteria
   */
  public toDomain(dto: FindAuditLogEntriesQueryDto): AuditLogQueryCriteria {
    return AuditLogQueryCriteria.create({
      tenantId: dto.tenantId,
      initiatorType: dto.initiatorType as InitiatorType, // Cast to enum type
      initiatorId: dto.initiatorId,
      boundedContext: dto.boundedContext,
      actionType: dto.actionType,
      category: dto.category,
      severity: dto.severity,
      entityType: dto.entityType,
      entityId: dto.entityId,
      timestampRange: dto.timestampRange ? this.toDateRange(dto.timestampRange) : undefined,
      createdAtRange: dto.createdAtRange ? this.toDateRange(dto.createdAtRange) : undefined,
      status: dto.status,
      contextDataFilters: dto.contextDataFilters ? this.toContextDataFilters(dto.contextDataFilters) : undefined,
      pageNumber: dto.pageNumber,
      pageSize: dto.pageSize,
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    });
  }

  /**
   * Chuyển đổi từ CreateAuditLogEntryCommandDto sang AuditLogEntry domain object.
   * @param dto CreateAuditLogEntryCommandDto object
   * @returns AuditLogEntry domain object
   */
  public toAuditLogEntryDomain(dto: CreateAuditLogEntryCommandDto): AuditLogEntry {
    // Chuyển đổi từ DTO sang domain objects
    const initiator = this.toInitiatorDomain(dto.initiator);
    const contextData = this.toAuditContextDomain(dto.contextData);

    // Tạo một AuditLogEntry mới
    return AuditLogEntry.create(
      dto.eventId,
      dto.timestamp,
      initiator,
      dto.boundedContext,
      dto.actionType,
      contextData,
      dto.status,
      {
        category: dto.category,
        severity: dto.severity,
        entityId: dto.entityId,
        entityType: dto.entityType,
        tenantId: dto.tenantId,
        failureReason: dto.status === AuditLogStatus.Failure ? dto.failureReason : undefined,
      }
    );
  }

  /**
   * Chuyển đổi từ Domain Initiator sang DTO.
   * @param domain Initiator domain object
   * @returns InitiatorDto
   */
  private toInitiatorDto(domain: Initiator): InitiatorDto {
    const dto = new InitiatorDto();
    dto.type = domain.type;
    dto.id = domain.id;
    dto.name = domain.name;
    return dto;
  }

  /**
   * Chuyển đổi từ DTO InitiatorDto sang Domain Initiator.
   * @param dto InitiatorDto object
   * @returns Initiator domain object
   */
  public toInitiatorDomain(dto: InitiatorDto): Initiator {
    return Initiator.create(dto.type as InitiatorType, dto.name, dto.id);
  }

  /**
   * Chuyển đổi từ DTO DateRangeDto sang Domain IDateRange.
   * @param dto DateRangeDto object
   * @returns IDateRange
   */
  private toDateRange(dto: DateRangeDto): IDateRange {
    return {
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
    };
  }

  /**
   * Chuyển đổi từ DTO ContextDataFilterDto[] sang Domain IContextDataFilter[].
   * @param dtos ContextDataFilterDto objects
   * @returns IContextDataFilter[]
   */
  private toContextDataFilters(dtos: ContextDataFilterDto[]): IContextDataFilter[] {
    return dtos.map(dto => ({
      key: dto.key,
      value: dto.value,
      operator: dto.operator,
    }));
  }

  /**
   * Chuyển đổi từ DTO contextData sang Domain AuditContext.
   * @param contextData Dữ liệu ngữ cảnh
   * @returns AuditContext domain object
   */
  public toAuditContextDomain(contextData: Record<string, unknown>): AuditContext {
    return AuditContext.create(contextData);
  }
}
