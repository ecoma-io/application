import { InvalidIdError } from "../../errors";
import { AbstractValueObject } from "../value-object";


export abstract class AbstractId extends AbstractValueObject<{ value: string }> {

  constructor(value: string) {
    super({ value });
    if (!value) {
      throw new InvalidIdError("ID value cannot be empty");
    }
  }

  get value(): string {
    return this.props.value;
  }

  public override toString(): string {
    return this.value;
  }
}
