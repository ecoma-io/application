/**
 * Interface cơ bản cho tất cả các Entity trong bounded context DAM.
 * Mỗi Entity phải có một ID duy nhất.
 */
export interface Entity {
  /**
   * ID duy nhất của Entity.
   */
  readonly id: string;
}
