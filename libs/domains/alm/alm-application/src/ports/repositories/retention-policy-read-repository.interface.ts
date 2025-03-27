import {
  IRetentionPolicyProps,
  RetentionPolicy,
  RetentionPolicyId,
} from "@ecoma/alm-domain";
import { IReadRepository } from "@ecoma/common-application";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-empty-interface
export interface IRetentionPolicyReadRepository
  extends IReadRepository<
    RetentionPolicyId,
    IRetentionPolicyProps,
    RetentionPolicy
  > {}
