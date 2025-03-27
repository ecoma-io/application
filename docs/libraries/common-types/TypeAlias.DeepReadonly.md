# Type Alias: DeepReadonly\<T\>

> **DeepReadonly**\<`T`\> = `{ readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P] }`

Đệ quy làm tất cả các thuộc tính của một kiểu object trở thành readonly.

Khác với `Readonly<T>` của TypeScript, kiểu này áp dụng đệ quy cho tất cả các thuộc tính lồng nhau.

## Type Parameters

### T

`T`

Kiểu object cần được biến đổi thành deeply readonly.

## Example

```typescript
interface Config {
  appName: string;
  settings: {
    timeout: number;
    retries: number;
  }
}

// Khởi tạo một đối tượng Config
const config: DeepReadonly<Config> = {
  appName: 'Ecoma',
  settings: {
    timeout: 30000,
    retries: 3
  }
};

// Các dòng sau sẽ gây lỗi TypeScript vì tất cả các thuộc tính đều readonly
// config.appName = 'New Name';
// config.settings.timeout = 60000;
```
