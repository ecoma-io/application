import { InvalidValueObjectError } from "@ecoma/common-domain";

import { AuditContext } from "./audit-context.vo";

describe("AuditContext VO", () => {
  it("khởi tạo hợp lệ", () => {
    const vo = new AuditContext({ ip: "1.2.3.4", session: "abc" });
    expect(vo.get("ip")).toBe("1.2.3.4");
    expect(vo.get("session")).toBe("abc");
  });

  it("so sánh equals đúng", () => {
    const a = new AuditContext({ value: { x: 1 } });
    const b = new AuditContext({ value: { x: 1 } });
    const c = new AuditContext({ value: { x: 2 } });
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it("ném lỗi khi value không phải object", () => {
    expect(() => new AuditContext("" as any)).toThrow(InvalidValueObjectError);
    expect(() => new AuditContext(null as any)).toThrow(
      InvalidValueObjectError
    );
    expect(() => new AuditContext(undefined as any)).toThrow(
      InvalidValueObjectError
    );
  });
});
