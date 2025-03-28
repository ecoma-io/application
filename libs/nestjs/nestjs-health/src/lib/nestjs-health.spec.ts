import { nestjsHealth } from "./nestjs-health";

describe("nestjsHealth", () => {
  it("should work", () => {
    expect(nestjsHealth()).toEqual("nestjs-health");
  });
});
