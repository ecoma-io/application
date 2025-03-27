/**
 * @fileoverview Unit test cho QueryError
 */
import { QueryError } from "./query-error";

describe("QueryError", () => {
  it("nên khởi tạo với message cơ bản", () => {
    const error = new QueryError("Lỗi query");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(QueryError);
    expect(error.message).toBe("Lỗi query");
    expect(error.name).toBe("QueryError");
    expect(error.details).toBeUndefined();
    expect(error.interpolationParams).toBeUndefined();
  });

  it("nên khởi tạo với details và interpolationParams", () => {
    const details = { code: 400 };
    const params = { foo: "bar" };
    const error = new QueryError("Msg", params, details);
    expect(error.details).toEqual(details);
    expect(error.interpolationParams).toEqual(params);
  });

  it("nên cho phép kế thừa", () => {
    class CustomError extends QueryError {
      constructor() {
        super("Custom", { a: 1 }, { code: 123 });
      }
    }
    const error = new CustomError();
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(QueryError);
    expect(error.name).toBe("CustomError");
    expect(error.message).toBe("Custom");
    expect(error.details).toEqual({ code: 123 });
    expect(error.interpolationParams).toEqual({ a: 1 });
  });
}); 