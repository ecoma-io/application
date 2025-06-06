/**
 * @fileoverview Định nghĩa các type liên quan đến primitive types
 * @since 1.0.0
 */

/**
 * Đại diện cho các kiểu dữ liệu nguyên thủy trong TypeScript.
 *
 * Kiểu này bao gồm các kiểu nguyên thủy sau:
 * - `string`
 * - `number`
 * - `boolean`
 * - `symbol`
 * - `bigint`
 *
 * @example
 * ```typescript
 * // Hàm chỉ chấp nhận các giá trị nguyên thủy
 * function isPrimitive(value: unknown): value is Primitive {
 *   const type = typeof value;
 *   return (
 *     type === 'string' ||
 *     type === 'number' ||
 *     type === 'boolean' ||
 *     type === 'symbol' ||
 *     type === 'bigint'
 *   );
 * }
 *
 * // Sử dụng
 * console.log(isPrimitive('hello')); // true
 * console.log(isPrimitive(42)); // true
 * console.log(isPrimitive(true)); // true
 * console.log(isPrimitive(Symbol('id'))); // true
 * console.log(isPrimitive(BigInt(123))); // true
 *
 * console.log(isPrimitive({})); // false
 * console.log(isPrimitive([])); // false
 * console.log(isPrimitive(null)); // false
 * console.log(isPrimitive(undefined)); // false
 * ```
 */
export type Primitive = string | number | boolean | symbol | bigint;

/**
 * Đại diện cho một giá trị có thể là kiểu T hoặc null.
 *
 * Hữu ích khi một giá trị có thể không tồn tại (null) trong ngữ cảnh nhất định.
 *
 * @template T - Kiểu dữ liệu của giá trị có thể là nullable.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm có thể trả về null khi không tìm thấy kết quả
 * function findUser(id: string): Nullable<User> {
 *   const user = database.findById(id);
 *   return user || null;
 * }
 *
 * // Sử dụng với kiểm tra null
 * const user = findUser('user-1');
 * if (user !== null) {
 *   console.log(`Tìm thấy người dùng: ${user.name}`);
 * } else {
 *   console.log('Không tìm thấy người dùng');
 * }
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Đại diện cho một kiểu có thể là kiểu T hoặc undefined.
 *
 * Hữu ích cho các trường hợp một giá trị có thể có hoặc không.
 *
 * @template T - Kiểu dữ liệu của giá trị có thể hiện diện.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm trả về undefined khi không tìm thấy kết quả
 * function getUserPreference(userId: string, key: string): Optional<string> {
 *   const user = getUser(userId);
 *   return user?.preferences?.[key];
 * }
 *
 * // Sử dụng với optional chaining
 * const theme = getUserPreference('user-1', 'theme') ?? 'default';
 * console.log(`Theme: ${theme}`);
 * ```
 */
export type Optional<T> = T | undefined;

/**
 * Đại diện cho một kiểu có thể là Nullable hoặc Optional.
 *
 * Kết hợp cả hai kiểu Nullable và Optional, cho phép một giá trị có thể là T, null, hoặc undefined.
 *
 * @template T - Kiểu dữ liệu của giá trị có thể là Maybe.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm có thể trả về giá trị, null, hoặc undefined
 * function getConfigValue(key: string): Maybe<string> {
 *   if (!configExists()) return undefined; // Config chưa được khởi tạo
 *
 *   const value = config.get(key);
 *   return value === '' ? null : value; // Trả về null cho giá trị rỗng
 * }
 *
 * // Sử dụng với kiểm tra đầy đủ
 * const value = getConfigValue('api.url');
 * if (value !== null && value !== undefined) {
 *   console.log(`Giá trị cấu hình: ${value}`);
 * } else if (value === null) {
 *   console.log('Giá trị cấu hình rỗng');
 * } else {
 *   console.log('Cấu hình chưa được khởi tạo');
 * }
 * ```
 */
export type Maybe<T> = Nullable<T> | Optional<T>;
