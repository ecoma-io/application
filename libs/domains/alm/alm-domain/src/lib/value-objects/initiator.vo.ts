import { AbstractValueObject } from "@ecoma/common-domain";

import { InitiatorType } from "../constants/initiator-type.enum";

/**
 * Interface thuộc tính của Initiator
 */
export interface IInitiatorProps {
  type: InitiatorType;
  id?: string;
  name?: string;
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
      throw new Error("Initiator type is required for audit log entry");
    }

    // Nếu type là User hoặc Service thì phải có id
    if (props.type === InitiatorType.User && !props.id) {
      throw new Error("Initiator ID is required when type is User");
    }
  }

  /**
   * Lấy loại initiator
   * @returns Loại của Initiator
   */
  get type(): InitiatorType {
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
