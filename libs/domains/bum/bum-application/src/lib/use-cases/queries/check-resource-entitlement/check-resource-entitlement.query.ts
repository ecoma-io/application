import { IQuery } from '@ecoma/common-application';

/**
 * Query để kiểm tra khả năng sử dụng tài nguyên
 */
export class CheckResourceEntitlementQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly resourceType: string,
    public readonly currentUsage: number,
    public readonly additionalUsage: number
  ) {}
}
