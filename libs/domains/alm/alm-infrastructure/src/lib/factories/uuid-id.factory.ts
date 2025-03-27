import { IUuidIdFactory } from "@ecoma/common-application";
import { UuidId } from "@ecoma/common-domain";
import { v7 as uuidv7 } from "uuid";

export class UuidIdFactory implements IUuidIdFactory {
  create(): UuidId {
    return new UuidId(uuidv7());
  }
}
