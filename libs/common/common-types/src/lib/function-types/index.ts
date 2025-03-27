/**
 * @fileoverview Định nghĩa các type liên quan đến function
 * @since 1.0.0
 */

/**
 * Đại diện cho một giá trị có thể là kiểu T hoặc một Promise trả về T.
 *
 * Hữu ích cho các hàm có thể trả về giá trị đồng bộ hoặc bất đồng bộ.
 *
 * @template T - Kiểu dữ liệu của giá trị.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm có thể trả về kết quả đồng bộ hoặc bất đồng bộ
 * async function fetchData(id: string, useCache: boolean): Awaitable<User> {
 *   if (useCache && cache.has(id)) {
 *     // Trả về đồng bộ từ cache
 *     return cache.get(id);
 *   }
 *
 *   // Trả về bất đồng bộ từ API
 *   const user = await api.fetchUser(id);
 *   cache.set(id, user);
 *   return user;
 * }
 *
 * // Sử dụng hàm
 * const user1 = await fetchData('user-1', true); // Có thể trả về đồng bộ từ cache
 * const user2 = await fetchData('user-2', false); // Luôn trả về bất đồng bộ từ API
 * ```
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Đại diện cho một kiểu hàm với các tham số được áp dụng một phần.
 *
 * Hữu ích khi bạn muốn gọi một hàm với chỉ một số tham số, để các tham số còn lại là undefined.
 *
 * @template T - Một kiểu hàm mà các tham số của nó sẽ được áp dụng một phần.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm với nhiều tham số
 * function createUser(id: string, name: string, age: number, email: string): User {
 *   return { id, name, age, email };
 * }
 *
 * // Sử dụng PartialFunction để chỉ cung cấp một số tham số
 * const createPartialUser: PartialFunction<typeof createUser> = (id, name) => {
 *   // Các tham số không được cung cấp sẽ là undefined
 *   return createUser(id!, name!, 0, '');
 * };
 *
 * // Gọi hàm với chỉ một số tham số
 * const user = createPartialUser('user-1', 'Nguyễn Văn A');
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialFunction<T extends (...args: any[]) => any> = (
  ...args: Partial<Parameters<T>>
) => ReturnType<T>;
