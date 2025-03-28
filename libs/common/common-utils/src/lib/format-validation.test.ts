import {
  isBase64,
  isCreditCardNumber,
  isHexColor,
  isHslColor,
  isHslaColor,
  isIpAddress,
  isJsonString,
  isRgbColor,
  isRgbaColor,
  isUuid,
} from "./format-validation";

describe("Format Validation Utils", () => {
  describe("isCreditCardNumber", () => {
    test("Nên trả về true cho số thẻ tín dụng hợp lệ", () => {
      expect(isCreditCardNumber("4111111111111111")).toBe(true); // Visa
      expect(isCreditCardNumber("5500000000000004")).toBe(true); // Mastercard
      expect(isCreditCardNumber("340000000000009")).toBe(true); // American Express
      expect(isCreditCardNumber("6011000000000004")).toBe(true); // Discover
      expect(isCreditCardNumber("3530111333300000")).toBe(true); // JCB
      expect(isCreditCardNumber("4111-1111-1111-1111")).toBe(true); // Với dấu gạch ngang
      expect(isCreditCardNumber("4111 1111 1111 1111")).toBe(true); // Với khoảng trắng
    });

    test("Nên trả về false cho số thẻ tín dụng không hợp lệ", () => {
      expect(isCreditCardNumber("4111111111111112")).toBe(false); // Sai checksum
      expect(isCreditCardNumber("411111111111111")).toBe(false); // Quá ngắn
      expect(isCreditCardNumber("41111111111111111111")).toBe(false); // Quá dài
      expect(isCreditCardNumber("411111111111111a")).toBe(false); // Chứa ký tự không phải số
      expect(isCreditCardNumber("")).toBe(false); // Chuỗi rỗng
      expect(isCreditCardNumber(123456789012345)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isHexColor", () => {
    test("Nên trả về true cho mã màu hex hợp lệ", () => {
      expect(isHexColor("#000")).toBe(true);
      expect(isHexColor("#fff")).toBe(true);
      expect(isHexColor("#000000")).toBe(true);
      expect(isHexColor("#ffffff")).toBe(true);
      expect(isHexColor("#123abc")).toBe(true);
      expect(isHexColor("#ABC123")).toBe(true);
    });

    test("Nên trả về false cho mã màu hex không hợp lệ", () => {
      expect(isHexColor("000")).toBe(false); // Thiếu #
      expect(isHexColor("#00")).toBe(false); // Quá ngắn
      expect(isHexColor("#0000")).toBe(false); // Độ dài không hợp lệ
      expect(isHexColor("#00000")).toBe(false); // Độ dài không hợp lệ
      expect(isHexColor("#0000000")).toBe(false); // Quá dài
      expect(isHexColor("#gggggg")).toBe(false); // Ký tự không hợp lệ
      expect(isHexColor(123456)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isRgbColor", () => {
    test("Nên trả về true cho mã màu RGB hợp lệ", () => {
      expect(isRgbColor("rgb(0,0,0)")).toBe(true);
      expect(isRgbColor("rgb(255,255,255)")).toBe(true);
      expect(isRgbColor("rgb(0, 0, 0)")).toBe(true);
      expect(isRgbColor("rgb( 255 , 255 , 255 )")).toBe(true);
    });

    test("Nên trả về false cho mã màu RGB không hợp lệ", () => {
      expect(isRgbColor("rgba(0,0,0,0)")).toBe(false); // RGBA không phải RGB
      expect(isRgbColor("rgb(256,0,0)")).toBe(false); // Giá trị ngoài phạm vi
      expect(isRgbColor("rgb(0,0)")).toBe(false); // Thiếu giá trị
      expect(isRgbColor("rgb(0,0,0,0)")).toBe(false); // Thừa giá trị
      expect(isRgbColor("rgb(a,b,c)")).toBe(false); // Không phải số
      expect(isRgbColor("rgb 0,0,0")).toBe(false); // Thiếu dấu ngoặc
      expect(isRgbColor(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isRgbaColor", () => {
    test("Nên trả về true cho mã màu RGBA hợp lệ", () => {
      expect(isRgbaColor("rgba(0,0,0,0)")).toBe(true);
      expect(isRgbaColor("rgba(255,255,255,1)")).toBe(true);
      expect(isRgbaColor("rgba(0, 0, 0, 0.5)")).toBe(true);
      expect(isRgbaColor("rgba( 255 , 255 , 255 , 0.1 )")).toBe(true);
    });

    test("Nên trả về false cho mã màu RGBA không hợp lệ", () => {
      expect(isRgbaColor("rgb(0,0,0)")).toBe(false); // RGB không phải RGBA
      expect(isRgbaColor("rgba(256,0,0,0)")).toBe(false); // Giá trị màu ngoài phạm vi
      expect(isRgbaColor("rgba(0,0,0,2)")).toBe(false); // Giá trị alpha ngoài phạm vi
      expect(isRgbaColor("rgba(0,0,0)")).toBe(false); // Thiếu giá trị alpha
      expect(isRgbaColor("rgba(0,0,0,0,0)")).toBe(false); // Thừa giá trị
      expect(isRgbaColor("rgba(a,b,c,d)")).toBe(false); // Không phải số
      expect(isRgbaColor("rgba 0,0,0,0")).toBe(false); // Thiếu dấu ngoặc
      expect(isRgbaColor(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isHslColor", () => {
    test("Nên trả về true cho mã màu HSL hợp lệ", () => {
      expect(isHslColor("hsl(0,0%,0%)")).toBe(true);
      expect(isHslColor("hsl(360,100%,100%)")).toBe(true);
      expect(isHslColor("hsl(180, 50%, 50%)")).toBe(true);
      expect(isHslColor("hsl( 90 , 25% , 75% )")).toBe(true);
    });

    test("Nên trả về false cho mã màu HSL không hợp lệ", () => {
      expect(isHslColor("hsla(0,0%,0%,0)")).toBe(false); // HSLA không phải HSL
      expect(isHslColor("hsl(361,0%,0%)")).toBe(false); // Giá trị hue ngoài phạm vi
      expect(isHslColor("hsl(0,101%,0%)")).toBe(false); // Giá trị saturation ngoài phạm vi
      expect(isHslColor("hsl(0,0%,101%)")).toBe(false); // Giá trị lightness ngoài phạm vi
      expect(isHslColor("hsl(0,0,0)")).toBe(false); // Thiếu %
      expect(isHslColor("hsl(0,0%,0%,0)")).toBe(false); // Thừa giá trị
      expect(isHslColor("hsl(a,b%,c%)")).toBe(false); // Không phải số
      expect(isHslColor("hsl 0,0%,0%")).toBe(false); // Thiếu dấu ngoặc
      expect(isHslColor(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isHslaColor", () => {
    test("Nên trả về true cho mã màu HSLA hợp lệ", () => {
      expect(isHslaColor("hsla(0,0%,0%,0)")).toBe(true);
      expect(isHslaColor("hsla(360,100%,100%,1)")).toBe(true);
      expect(isHslaColor("hsla(180, 50%, 50%, 0.5)")).toBe(true);
      expect(isHslaColor("hsla( 90 , 25% , 75% , 0.1 )")).toBe(true);
    });

    test("Nên trả về false cho mã màu HSLA không hợp lệ", () => {
      expect(isHslaColor("hsl(0,0%,0%)")).toBe(false); // HSL không phải HSLA
      expect(isHslaColor("hsla(361,0%,0%,0)")).toBe(false); // Giá trị hue ngoài phạm vi
      expect(isHslaColor("hsla(0,101%,0%,0)")).toBe(false); // Giá trị saturation ngoài phạm vi
      expect(isHslaColor("hsla(0,0%,101%,0)")).toBe(false); // Giá trị lightness ngoài phạm vi
      expect(isHslaColor("hsla(0,0%,0%,2)")).toBe(false); // Giá trị alpha ngoài phạm vi
      expect(isHslaColor("hsla(0,0%,0%)")).toBe(false); // Thiếu giá trị alpha
      expect(isHslaColor("hsla(0,0%,0%,0,0)")).toBe(false); // Thừa giá trị
      expect(isHslaColor("hsla(a,b%,c%,d)")).toBe(false); // Không phải số
      expect(isHslaColor("hsla 0,0%,0%,0")).toBe(false); // Thiếu dấu ngoặc
      expect(isHslaColor(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isBase64", () => {
    test("Nên trả về true cho chuỗi Base64 hợp lệ", () => {
      expect(isBase64("SGVsbG8gV29ybGQ=")).toBe(true);
      expect(isBase64("VGhpcyBpcyBhIHRlc3Q=")).toBe(true);
      expect(isBase64("YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo=")).toBe(true);
      expect(isBase64("")).toBe(true); // Chuỗi rỗng là Base64 hợp lệ
    });

    test("Nên trả về false cho chuỗi Base64 không hợp lệ", () => {
      expect(isBase64("SGVsbG8gV29ybGQ")).toBe(false); // Độ dài không hợp lệ
      expect(isBase64("SGVsbG8gV29ybGQ==")).toBe(false); // Padding không hợp lệ
      expect(isBase64("SGVsbG8gV29ybGQ===")).toBe(false); // Padding không hợp lệ
      expect(isBase64("SGVsbG8_V29ybGQ=")).toBe(false); // Ký tự không hợp lệ
      expect(isBase64(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isJsonString", () => {
    test("Nên trả về true cho chuỗi JSON hợp lệ", () => {
      expect(isJsonString("{}")).toBe(true);
      expect(isJsonString("[]")).toBe(true);
      expect(isJsonString('{"name":"John","age":30}')).toBe(true);
      expect(isJsonString("[1,2,3]")).toBe(true);
      expect(isJsonString('{"nested":{"key":"value"}}')).toBe(true);
      expect(isJsonString('{"array":[1,2,3]}')).toBe(true);
    });

    test("Nên trả về false cho chuỗi JSON không hợp lệ", () => {
      expect(isJsonString("{")).toBe(false); // Không đóng ngoặc
      expect(isJsonString('{"name":"John"')).toBe(false); // Không đóng ngoặc
      expect(isJsonString('{"name":John}')).toBe(false); // Thiếu dấu ngoặc kép cho giá trị
      expect(isJsonString('{name:"John"}')).toBe(false); // Thiếu dấu ngoặc kép cho key
      expect(isJsonString("abc")).toBe(false); // Không phải JSON
      expect(isJsonString("")).toBe(false); // Chuỗi rỗng
      expect(isJsonString("null")).toBe(false); // null
      expect(isJsonString("true")).toBe(false); // boolean
      expect(isJsonString("123")).toBe(false); // number
      expect(isJsonString(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isUuid", () => {
    test("Nên trả về true cho UUID hợp lệ", () => {
      expect(isUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true); // v1
      expect(isUuid("123e4567-e89b-22d3-a456-426614174000")).toBe(true); // v2
      expect(isUuid("123e4567-e89b-32d3-a456-426614174000")).toBe(true); // v3
      expect(isUuid("123e4567-e89b-42d3-a456-426614174000")).toBe(true); // v4
      expect(isUuid("123e4567-e89b-52d3-a456-426614174000")).toBe(true); // v5
    });

    test("Nên trả về false cho UUID không hợp lệ", () => {
      expect(isUuid("123e4567-e89b-62d3-a456-426614174000")).toBe(false); // Phiên bản không hợp lệ
      expect(isUuid("123e4567-e89b-12d3-a456-42661417400")).toBe(false); // Quá ngắn
      expect(isUuid("123e4567-e89b-12d3-a456-4266141740000")).toBe(false); // Quá dài
      expect(isUuid("123e4567e89b12d3a456426614174000")).toBe(false); // Thiếu dấu gạch ngang
      expect(isUuid("123e4567-e89b-12g3-a456-426614174000")).toBe(false); // Ký tự không hợp lệ
      expect(isUuid("")).toBe(false); // Chuỗi rỗng
      expect(isUuid(123)).toBe(false); // Không phải chuỗi
    });
  });

  describe("isIpAddress", () => {
    test("Nên trả về true cho địa chỉ IPv4 hợp lệ", () => {
      expect(isIpAddress("0.0.0.0")).toBe(true);
      expect(isIpAddress("127.0.0.1")).toBe(true);
      expect(isIpAddress("192.168.0.1")).toBe(true);
      expect(isIpAddress("255.255.255.255")).toBe(true);
    });

    test("Nên trả về true cho địa chỉ IPv6 hợp lệ", () => {
      expect(isIpAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe(true);
    });

    test("Nên trả về false cho địa chỉ IP không hợp lệ", () => {
      expect(isIpAddress("256.0.0.0")).toBe(false); // Giá trị ngoài phạm vi
      expect(isIpAddress("127.0.0")).toBe(false); // Thiếu octet
      expect(isIpAddress("127.0.0.1.1")).toBe(false); // Thừa octet
      expect(isIpAddress("127.0.0.a")).toBe(false); // Ký tự không hợp lệ
      expect(isIpAddress("")).toBe(false); // Chuỗi rỗng
      expect(isIpAddress("localhost")).toBe(false); // Không phải địa chỉ IP
      expect(isIpAddress(123)).toBe(false); // Không phải chuỗi
    });
  });
});
