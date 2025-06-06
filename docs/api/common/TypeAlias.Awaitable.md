# Type Alias: Awaitable\<T\>

> **Awaitable**\<`T`\> = `T` \| `Promise`\<`T`\>

Đại diện cho một giá trị có thể là kiểu T hoặc một Promise trả về T.

Hữu ích cho các hàm có thể trả về giá trị đồng bộ hoặc bất đồng bộ.

## Type Parameters

### T

`T`

Kiểu dữ liệu của giá trị.

## Example

```typescript
// Định nghĩa một hàm có thể trả về kết quả đồng bộ hoặc bất đồng bộ
async function fetchData(id: string, useCache: boolean): Awaitable<User> {
  if (useCache && cache.has(id)) {
    // Trả về đồng bộ từ cache
    return cache.get(id);
  }

  // Trả về bất đồng bộ từ API
  const user = await api.fetchUser(id);
  cache.set(id, user);
  return user;
}

// Sử dụng hàm
const user1 = await fetchData('user-1', true); // Có thể trả về đồng bộ từ cache
const user2 = await fetchData('user-2', false); // Luôn trả về bất đồng bộ từ API
```
