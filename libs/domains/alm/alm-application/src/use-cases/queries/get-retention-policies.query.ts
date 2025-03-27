import { GetRetentionPoliciesQueryDto } from '../../dtos/queries/get-retention-policies.query.dto';

export class GetRetentionPoliciesQuery {
  constructor(public readonly payload: GetRetentionPoliciesQueryDto) {}
}
