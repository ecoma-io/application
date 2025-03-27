import {
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isError,
  isFloat,
  isFunction,
  isInteger,
  isNullOrUndefined,
  isNumber,
  isPlainObject,
  isPromise,
  isRegExp,
  isString,
} from "./type-validation";

describe("Type Validation Utils", () => {
  describe("isNullOrUndefined", () => {
    test("Nên trả về true cho null và undefined", () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    test("Nên trả về false cho các giá trị khác", () => {
      expect(isNullOrUndefined("")).toBe(false);
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined({})).toBe(false);
      expect(isNullOrUndefined([])).toBe(false);
    });
  });

  describe("isEmpty", () => {
    test("Nên trả về true cho null, undefined, chuỗi rỗng, mảng rỗng, object rỗng", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("  ")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    test("Nên trả về false cho các giá trị không rỗng", () => {
      expect(isEmpty("abc")).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("isNumber", () => {
    test("Nên trả về true cho số và chuỗi số hợp lệ", () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(1.23)).toBe(true);
      expect(isNumber("123")).toBe(true);
      expect(isNumber("-123")).toBe(true);
      expect(isNumber("1.23")).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải số", () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber("abc")).toBe(false);
      expect(isNumber("")).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });

  describe("isInteger", () => {
    test("Nên trả về true cho số nguyên và chuỗi số nguyên hợp lệ", () => {
      expect(isInteger(123)).toBe(true);
      expect(isInteger(0)).toBe(true);
      expect(isInteger(-123)).toBe(true);
      expect(isInteger("123")).toBe(true);
      expect(isInteger("-123")).toBe(true);
    });

    test("Nên trả về false cho số thập phân và các giá trị không phải số", () => {
      expect(isInteger(1.23)).toBe(false);
      expect(isInteger("1.23")).toBe(false);
      expect(isInteger(NaN)).toBe(false);
      expect(isInteger(Infinity)).toBe(false);
      expect(isInteger("abc")).toBe(false);
      expect(isInteger("")).toBe(false);
      expect(isInteger(null)).toBe(false);
      expect(isInteger(undefined)).toBe(false);
    });
  });

  describe("isFloat", () => {
    test("Nên trả về true cho số thập phân và chuỗi số thập phân hợp lệ", () => {
      expect(isFloat(1.23)).toBe(true);
      expect(isFloat(-1.23)).toBe(true);
      expect(isFloat("1.23")).toBe(true);
      expect(isFloat("-1.23")).toBe(true);
    });

    test("Nên trả về false cho số nguyên và các giá trị không phải số", () => {
      expect(isFloat(123)).toBe(false);
      expect(isFloat(0)).toBe(false);
      expect(isFloat("123")).toBe(false);
      expect(isFloat(NaN)).toBe(false);
      expect(isFloat(Infinity)).toBe(false);
      expect(isFloat("abc")).toBe(false);
      expect(isFloat("")).toBe(false);
      expect(isFloat(null)).toBe(false);
      expect(isFloat(undefined)).toBe(false);
    });
  });

  describe("isBoolean", () => {
    test("Nên trả về true cho boolean", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải boolean", () => {
      expect(isBoolean(0)).toBe(false);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean("true")).toBe(false);
      expect(isBoolean("false")).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
    });
  });

  describe("isString", () => {
    test("Nên trả về true cho chuỗi", () => {
      expect(isString("")).toBe(true);
      expect(isString("abc")).toBe(true);
      expect(isString(String(123))).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải chuỗi", () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe("isArray", () => {
    test("Nên trả về true cho mảng", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray([])).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải mảng", () => {
      expect(isArray({})).toBe(false);
      expect(isArray("[]")).toBe(false);
      expect(isArray(123)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
    });
  });

  describe("isPlainObject", () => {
    test("Nên trả về true cho plain object", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải plain object", () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(new RegExp(""))).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(123)).toBe(false);
      expect(isPlainObject("abc")).toBe(false);
    });
  });

  describe("isFunction", () => {
    test("Nên trả về true cho function", () => {
      expect(
        isFunction(function testFn() {
          return true;
        })
      ).toBe(true);
      expect(isFunction(() => true)).toBe(true);
      expect(isFunction(isFunction)).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải function", () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(123)).toBe(false);
      expect(isFunction("abc")).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
    });
  });

  describe("isDate", () => {
    test("Nên trả về true cho Date hợp lệ", () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date("2023-01-01"))).toBe(true);
    });

    test("Nên trả về false cho Date không hợp lệ và các giá trị không phải Date", () => {
      expect(isDate(new Date("invalid"))).toBe(false);
      expect(isDate("2023-01-01")).toBe(false);
      expect(isDate(123)).toBe(false);
      expect(isDate({})).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
    });
  });

  describe("isRegExp", () => {
    test("Nên trả về true cho RegExp", () => {
      expect(isRegExp(/abc/)).toBe(true);
      expect(isRegExp(new RegExp("abc"))).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải RegExp", () => {
      expect(isRegExp("/abc/")).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp([])).toBe(false);
      expect(isRegExp(123)).toBe(false);
      expect(isRegExp(null)).toBe(false);
      expect(isRegExp(undefined)).toBe(false);
    });
  });

  describe("isError", () => {
    test("Nên trả về true cho Error", () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải Error", () => {
      expect(isError({})).toBe(false);
      expect(isError("error")).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError(null)).toBe(false);
      expect(isError(undefined)).toBe(false);
    });
  });

  describe("isPromise", () => {
    test("Nên trả về true cho Promise", () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(
        isPromise(
          new Promise<void>((resolve) => {
            resolve();
          })
        )
      ).toBe(true);
      expect(isPromise({ then: () => true })).toBe(true);
    });

    test("Nên trả về false cho các giá trị không phải Promise", () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise({ then: "not a function" })).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise(123)).toBe(false);
      expect(isPromise("promise")).toBe(false);
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
    });
  });
});
