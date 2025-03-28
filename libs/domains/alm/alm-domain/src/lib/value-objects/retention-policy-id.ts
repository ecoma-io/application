import { UuidId } from '@ecoma/common-domain';

export class RetentionPolicyId extends UuidId {
  public static create(): RetentionPolicyId {
    return new RetentionPolicyId(UuidId.generate().toString());
  }

  public static from(id: string): RetentionPolicyId {
    return new RetentionPolicyId(id);
  }
}
