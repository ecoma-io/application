/**
 * @fileoverview Unit test cho GenericResult
 */
import { IGenericResult } from "./generic-result";

describe("IGenericResult", () => {
  it("nên tạo object đúng cấu trúc", () => {
    const result: IGenericResult<{ foo: number }> = {
      success: true,
      error: "",
      details: undefined,
      data: { foo: 1 },
    };
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ foo: 1 });
  });
}); 