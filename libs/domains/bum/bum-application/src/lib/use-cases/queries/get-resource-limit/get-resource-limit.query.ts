import { IQuery } from '@ecoma/common-application';

/**
 * Query để lấy giới hạn tài nguyên
 */
export class GetResourceLimitQuery implements IQuery {
  constructor(
    public readonly organizationId: string,
    public readonly resourceType: string
  ) {}
}
