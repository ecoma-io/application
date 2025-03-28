/**
 * @fileoverview Định nghĩa các token injection cho ALM infrastructure
 * @since 1.0.0
 */

/**
 * Các token injection cho ALM infrastructure
 * Được sử dụng để đăng ký và inject các dependency trong module
 */
export const ALM_TOKENS = {
  /** Token cho IAuditLogReadRepository */
  auditLogReadRepository: Symbol('IAuditLogReadRepository'),
  /** Token cho IAuditLogWriteRepository */
  auditLogWriteRepository: Symbol('IAuditLogWriteRepository'),
  /** Token cho IDomainEventPublisher */
  domainEventPublisher: Symbol('IDomainEventPublisher')
} as const;
