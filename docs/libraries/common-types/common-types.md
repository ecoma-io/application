# Common Types

Thư viện này cung cấp các utility types dùng chung cho hệ thống Ecoma, giúp cải thiện type safety và tái sử dụng code.

## Cài đặt

```bash
yarn add @ecoma/common-types
```

## Cấu trúc thư viện

Thư viện được tổ chức thành các nhóm type theo chức năng:

- **Array Types**: Các type liên quan đến mảng (`ArrayOrSingle<T>`, `NonEmptyArray<T>`)
- **Object Types**: Các type liên quan đến đối tượng (`DeepPartial<T>`, `DeepReadonly<T>`, `Dict<T>`, `EmptyObject`, `Entries<T>`, `PlainObject`, `PartialWithRequired<T, TK>`)
- **Function Types**: Các type liên quan đến hàm (`Awaitable<T>`, `PartialFunction<T>`)
- **Primitive Types**: Các type liên quan đến kiểu dữ liệu nguyên thủy (`Primitive`, `Nullable<T>`, `Optional<T>`, `Maybe<T>`)
- **Utility Types**: Các utility type hỗ trợ (`ExcludeFromUnion<T, TU>`, `ExtractFromUnion<T, TU>`, `KeysOf<T>`, `XOR<T, TU>`)

## Cách sử dụng

### Import

```typescript
// Import tất cả
import * as CommonTypes from "@ecoma/common-types";

// Import cụ thể
import { ArrayOrSingle, DeepPartial, Awaitable } from "@ecoma/common-types";
```

### Ví dụ

#### ArrayOrSingle

```typescript
import { ArrayOrSingle } from "@ecoma/common-types";

// Hàm có thể nhận một giá trị hoặc một mảng giá trị
function processIds(ids: ArrayOrSingle<string>): void {
  const idArray = Array.isArray(ids) ? ids : [ids];
  idArray.forEach((id) => console.log(`Xử lý ID: ${id}`));
}

// Sử dụng với một giá trị
processIds("user-1");

// Sử dụng với một mảng
processIds(["user-1", "user-2", "user-3"]);
```

#### DeepPartial

```typescript
import { DeepPartial } from "@ecoma/common-types";

interface Config {
  server: {
    port: number;
    host: string;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    credentials: {
      username: string;
      password: string;
    };
  };
}

// Hàm cập nhật cấu hình, chỉ cần cung cấp các giá trị cần thay đổi
function updateConfig(config: Config, updates: DeepPartial<Config>): Config {
  return {
    ...config,
    server: {
      ...config.server,
      ...updates.server,
      ssl: {
        ...config.server.ssl,
        ...updates.server?.ssl,
      },
    },
    database: {
      ...config.database,
      ...updates.database,
      credentials: {
        ...config.database.credentials,
        ...updates.database?.credentials,
      },
    },
  };
}

// Chỉ cần cung cấp các giá trị cần thay đổi
const updatedConfig = updateConfig(currentConfig, {
  server: {
    ssl: {
      enabled: true,
    },
  },
});
```

#### Awaitable

```typescript
import { Awaitable } from "@ecoma/common-types";

// Hàm có thể trả về giá trị đồng bộ hoặc bất đồng bộ
function getData(id: string, useCache: boolean): Awaitable<string> {
  if (useCache && cache.has(id)) {
    return cache.get(id);
  }

  return api.fetchData(id);
}

// Sử dụng
async function process() {
  const data1 = await getData("item-1", true); // Có thể trả về đồng bộ
  const data2 = await getData("item-2", false); // Luôn trả về bất đồng bộ
}
```

## API Reference

Xem tài liệu chi tiết tại [API Documentation](../docs/libraries/common-types/common-types.md).

## Type Aliases

- [ArrayOrSingle](/libraries/common-types/TypeAlias.ArrayOrSingle.md)
- [Awaitable](/libraries/common-types/TypeAlias.Awaitable.md)
- [DeepPartial](/libraries/common-types/TypeAlias.DeepPartial.md)
- [DeepReadonly](/libraries/common-types/TypeAlias.DeepReadonly.md)
- [Dict](/libraries/common-types/TypeAlias.Dict.md)
- [EmptyObject](/libraries/common-types/TypeAlias.EmptyObject.md)
- [Entries](/libraries/common-types/TypeAlias.Entries.md)
- [ExcludeFromUnion](/libraries/common-types/TypeAlias.ExcludeFromUnion.md)
- [ExtractFromUnion](/libraries/common-types/TypeAlias.ExtractFromUnion.md)
- [KeysOf](/libraries/common-types/TypeAlias.KeysOf.md)
- [Maybe](/libraries/common-types/TypeAlias.Maybe.md)
- [NonEmptyArray](/libraries/common-types/TypeAlias.NonEmptyArray.md)
- [Nullable](/libraries/common-types/TypeAlias.Nullable.md)
- [Optional](/libraries/common-types/TypeAlias.Optional.md)
- [PartialFunction](/libraries/common-types/TypeAlias.PartialFunction.md)
- [PartialWithRequired](/libraries/common-types/TypeAlias.PartialWithRequired.md)
- [PlainObject](/libraries/common-types/TypeAlias.PlainObject.md)
- [Primitive](/libraries/common-types/TypeAlias.Primitive.md)
- [XOR](/libraries/common-types/TypeAlias.XOR.md)
