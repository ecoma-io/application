import { IQuery } from '@ecoma/common-application';

/**
 * Query kiểm tra quyền sử dụng tính năng
 */
export class CheckFeatureEntitlementQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly featureType: string
  ) {}
}
