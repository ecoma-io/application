import { IQuery } from "@ecoma/common-application";
import { GetRetentionPoliciesQueryDto } from "../../dtos/queries/get-retention-policies.query.dto";

export class GetRetentionPoliciesQuery implements IQuery {
  readonly type = "GetRetentionPolicies";

  constructor(public readonly payload: GetRetentionPoliciesQueryDto) {}
}
