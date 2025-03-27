import { IUuidIdFactory, UuidId } from "@ecoma/common-domain";
import { Injectable } from "@nestjs/common";
import { v7 as uuidv7 } from "uuid";

/**
 * Factory tạo UUID cho các thực thể trong ALM
 */
@Injectable()
export class UuidIdFactory implements IUuidIdFactory {
  create(): UuidId {
    return new UuidId(uuidv7());
  }
}
