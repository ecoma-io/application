# Common Utils (@ecoma/common-utils)

Thư viện @ecoma/common-utils cung cấp một tập hợp các hàm tiện ích (utility functions) dùng chung và không phụ thuộc vào logic nghiệp vụ cụ thể nào trong hệ thống Microservices của Ecoma. Mục đích chính là hỗ trợ tái sử dụng mã nguồn cho các tác vụ phổ biến, đơn giản hóa việc phát triển và duy trì code base trên toàn hệ thống.

## Cài đặt

```bash
npm install @ecoma/common-utils
```

## Tính năng

### String Utilities

```typescript
import { isValidEmail, isValidUrl, isValidPhoneNumber, formatString, createSlug } from "@ecoma/common-utils";

// Kiểm tra email
const isValid = isValidEmail("test@example.com");

// Kiểm tra URL
const isValid = isValidUrl("https://example.com");

// Kiểm tra số điện thoại
const isValid = isValidPhoneNumber("+84123456789");

// Format chuỗi
const formatted = formatString("Hello {0}!", "World");

// Tạo slug
const slug = createSlug("Hello World!");
```

### Date Utilities

```typescript
import { formatDate, isValidDate, parseDate, daysBetween } from "@ecoma/common-utils";

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
import { chunk, unique, intersection, difference } from "@ecoma/common-utils";

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
import { deepClone, deepMerge, get, set } from "@ecoma/common-utils";

// Deep clone object
const cloned = deepClone({ a: 1, b: { c: 2 } });

// Deep merge objects
const merged = deepMerge({ a: 1 }, { b: 2 });

// Get value by path
const value = get(obj, "a.b.c");

// Set value by path
const updated = set(obj, "a.b.c", 3);
```

### Validation Utilities

```typescript
import { isNullOrUndefined, isEmpty, isNumber, isString } from "@ecoma/common-utils";

// Kiểm tra null/undefined
const isNull = isNullOrUndefined(null);

// Kiểm tra empty
const isEmpty = isEmpty("");

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

## Interfaces

- [IPollUntilOptions](/libraries/common-utils/Interface.IPollUntilOptions.md)

## Type Aliases

- [PollUntilCheckFunction](/libraries/common-utils/TypeAlias.PollUntilCheckFunction.md)

## Functions

- [addDays](/libraries/common-utils/Function.addDays.md)
- [addMonths](/libraries/common-utils/Function.addMonths.md)
- [addQueryParams](/libraries/common-utils/Function.addQueryParams.md)
- [addYears](/libraries/common-utils/Function.addYears.md)
- [capitalizeFirstLetter](/libraries/common-utils/Function.capitalizeFirstLetter.md)
- [chunk](/libraries/common-utils/Function.chunk.md)
- [countOccurrences](/libraries/common-utils/Function.countOccurrences.md)
- [createSlug](/libraries/common-utils/Function.createSlug.md)
- [daysBetween](/libraries/common-utils/Function.daysBetween.md)
- [deepClone](/libraries/common-utils/Function.deepClone.md)
- [deepEqual](/libraries/common-utils/Function.deepEqual.md)
- [deepMerge](/libraries/common-utils/Function.deepMerge.md)
- [difference](/libraries/common-utils/Function.difference.md)
- [differenceBy](/libraries/common-utils/Function.differenceBy.md)
- [entries](/libraries/common-utils/Function.entries.md)
- [first](/libraries/common-utils/Function.first.md)
- [formatDate](/libraries/common-utils/Function.formatDate.md)
- [formatString](/libraries/common-utils/Function.formatString.md)
- [fromEntries](/libraries/common-utils/Function.fromEntries.md)
- [generateRandomString](/libraries/common-utils/Function.generateRandomString.md)
- [get](/libraries/common-utils/Function.get.md)
- [getFirstDayOfMonth](/libraries/common-utils/Function.getFirstDayOfMonth.md)
- [getHostname](/libraries/common-utils/Function.getHostname.md)
- [getLastDayOfMonth](/libraries/common-utils/Function.getLastDayOfMonth.md)
- [getQueryParams](/libraries/common-utils/Function.getQueryParams.md)
- [getRootDomain](/libraries/common-utils/Function.getRootDomain.md)
- [includesAll](/libraries/common-utils/Function.includesAll.md)
- [includesAny](/libraries/common-utils/Function.includesAny.md)
- [intersection](/libraries/common-utils/Function.intersection.md)
- [intersectionBy](/libraries/common-utils/Function.intersectionBy.md)
- [isAbsoluteUrl](/libraries/common-utils/Function.isAbsoluteUrl.md)
- [isAlpha](/libraries/common-utils/Function.isAlpha.md)
- [isAlphanumeric](/libraries/common-utils/Function.isAlphanumeric.md)
- [isAnagram](/libraries/common-utils/Function.isAnagram.md)
- [isArray](/libraries/common-utils/Function.isArray.md)
- [isAscii](/libraries/common-utils/Function.isAscii.md)
- [isBase64](/libraries/common-utils/Function.isBase64.md)
- [isBoolean](/libraries/common-utils/Function.isBoolean.md)
- [isCreditCardNumber](/libraries/common-utils/Function.isCreditCardNumber.md)
- [isDate](/libraries/common-utils/Function.isDate.md)
- [isDateBetween](/libraries/common-utils/Function.isDateBetween.md)
- [isEmail](/libraries/common-utils/Function.isEmail.md)
- [isEmpty](/libraries/common-utils/Function.isEmpty.md)
- [isError](/libraries/common-utils/Function.isError.md)
- [isFloat](/libraries/common-utils/Function.isFloat.md)
- [isFunction](/libraries/common-utils/Function.isFunction.md)
- [isHeterogram](/libraries/common-utils/Function.isHeterogram.md)
- [isHexColor](/libraries/common-utils/Function.isHexColor.md)
- [isHslaColor](/libraries/common-utils/Function.isHslaColor.md)
- [isHslColor](/libraries/common-utils/Function.isHslColor.md)
- [isInteger](/libraries/common-utils/Function.isInteger.md)
- [isIpAddress](/libraries/common-utils/Function.isIpAddress.md)
- [isIsogram](/libraries/common-utils/Function.isIsogram.md)
- [isJsonString](/libraries/common-utils/Function.isJsonString.md)
- [isLipogram](/libraries/common-utils/Function.isLipogram.md)
- [isLowercase](/libraries/common-utils/Function.isLowercase.md)
- [isNullOrUndefined](/libraries/common-utils/Function.isNullOrUndefined.md)
- [isNumber](/libraries/common-utils/Function.isNumber.md)
- [isNumeric](/libraries/common-utils/Function.isNumeric.md)
- [isObject](/libraries/common-utils/Function.isObject.md)
- [isPalindrome](/libraries/common-utils/Function.isPalindrome.md)
- [isPangram](/libraries/common-utils/Function.isPangram.md)
- [isPangrammaticLipogram](/libraries/common-utils/Function.isPangrammaticLipogram.md)
- [isPhoneNumber](/libraries/common-utils/Function.isPhoneNumber.md)
- [isPlainObject](/libraries/common-utils/Function.isPlainObject.md)
- [isPromise](/libraries/common-utils/Function.isPromise.md)
- [isRegExp](/libraries/common-utils/Function.isRegExp.md)
- [isRgbaColor](/libraries/common-utils/Function.isRgbaColor.md)
- [isRgbColor](/libraries/common-utils/Function.isRgbColor.md)
- [isString](/libraries/common-utils/Function.isString.md)
- [isTautogram](/libraries/common-utils/Function.isTautogram.md)
- [isUppercase](/libraries/common-utils/Function.isUppercase.md)
- [isUrl](/libraries/common-utils/Function.isUrl.md)
- [isUuid](/libraries/common-utils/Function.isUuid.md)
- [isValidDate](/libraries/common-utils/Function.isValidDate.md)
- [isValidEmail](/libraries/common-utils/Function.isValidEmail.md)
- [isValidPhoneNumber](/libraries/common-utils/Function.isValidPhoneNumber.md)
- [isValidUrl](/libraries/common-utils/Function.isValidUrl.md)
- [isWeekend](/libraries/common-utils/Function.isWeekend.md)
- [isWorkday](/libraries/common-utils/Function.isWorkday.md)
- [joinUrl](/libraries/common-utils/Function.joinUrl.md)
- [keys](/libraries/common-utils/Function.keys.md)
- [last](/libraries/common-utils/Function.last.md)
- [parseDate](/libraries/common-utils/Function.parseDate.md)
- [pollUntil](/libraries/common-utils/Function.pollUntil.md)
- [random](/libraries/common-utils/Function.random.md)
- [randomItems](/libraries/common-utils/Function.randomItems.md)
- [range](/libraries/common-utils/Function.range.md)
- [reverseString](/libraries/common-utils/Function.reverseString.md)
- [set](/libraries/common-utils/Function.set.md)
- [stripChars](/libraries/common-utils/Function.stripChars.md)
- [toCamelCase](/libraries/common-utils/Function.toCamelCase.md)
- [toKebabCase](/libraries/common-utils/Function.toKebabCase.md)
- [toPascalCase](/libraries/common-utils/Function.toPascalCase.md)
- [toSnakeCase](/libraries/common-utils/Function.toSnakeCase.md)
- [truncateString](/libraries/common-utils/Function.truncateString.md)
- [unique](/libraries/common-utils/Function.unique.md)
- [uniqueBy](/libraries/common-utils/Function.uniqueBy.md)
- [unset](/libraries/common-utils/Function.unset.md)
- [values](/libraries/common-utils/Function.values.md)
- [zipObject](/libraries/common-utils/Function.zipObject.md)
