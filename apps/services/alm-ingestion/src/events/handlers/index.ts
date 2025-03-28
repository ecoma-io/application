/**
 * @fileoverview Export tất cả các event handlers
 * @since 1.0.0
 */

import { AuditLogEventHandler } from "./audit-log-event.handler";

/**
 * Danh sách tất cả các event handlers
 */
export const EventHandlers = [AuditLogEventHandler];

/**
 * Export các handlers để sử dụng trực tiếp
 */
export * from "./audit-log-event.handler";
