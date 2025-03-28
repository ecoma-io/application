import { InvalidEmailError } from "../errors";
import { AbstractValueObject } from "./value-object";

/**
 * Value Object đại diện cho một địa chỉ Email.
 * Đảm bảo định dạng email hợp lệ.
 */
export class Email extends AbstractValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (!emailRegex.test(value)) {
      throw new InvalidEmailError(value);
    }
  }

  get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.value;
  }
}
