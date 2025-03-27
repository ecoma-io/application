import { IAuditLogIdFactory } from "@ecoma/alm-application";
import { Injectable } from "@nestjs/common";

import { UuidIdFactory } from "./uuid-id.factory";

/**
 * Factory để tạo ID cho AuditLog
 */
@Injectable()
export class AuditLogIdFactory
  extends UuidIdFactory
  implements IAuditLogIdFactory {}
