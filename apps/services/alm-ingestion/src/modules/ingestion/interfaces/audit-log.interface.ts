import { Document } from "mongoose";

/**
 * Interface mô tả thông tin người/hệ thống thực hiện hành động
 */
export interface IInitiator {
  /** Loại người dùng (user/system/service) */
  type: string;
  /** ID của người dùng (nếu có) */
  id?: string;
  /** Tên hiển thị của người dùng */
  name: string;
}

/**
 * Interface mô tả một sự kiện audit log được gửi đến service
 */
export interface IAuditLogEvent {
  /** ID duy nhất của sự kiện */
  eventId?: string;
  /** Thời điểm xảy ra sự kiện */
  timestamp: string | Date;
  /** Thông tin người/hệ thống thực hiện */
  initiator: IInitiator;
  /** Loại hành động được thực hiện */
  actionType: string;
  /** Danh mục của hành động */
  category?: string;
  /** Mức độ nghiêm trọng */
  severity?: string;
  /** ID của đối tượng bị tác động */
  entityId?: string;
  /** Loại đối tượng bị tác động */
  entityType?: string;
  /** Bounded context của hành động */
  boundedContext?: string;
  /** ID của tenant */
  tenantId?: string;
  /** Dữ liệu bổ sung của sự kiện */
  contextData?: Record<string, unknown>;
  /** Trạng thái của hành động */
  status: "Success" | "Failure";
  /** Lý do thất bại (nếu có) */
  failureReason?: string;
}

/**
 * Interface mô tả một bản ghi audit log trong database
 * Kế thừa từ Mongoose Document để có thêm các phương thức của Mongoose
 */
export interface IAuditLog extends Document {
  /** ID duy nhất của bản ghi */
  id: string;
  /** ID của sự kiện gốc */
  eventId?: string;
  /** Thời điểm xảy ra sự kiện */
  timestamp: Date;
  /** Thông tin người/hệ thống thực hiện */
  initiator: IInitiator;
  /** Loại hành động được thực hiện */
  actionType: string;
  /** Danh mục của hành động */
  category?: string;
  /** Mức độ nghiêm trọng */
  severity?: string;
  /** ID của đối tượng bị tác động */
  entityId?: string;
  /** Loại đối tượng bị tác động */
  entityType?: string;
  /** Bounded context của hành động */
  boundedContext?: string;
  /** ID của tenant */
  tenantId?: string;
  /** Dữ liệu bổ sung của sự kiện */
  contextData?: Record<string, unknown>;
  /** Trạng thái của hành động */
  status: "Success" | "Failure";
  /** Lý do thất bại (nếu có) */
  failureReason?: string;
  /** Thời điểm tạo bản ghi */
  createdAt: Date;
  /** Thời điểm cập nhật bản ghi */
  updatedAt: Date;
}
