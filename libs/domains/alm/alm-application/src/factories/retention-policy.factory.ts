import {
  IRetentionPolicyProps,
  RetentionPolicy,
  RetentionPolicyId,
} from "@ecoma/alm-domain";
import {
  AbstractAggregateFactory,
  IUuidIdFactory,
} from "@ecoma/common-application";

export class RetentionPolicyFactory extends AbstractAggregateFactory<
  RetentionPolicyId,
  IRetentionPolicyProps,
  RetentionPolicy
> {
  constructor(private readonly uuidIdFactory: IUuidIdFactory) {
    super();
  }

  create(props: Omit<IRetentionPolicyProps, "id">): RetentionPolicy {
    const retentionPolicy = new RetentionPolicy({
      ...props,
      id: this.uuidIdFactory.create(),
    });
    return retentionPolicy;
  }
}
