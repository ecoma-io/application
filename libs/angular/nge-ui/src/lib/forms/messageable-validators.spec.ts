import { AbstractControl, FormControl } from "@angular/forms";
import { MessageableValidators } from "./messageable-validators";

describe("MessageableValidators", () => {
  describe("required", () => {
    it("should return error when value is null or undefined", () => {
      const control: AbstractControl = new FormControl(null);
      const result = MessageableValidators.required()(control);
      expect(result).toEqual({
        required: { message: "This field is required" },
      });

      control.setValue(undefined);
      const resultUndefined = MessageableValidators.required()(control);
      expect(resultUndefined).toEqual({
        required: { message: "This field is required" },
      });
    });

    it("should return error when value is empty string", () => {
      const control: AbstractControl = new FormControl("");
      const result = MessageableValidators.required()(control);
      expect(result).toEqual({
        required: { message: "This field is required" },
      });
    });

    it("should return null when value is valid", () => {
      const control: AbstractControl = new FormControl("Test");
      const result = MessageableValidators.required()(control);
      expect(result).toBeNull();
    });

    it("should return custom error message", () => {
      const control: AbstractControl = new FormControl("");
      const result = MessageableValidators.required("Custom error message")(
        control
      );
      expect(result).toEqual({ required: { message: "Custom error message" } });
    });
  });

  describe("pattern", () => {
    it("should return error when value does not match pattern", () => {
      const control: AbstractControl = new FormControl("invalid-email");
      const result = MessageableValidators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )(control);
      expect(result).toEqual({
        pattern: {
          message: "Invalid format",
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          value: "invalid-email",
        },
      });
    });

    it("should return null when value matches pattern", () => {
      const control: AbstractControl = new FormControl("test@example.com");
      const result = MessageableValidators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )(control);
      expect(result).toBeNull();
    });
  });

  describe("minLength", () => {
    it("should return error when value length is less than minLength", () => {
      const control: AbstractControl = new FormControl("Test");
      const result = MessageableValidators.minLength(5)(control);
      expect(result).toEqual({
        minLength: { message: "Minimum length is 5", minLength: 5 },
      });
    });

    it("should return null when value length is greater than or equal to minLength", () => {
      const control: AbstractControl = new FormControl("Testing");
      const result = MessageableValidators.minLength(5)(control);
      expect(result).toBeNull();
    });
  });

  describe("length", () => {
    it("should return error when value length is different than length", () => {
      const control: AbstractControl = new FormControl("Test");
      const result = MessageableValidators.fixedLength(5)(control);
      expect(result).toEqual({
        fixedLength: { message: "The value must be 5 in length" },
      });
    });

    it("should return null when value length is greater than or equal to minLength", () => {
      const control: AbstractControl = new FormControl("Testing");
      const result = MessageableValidators.fixedLength(7)(control);
      expect(result).toBeNull();
    });
  });

  describe("maxLength", () => {
    it("should return error when value length exceeds maxLength", () => {
      const control: AbstractControl = new FormControl("Testing long string");
      const result = MessageableValidators.maxLength(10)(control);
      expect(result).toEqual({
        maxLength: { message: "Maximum length is 10", maxLength: 10 },
      });
    });

    it("should return null when value length is less than or equal to maxLength", () => {
      const control: AbstractControl = new FormControl("Test");
      const result = MessageableValidators.maxLength(10)(control);
      expect(result).toBeNull();
    });
  });

  describe("min", () => {
    it("should return error when value is less than min", () => {
      const control: AbstractControl = new FormControl(5);
      const result = MessageableValidators.min(10)(control);
      expect(result).toEqual({
        min: { message: "Minimum value is 10", min: 10, value: 5 },
      });
    });

    it("should return null when value is greater than or equal to min", () => {
      const control: AbstractControl = new FormControl(15);
      const result = MessageableValidators.min(10)(control);
      expect(result).toBeNull();
    });
  });

  describe("max", () => {
    it("should return error when value is greater than max", () => {
      const control: AbstractControl = new FormControl(20);
      const result = MessageableValidators.max(10)(control);
      expect(result).toEqual({ max: { message: "Maximum value is 10" } });
    });

    it("should return null when value is less than or equal to max", () => {
      const control: AbstractControl = new FormControl(5);
      const result = MessageableValidators.max(10)(control);
      expect(result).toBeNull();
    });
  });

  describe("email", () => {
    it("should return error for invalid email", () => {
      const control: AbstractControl = new FormControl("invalid-email");
      const result = MessageableValidators.email()(control);
      expect(result).toEqual({
        email: { message: "Invalid email address", value: "invalid-email" },
      });
    });

    it("should return null for valid email", () => {
      const control: AbstractControl = new FormControl("test@example.com");
      const result = MessageableValidators.email()(control);
      expect(result).toBeNull();
    });
  });
});
