import { IRetentionPolicyIdFactory } from "@ecoma/alm-application";
import { Injectable } from "@nestjs/common";

import { UuidIdFactory } from "./uuid-id.factory";

/**
 * Factory để tạo ID cho RetentionPolicy
 */
@Injectable()
export class RetentionPolicyIdFactory
  extends UuidIdFactory
  implements IRetentionPolicyIdFactory {}
