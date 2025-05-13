import { AbstractValueObject } from "@ecoma/common-domain";
import { InvalidRetentionPolicyError } from "../../errors/audit-log/invalid-retention-policy.error";
import { RetentionRule } from "../retention-rule/retention-rule.vo";

/**
 * Props của RetentionPolicy value object
 */
export interface IRetentionPolicyProps {
  /** Tên chính sách */
  name: string;
  /** Mô tả chính sách */
  description: string;
  /** Danh sách các quy tắc retention */
  rules: RetentionRule[];
  /** Trạng thái hoạt động của chính sách */
  isActive: boolean;
}

/**
 * Value Object đại diện cho chính sách lưu trữ dữ liệu.
 * Mỗi RetentionPolicy gồm một tập hợp các RetentionRule xác định thời gian
 * lưu trữ cho các loại bản ghi kiểm tra khác nhau.
 */
export class RetentionPolicy extends AbstractValueObject<IRetentionPolicyProps> {
  /**
   * Tạo mới một RetentionPolicy
   * @param props - Các thuộc tính của RetentionPolicy
   */
  private constructor(props: IRetentionPolicyProps) {
    super(props);
  }

  /**
   * Factory method để tạo một RetentionPolicy
   *
   * @param name - Tên chính sách
   * @param description - Mô tả chính sách
   * @param rules - Danh sách các quy tắc retention
   * @param isActive - Trạng thái hoạt động của chính sách (mặc định: true)
   * @returns Instance mới của RetentionPolicy
   * @throws {InvalidRetentionPolicyError} nếu dữ liệu không hợp lệ
   */
  public static create(
    name: string,
    description: string,
    rules: RetentionRule[],
    isActive = true
  ): RetentionPolicy {
    // Validate tên
    if (!name || name.trim() === "") {
      throw new InvalidRetentionPolicyError("Policy name is required");
    }

    // Validate mô tả
    if (!description || description.trim() === "") {
      throw new InvalidRetentionPolicyError("Policy description is required");
    }

    // Validate danh sách quy tắc
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      throw new InvalidRetentionPolicyError(
        "Policy must have at least one rule"
      );
    }

    if (!rules.every((rule) => rule instanceof RetentionRule)) {
      throw new InvalidRetentionPolicyError(
        "All rules must be instances of RetentionRule"
      );
    }

    return new RetentionPolicy({
      name: name.trim(),
      description: description.trim(),
      rules,
      isActive,
    });
  }

  /**
   * Lấy tên chính sách
   */
  get name(): string {
    return this.props.name;
  }

  /**
   * Lấy mô tả chính sách
   */
  get description(): string {
    return this.props.description;
  }

  /**
   * Lấy danh sách các quy tắc retention
   */
  get rules(): RetentionRule[] {
    return [...this.props.rules]; // Trả về bản sao để tránh thay đổi từ bên ngoài
  }

  /**
   * Kiểm tra trạng thái hoạt động của chính sách
   */
  get isActive(): boolean {
    return this.props.isActive;
  }

  /**
   * Tìm quy tắc có thời hạn ngắn nhất áp dụng cho một bản ghi kiểm tra cụ thể
   *
   * @param boundedContext - Tên Bounded Context của bản ghi
   * @param actionType - Loại hành động của bản ghi
   * @param entityType - Loại thực thể của bản ghi
   * @param tenantId - ID tổ chức của bản ghi
   * @returns Quy tắc có thời hạn ngắn nhất, hoặc undefined nếu không tìm thấy quy tắc nào phù hợp
   */
  public findShortestMatchingRule(
    boundedContext: string,
    actionType?: string,
    entityType?: string,
    tenantId?: string
  ): RetentionRule | undefined {
    // Lọc các quy tắc áp dụng
    const matchingRules = this.props.rules.filter((rule) =>
      rule.appliesTo(boundedContext, actionType, entityType, tenantId)
    );

    if (matchingRules.length === 0) {
      return undefined;
    }

    // Tìm quy tắc có thời hạn ngắn nhất
    return matchingRules.reduce((shortest, current) => {
      return current.retentionDuration < shortest.retentionDuration
        ? current
        : shortest;
    }, matchingRules[0]);
  }

  /**
   * Tạo một RetentionPolicy mới với trạng thái hoạt động đã được cập nhật
   *
   * @param isActive - Trạng thái hoạt động mới
   * @returns Instance mới của RetentionPolicy
   */
  public withActiveStatus(isActive: boolean): RetentionPolicy {
    return RetentionPolicy.create(
      this.props.name,
      this.props.description,
      this.props.rules,
      isActive
    );
  }

  /**
   * Tạo một RetentionPolicy mới với một quy tắc mới được thêm vào
   *
   * @param rule - Quy tắc retention mới
   * @returns Instance mới của RetentionPolicy
   */
  public withAddedRule(rule: RetentionRule): RetentionPolicy {
    if (!(rule instanceof RetentionRule)) {
      throw new InvalidRetentionPolicyError(
        "Rule must be an instance of RetentionRule"
      );
    }

    return RetentionPolicy.create(
      this.props.name,
      this.props.description,
      [...this.props.rules, rule],
      this.props.isActive
    );
  }
}
