import {
  AbstractValueObject,
  DomainValidationError,
} from "@ecoma/common-domain";

/**
 * Interface thuộc tính của Initiator
 */
export interface IInitiatorProps {
  type: "User" | "System" | "Integration";
  name: string;
  id?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Value Object đại diện cho người/hệ thống thực hiện hành động được ghi log
 */
export class Initiator extends AbstractValueObject<IInitiatorProps> {
  /**
   * Khởi tạo đối tượng Initiator
   * @param props Thuộc tính của initiator
   */
  constructor(props: IInitiatorProps) {
    super(props);

    // Validate type
    if (!props.type) {
      throw new DomainValidationError(
        "Initiator type is required for audit log entry"
      );
    }

    // Validate name
    if (!props.name) {
      throw new DomainValidationError(
        "Initiator name is required for audit log entry"
      );
    }

    // Nếu type là User hoặc Service thì phải có id
    if (props.type === "User" && !props.id) {
      throw new DomainValidationError(
        "Initiator ID is required when type is User"
      );
    }
  }

  /**
   * Lấy loại initiator
   * @returns Loại của Initiator
   */
  get type(): "User" | "System" | "Integration" {
    return this.props.type;
  }

  /**
   * Lấy ID của initiator (nếu có)
   * @returns ID của Initiator (nếu có)
   */
  get id(): string | undefined {
    return this.props.id;
  }

  /**
   * Lấy tên của initiator (nếu có)
   * @returns Tên của Initiator (nếu có)
   */
  get name(): string | undefined {
    return this.props.name;
  }

  /**
   * Lấy địa chỉ IP của initiator (nếu có)
   * @returns Địa chỉ IP của Initiator (nếu có)
   */
  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  /**
   * Lấy user agent của initiator (nếu có)
   * @returns User agent của Initiator (nếu có)
   */
  get userAgent(): string | undefined {
    return this.props.userAgent;
  }
}
