import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class MessageableValidators {
  static required(errorMessage = "This field is required"): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) {
        return { required: { message: errorMessage } };
      }

      if (typeof value === "string" && value.trim().length === 0) {
        return { required: { message: errorMessage } };
      }

      return null;
    };
  }

  static pattern(
    pattern: RegExp,
    errorMessage = "Invalid format"
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = pattern.test(value);
      return isValid
        ? null
        : { pattern: { message: errorMessage, pattern, value } };
    };
  }

  static minLength(
    minLength: number,
    errorMessage = `Minimum length is ${minLength}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isValid = control.value && control.value.length >= minLength;
      return isValid
        ? null
        : { minLength: { message: errorMessage, minLength } };
    };
  }

  static maxLength(
    maxLength: number,
    errorMessage = `Maximum length is ${maxLength}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // Nếu giá trị là null hoặc undefined, không kiểm tra (tránh lỗi truy cập .length)
      if (value === null || value === undefined) {
        return null;
      }

      // Nếu giá trị là chuỗi rỗng, bỏ qua kiểm tra
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }

      // Kiểm tra độ dài nếu giá trị là chuỗi
      if (typeof value === "string" && value.length > maxLength) {
        return { maxLength: { message: errorMessage, maxLength } };
      }

      return null;
    };
  }

  static min(
    min: number,
    errorMessage = `Minimum value is ${min}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = value !== null && value !== undefined && value >= min;
      return isValid ? null : { min: { message: errorMessage, min, value } };
    };
  }

  static max(
    max: number,
    errorMessage = `Maximum value is ${max}`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = value !== null && value !== undefined && value <= max;
      return isValid ? null : { max: { message: errorMessage } };
    };
  }

  static fixedLength(
    length: number,
    errorMessage = `The value must be ${length} in length`
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid =
        value !== null && value !== undefined && value.length === length;
      return isValid ? null : { fixedLength: { message: errorMessage } };
    };
  }

  static email(errorMessage = "Invalid email address"): ValidatorFn {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = emailPattern.test(value);
      return isValid ? null : { email: { message: errorMessage, value } };
    };
  }
}
