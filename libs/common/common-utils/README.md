# Common Utils (@ecoma/common-utils)

Thư viện @ecoma/common-utils cung cấp một tập hợp các hàm tiện ích (utility functions) dùng chung và không phụ thuộc vào logic nghiệp vụ cụ thể nào trong hệ thống Microservices của Ecoma. Mục đích chính là hỗ trợ tái sử dụng mã nguồn cho các tác vụ phổ biến, đơn giản hóa việc phát triển và duy trì code base trên toàn hệ thống.

## Cài đặt

```bash
npm install @ecoma/common-utils
```

## Tính năng

### String Utilities

```typescript
import { isValidEmail, isValidUrl, isValidPhoneNumber, formatString, createSlug } from '@ecoma/common-utils';

// Kiểm tra email
const isValid = isValidEmail('test@example.com');

// Kiểm tra URL
const isValid = isValidUrl('https://example.com');

// Kiểm tra số điện thoại
const isValid = isValidPhoneNumber('+84123456789');

// Format chuỗi
const formatted = formatString('Hello {0}!', 'World');

// Tạo slug
const slug = createSlug('Hello World!');
```

### Date Utilities

```typescript
import { formatDate, isValidDate, parseDate, daysBetween } from '@ecoma/common-utils';

// Format date
const formatted = formatDate(new Date(), 'YYYY-MM-DD');

// Kiểm tra date
const isValid = isValidDate(new Date());

// Parse date
const date = parseDate('2024-01-01');

// Tính số ngày
const days = daysBetween(new Date(), new Date('2024-12-31'));
```

### Array Utilities

```typescript
import { chunk, unique, intersection, difference } from '@ecoma/common-utils';

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
import { deepClone, deepMerge, get, set } from '@ecoma/common-utils';

// Deep clone object
const cloned = deepClone({ a: 1, b: { c: 2 } });

// Deep merge objects
const merged = deepMerge({ a: 1 }, { b: 2 });

// Get value by path
const value = get(obj, 'a.b.c');

// Set value by path
const updated = set(obj, 'a.b.c', 3);
```

### Validation Utilities

```typescript
import { isNullOrUndefined, isEmpty, isNumber, isString } from '@ecoma/common-utils';

// Kiểm tra null/undefined
const isNull = isNullOrUndefined(null);

// Kiểm tra empty
const isEmpty = isEmpty('');

// Kiểm tra number
const isNum = isNumber(123);

// Kiểm tra string
const isStr = isString('hello');
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
