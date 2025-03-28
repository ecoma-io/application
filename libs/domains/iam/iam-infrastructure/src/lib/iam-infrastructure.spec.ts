import { iamInfrastructure } from "./iam-infrastructure";

describe("iamInfrastructure", () => {
  it("should contain the correct string value", () => {
    expect(iamInfrastructure).toEqual("iam-infrastructure");
  });
});
