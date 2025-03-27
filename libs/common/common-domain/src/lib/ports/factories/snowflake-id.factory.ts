/**
 * Giao diện cho Nhà máy Snowflake ID
 * @interface
 */
import { SnowflakeId } from "../../value-object";

export interface ISnowflakeIdFactory {
  /**
   * Phương thức để tạo một Snowflake ID mới
   * @returns {SnowflakeId} - Snowflake ID mới được tạo
   */
  create(): SnowflakeId;
}
