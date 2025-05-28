# Common Utils (@ecoma/utils)

Thư viện @ecoma/utils cung cấp một tập hợp các hàm tiện ích (utility functions) dùng chung và không phụ thuộc vào logic nghiệp vụ cụ thể nào trong hệ thống Microservices của Ecoma. Mục đích chính là hỗ trợ tái sử dụng mã nguồn cho các tác vụ phổ biến, đơn giản hóa việc phát triển và duy trì code base trên toàn hệ thống.

## Cài đặt

```bash
npm install @ecoma/utils
```

## Tính năng

### String Utilities

```typescript
import { isValidEmail, isValidUrl, isValidPhoneNumber, formatString, createSlug } from "@ecoma/utils";

// Kiểm tra email
const isValid = isValidEmail("test@example.com");

// Kiểm tra URL
const isValidUrlResult = isValidUrl("https://example.com");

// Kiểm tra số điện thoại
const isPhone = isValidPhoneNumber("+84123456789");

// Format chuỗi
const formatted = formatString("Hello {0}!", "World");

// Tạo slug
const slug = createSlug("Hello World!");
```

### Date Utilities

```typescript
import { formatDate, isValidDate, parseDate, daysBetween } from "@ecoma/utils";

// Format date
const formatted = formatDate(new Date(), "YYYY-MM-DD");

// Kiểm tra date
const isValid = isValidDate(new Date());

// Parse date
const date = parseDate("2024-01-01");

// Tính số ngày
const days = daysBetween(new Date(), new Date("2024-12-31"));
```

### Array Utilities

```typescript
import { chunk, unique, intersection, difference } from "@ecoma/utils";

// Chia array thành chunks
const chunks = chunk([1, 2, 3, 4, 5], 2);

// Lấy các phần tử duy nhất
const uniqueItems = unique([1, 2, 2, 3, 3]);

// Lấy các phần tử chung
const common = intersection([1, 2, 3], [2, 3, 4]);

// Lấy các phần tử khác nhau
const diff = difference([1, 2, 3], [2, 3, 4]);
```

### Object Utilities

```typescript
import { deepClone, deepMerge, get, set } from "@ecoma/utils";

// Deep clone object
const cloned = deepClone({ a: 1, b: { c: 2 } });

// Deep merge objects
const merged = deepMerge({ a: 1 }, { b: 2 });

// Get value by path
const value = get({ a: { b: { c: 3 } } }, "a.b.c");

// Set value by path
const updated = set({ a: { b: { c: 3 } } }, "a.b.c", 4);
```

### Validation Utilities

```typescript
import { isNullOrUndefined, isEmpty, isNumber, isString } from "@ecoma/utils";

// Kiểm tra null/undefined
const isNull = isNullOrUndefined(null);

// Kiểm tra empty
const isEmptyStr = isEmpty("");

// Kiểm tra number
const isNum = isNumber(123);

// Kiểm tra string
const isStr = isString("hello");
```

## Best Practices

1. Sử dụng các utility functions thay vì tự implement
2. Sử dụng các type guards để kiểm tra kiểu dữ liệu
3. Sử dụng các validation functions để validate dữ liệu
4. Sử dụng các helper functions để xử lý dữ liệu
5. Sử dụng các format functions để format dữ liệu

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT

## Classes

- [Guard](/api/utils/Class.Guard.md)

## Interfaces

- [IPollUntilOptions](/api/utils/Interface.IPollUntilOptions.md)

## Type Aliases

- [PollUntilCheckFunction](/api/utils/TypeAlias.PollUntilCheckFunction.md)

## Functions

- [addDays](/api/utils/Function.addDays.md)
- [addMonths](/api/utils/Function.addMonths.md)
- [addQueryParams](/api/utils/Function.addQueryParams.md)
- [addYears](/api/utils/Function.addYears.md)
- [capitalizeFirstLetter](/api/utils/Function.capitalizeFirstLetter.md)
- [chunk](/api/utils/Function.chunk.md)
- [countOccurrences](/api/utils/Function.countOccurrences.md)
- [createSlug](/api/utils/Function.createSlug.md)
- [daysBetween](/api/utils/Function.daysBetween.md)
- [deepClone](/api/utils/Function.deepClone.md)
- [deepEqual](/api/utils/Function.deepEqual.md)
- [deepMerge](/api/utils/Function.deepMerge.md)
- [difference](/api/utils/Function.difference.md)
- [differenceBy](/api/utils/Function.differenceBy.md)
- [entries](/api/utils/Function.entries.md)
- [first](/api/utils/Function.first.md)
- [formatDate](/api/utils/Function.formatDate.md)
- [formatString](/api/utils/Function.formatString.md)
- [fromEntries](/api/utils/Function.fromEntries.md)
- [generateRandomString](/api/utils/Function.generateRandomString.md)
- [get](/api/utils/Function.get.md)
- [getFirstDayOfMonth](/api/utils/Function.getFirstDayOfMonth.md)
- [getHostname](/api/utils/Function.getHostname.md)
- [getLastDayOfMonth](/api/utils/Function.getLastDayOfMonth.md)
- [getQueryParams](/api/utils/Function.getQueryParams.md)
- [getRootDomain](/api/utils/Function.getRootDomain.md)
- [includesAll](/api/utils/Function.includesAll.md)
- [includesAny](/api/utils/Function.includesAny.md)
- [intersection](/api/utils/Function.intersection.md)
- [intersectionBy](/api/utils/Function.intersectionBy.md)
- [isAbsoluteUrl](/api/utils/Function.isAbsoluteUrl.md)
- [isAlpha](/api/utils/Function.isAlpha.md)
- [isAlphanumeric](/api/utils/Function.isAlphanumeric.md)
- [isAnagram](/api/utils/Function.isAnagram.md)
- [isArray](/api/utils/Function.isArray.md)
- [isAscii](/api/utils/Function.isAscii.md)
- [isBase64](/api/utils/Function.isBase64.md)
- [isBoolean](/api/utils/Function.isBoolean.md)
- [isCreditCardNumber](/api/utils/Function.isCreditCardNumber.md)
- [isDate](/api/utils/Function.isDate.md)
- [isDateBetween](/api/utils/Function.isDateBetween.md)
- [isEmail](/api/utils/Function.isEmail.md)
- [isEmpty](/api/utils/Function.isEmpty.md)
- [isError](/api/utils/Function.isError.md)
- [isFloat](/api/utils/Function.isFloat.md)
- [isFunction](/api/utils/Function.isFunction.md)
- [isHeterogram](/api/utils/Function.isHeterogram.md)
- [isHexColor](/api/utils/Function.isHexColor.md)
- [isHslaColor](/api/utils/Function.isHslaColor.md)
- [isHslColor](/api/utils/Function.isHslColor.md)
- [isInteger](/api/utils/Function.isInteger.md)
- [isIpAddress](/api/utils/Function.isIpAddress.md)
- [isIsogram](/api/utils/Function.isIsogram.md)
- [isJsonString](/api/utils/Function.isJsonString.md)
- [isKebabCase](/api/utils/Function.isKebabCase.md)
- [isLipogram](/api/utils/Function.isLipogram.md)
- [isLowercase](/api/utils/Function.isLowercase.md)
- [isNullOrUndefined](/api/utils/Function.isNullOrUndefined.md)
- [isNumber](/api/utils/Function.isNumber.md)
- [isNumeric](/api/utils/Function.isNumeric.md)
- [isObject](/api/utils/Function.isObject.md)
- [isPalindrome](/api/utils/Function.isPalindrome.md)
- [isPangram](/api/utils/Function.isPangram.md)
- [isPangrammaticLipogram](/api/utils/Function.isPangrammaticLipogram.md)
- [isPhoneNumber](/api/utils/Function.isPhoneNumber.md)
- [isPlainObject](/api/utils/Function.isPlainObject.md)
- [isPromise](/api/utils/Function.isPromise.md)
- [isRegExp](/api/utils/Function.isRegExp.md)
- [isRgbaColor](/api/utils/Function.isRgbaColor.md)
- [isRgbColor](/api/utils/Function.isRgbColor.md)
- [isString](/api/utils/Function.isString.md)
- [isTautogram](/api/utils/Function.isTautogram.md)
- [isUppercase](/api/utils/Function.isUppercase.md)
- [isUrl](/api/utils/Function.isUrl.md)
- [isUuid](/api/utils/Function.isUuid.md)
- [isValidDate](/api/utils/Function.isValidDate.md)
- [isValidEmail](/api/utils/Function.isValidEmail.md)
- [isValidPhoneNumber](/api/utils/Function.isValidPhoneNumber.md)
- [isValidUrl](/api/utils/Function.isValidUrl.md)
- [isWeekend](/api/utils/Function.isWeekend.md)
- [isWorkday](/api/utils/Function.isWorkday.md)
- [joinUrl](/api/utils/Function.joinUrl.md)
- [keys](/api/utils/Function.keys.md)
- [last](/api/utils/Function.last.md)
- [parseDate](/api/utils/Function.parseDate.md)
- [pollUntil](/api/utils/Function.pollUntil.md)
- [random](/api/utils/Function.random.md)
- [randomItems](/api/utils/Function.randomItems.md)
- [range](/api/utils/Function.range.md)
- [reverseString](/api/utils/Function.reverseString.md)
- [set](/api/utils/Function.set.md)
- [stripChars](/api/utils/Function.stripChars.md)
- [toCamelCase](/api/utils/Function.toCamelCase.md)
- [toKebabCase](/api/utils/Function.toKebabCase.md)
- [toPascalCase](/api/utils/Function.toPascalCase.md)
- [toSnakeCase](/api/utils/Function.toSnakeCase.md)
- [truncateString](/api/utils/Function.truncateString.md)
- [unique](/api/utils/Function.unique.md)
- [uniqueBy](/api/utils/Function.uniqueBy.md)
- [unset](/api/utils/Function.unset.md)
- [values](/api/utils/Function.values.md)
- [zipObject](/api/utils/Function.zipObject.md)
