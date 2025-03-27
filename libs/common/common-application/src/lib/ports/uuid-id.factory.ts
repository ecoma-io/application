import { UuidId } from "@ecoma/common-domain";

/**
 * Giao diện cho Nhà máy UuidId
 * @interface
 */
export interface IUuidIdFactory {
  /**
   * Phương thức để tạo một UuidId mới
   * @returns {UuidId} - UuidId mới được tạo
   */
  create(): UuidId;
}
