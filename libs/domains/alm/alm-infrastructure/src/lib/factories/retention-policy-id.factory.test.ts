import { UuidId } from "@ecoma/common-domain";

import { RetentionPolicyIdFactory } from "./retention-policy-id.factory";

describe("RetentionPolicyIdFactory", () => {
  let factory: RetentionPolicyIdFactory;

  beforeEach(() => {
    factory = new RetentionPolicyIdFactory();
  });

  it("Nên tạo được một UuidId mới", () => {
    const id = factory.create();
    expect(id).toBeInstanceOf(UuidId);
    expect(id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("Nên tạo được các ID khác nhau cho mỗi lần gọi", () => {
    const id1 = factory.create();
    const id2 = factory.create();
    expect(id1.value).not.toBe(id2.value);
  });
});
