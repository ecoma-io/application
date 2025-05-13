import { AbstractValueObject } from "@ecoma/common-domain";
import { Maybe } from "@ecoma/common-types";
import { InvalidInitiatorError } from "../../errors/audit-log/invalid-initiator.error";

/**
 * Loại của nguồn tạo ra hành động trong bản ghi kiểm tra
 */
export enum InitiatorType {
  User = "User",
  System = "System",
  API = "API",
  ScheduledTask = "ScheduledTask",
  Integration = "Integration",
}

/**
 * Props của Initiator value object
 */
export interface IInitiatorProps {
  /** Loại nguồn tác nhân */
  type: InitiatorType;
  /** ID của tác nhân (tùy chọn với System) */
  id?: Maybe<string>;
  /** Tên hiển thị của tác nhân */
  name: string;
}

/**
 * Value Object đại diện cho thông tin về người hoặc hệ thống đã thực hiện hành động
 * được ghi nhận trong bản ghi kiểm tra (audit log)
 */
export class Initiator extends AbstractValueObject<IInitiatorProps> {
  /**
   * Tạo mới một Initiator
   * @param props - Các thuộc tính của Initiator
   */
  private constructor(props: IInitiatorProps) {
    super(props);
  }

  /**
   * Factory method để tạo một Initiator
   *
   * @param type - Loại tác nhân (User, System, API, ScheduledTask, Integration)
   * @param name - Tên hiển thị của tác nhân
   * @param id - ID định danh của tác nhân (có thể null với type là System)
   * @returns Instance mới của Initiator
   * @throws {InvalidInitiatorError} nếu dữ liệu không hợp lệ
   */
  public static create(
    type: InitiatorType,
    name: string,
    id?: Maybe<string>
  ): Initiator {
    // Validate đầu vào
    if (!type) {
      throw new InvalidInitiatorError("Initiator type is required");
    }

    if (!Object.values(InitiatorType).includes(type)) {
      throw new InvalidInitiatorError(`Invalid initiator type: ${type}`);
    }

    if (!name || name.trim() === "") {
      throw new InvalidInitiatorError(
        "Initiator name is required and cannot be empty"
      );
    }

    // Với types khác System, id là bắt buộc
    if (type !== InitiatorType.System && (!id || id.trim() === "")) {
      throw new InvalidInitiatorError(
        `ID is required for initiator type ${type}`
      );
    }

    return new Initiator({
      type,
      name,
      id: id ? id.trim() : undefined,
    });
  }

  /**
   * Lấy loại tác nhân
   */
  get type(): InitiatorType {
    return this.props.type;
  }

  /**
   * Lấy ID của tác nhân
   */
  get id(): Maybe<string> {
    return this.props.id;
  }

  /**
   * Lấy tên của tác nhân
   */
  get name(): string {
    return this.props.name;
  }
}
