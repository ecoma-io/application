/**
 * @fileoverview Unit test cho ApplicationError
 */
import { ApplicationError } from "./application-error";

describe("ApplicationError", () => {
  it("nên khởi tạo với message cơ bản", () => {
    const error = new ApplicationError("Lỗi ứng dụng");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.message).toBe("Lỗi ứng dụng");
    expect(error.name).toBe("ApplicationError");
    expect(error.details).toBeUndefined();
    expect(error.interpolationParams).toBeUndefined();
  });

  it("nên khởi tạo với details và interpolationParams", () => {
    const details = { code: 500 };
    const params = { foo: "bar" };
    const error = new ApplicationError("Msg", params, details);
    expect(error.details).toEqual(details);
    expect(error.interpolationParams).toEqual(params);
  });

  it("nên cho phép kế thừa", () => {
    class CustomError extends ApplicationError {
      constructor() {
        super("Custom", { a: 1 }, { code: 123 });
      }
    }
    const error = new CustomError();
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error.name).toBe("CustomError");
    expect(error.message).toBe("Custom");
    expect(error.details).toEqual({ code: 123 });
    expect(error.interpolationParams).toEqual({ a: 1 });
  });
}); 