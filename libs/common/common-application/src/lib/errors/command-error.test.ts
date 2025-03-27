/**
 * @fileoverview Unit test cho CommandError
 */
import { CommandError } from "./command-error";

describe("CommandError", () => {
  it("nên khởi tạo với message cơ bản", () => {
    const error = new CommandError("Lỗi command");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CommandError);
    expect(error.message).toBe("Lỗi command");
    expect(error.name).toBe("CommandError");
    expect(error.details).toBeUndefined();
    expect(error.interpolationParams).toBeUndefined();
  });

  it("nên khởi tạo với details và interpolationParams", () => {
    const details = { code: 400 };
    const params = { foo: "bar" };
    const error = new CommandError("Msg", params, details);
    expect(error.details).toEqual(details);
    expect(error.interpolationParams).toEqual(params);
  });

  it("nên cho phép kế thừa", () => {
    class CustomError extends CommandError {
      constructor() {
        super("Custom", { a: 1 }, { code: 123 });
      }
    }
    const error = new CustomError();
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(CommandError);
    expect(error.name).toBe("CustomError");
    expect(error.message).toBe("Custom");
    expect(error.details).toEqual({ code: 123 });
    expect(error.interpolationParams).toEqual({ a: 1 });
  });
}); 