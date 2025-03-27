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

#### Array Types

```typescript
import { ArrayOrSingle, NonEmptyArray } from "@ecoma/common-types";

function processIds(ids: ArrayOrSingle<string>): void {
  const idArray = Array.isArray(ids) ? ids : [ids];
  idArray.forEach((id) => console.log(`Xử lý ID: ${id}`));
}

const ids: NonEmptyArray<number> = [1, 2, 3];
```

#### Object Types

```typescript
import { DeepPartial, DeepReadonly, Dict, EmptyObject, Entries, PlainObject, PartialWithRequired } from "@ecoma/common-types";

interface Config {
  server: { port: number; host: string };
  database: { url: string };
}

const partial: DeepPartial<Config> = { server: { port: 8080 } };
const readonlyConfig: DeepReadonly<Config> = { server: { port: 8080, host: "localhost" }, database: { url: "..." } };
const dict: Dict<number> = { a: 1, b: 2 };
const empty: EmptyObject = {};
const entries: Entries<Config> = Object.entries(readonlyConfig) as Entries<Config>;
const plain: PlainObject = { foo: "bar" };
const partialWithRequired: PartialWithRequired<Config, "server"> = { server: { port: 80, host: "" } };
```

#### Function Types

```typescript
import { Awaitable, PartialFunction } from "@ecoma/common-types";

const fn: PartialFunction<string, number> = (input) => (input ? input.length : undefined);

async function getData(id: string): Awaitable<string> {
  return id;
}
```

#### Primitive Types

```typescript
import { Primitive, Nullable, Optional, Maybe } from "@ecoma/common-types";

const value: Primitive = "hello";
const nullable: Nullable<number> = null;
const optional: Optional<string> = undefined;
const maybe: Maybe<boolean> = Math.random() > 0.5 ? true : undefined;
```

#### Utility Types

```typescript
import { ExcludeFromUnion, ExtractFromUnion, KeysOf, XOR } from "@ecoma/common-types";

type A = { a: string };
type B = { b: number };
type OnlyA = ExcludeFromUnion<A | B, B>; // { a: string }
type OnlyB = ExtractFromUnion<A | B, B>; // { b: number }
type Keys = KeysOf<A | B>; // "a" | "b"
type Either = XOR<A, B>;
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
