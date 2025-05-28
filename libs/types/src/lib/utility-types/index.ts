/**
 * @fileoverview Định nghĩa các utility types hỗ trợ
 * @since 1.0.0
 */

/**
 * Loại bỏ các kiểu từ một union type.
 *
 * Hữu ích khi bạn muốn loại bỏ một số kiểu cụ thể từ một union type.
 *
 * @template T - Union type cần loại bỏ các kiểu.
 * @template TU - Các kiểu cần loại bỏ khỏi union.
 *
 * @example
 * ```typescript
 * // Định nghĩa một union type
 * type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
 *
 * // Tạo một type mới chỉ chứa các phương thức không an toàn
 * type UnsafeHttpMethod = ExcludeFromUnion<HttpMethod, 'GET' | 'OPTIONS' | 'HEAD'>;
 * // Kết quả: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
 *
 * // Sử dụng trong hàm yêu cầu xác thực
 * function requiresAuthentication(method: UnsafeHttpMethod): boolean {
 *   return true; // Tất cả các phương thức không an toàn đều yêu cầu xác thực
 * }
 *
 * // Hợp lệ
 * requiresAuthentication('POST');
 * requiresAuthentication('DELETE');
 *
 * // Không hợp lệ, sẽ gây lỗi TypeScript
 * // requiresAuthentication('GET');
 * ```
 */
export type ExcludeFromUnion<T, TU> = T extends TU ? never : T;

/**
 * Trích xuất các kiểu từ một union type mà có thể gán được cho một kiểu cụ thể.
 *
 * Hữu ích khi bạn muốn lọc ra các kiểu phù hợp với một điều kiện nhất định.
 *
 * @template T - Union type cần trích xuất.
 * @template TU - Kiểu mà các phần tử của union cần phù hợp.
 *
 * @example
 * ```typescript
 * // Định nghĩa một số interface
 * interface WithId { id: string; }
 * interface WithName { name: string; }
 * interface WithEmail { email: string; }
 *
 * // Tạo một union type
 * type Entity = WithId | WithName | WithEmail | (WithId & WithName) | (WithId & WithEmail);
 *
 * // Trích xuất các kiểu có thuộc tính id
 * type EntityWithId = ExtractFromUnion<Entity, WithId>;
 * // Kết quả: WithId | (WithId & WithName) | (WithId & WithEmail)
 *
 * // Sử dụng trong hàm yêu cầu id
 * function processEntityWithId(entity: EntityWithId): void {
 *   console.log(`Xử lý entity có ID: ${entity.id}`);
 * }
 *
 * // Hợp lệ
 * processEntityWithId({ id: 'entity-1' });
 * processEntityWithId({ id: 'entity-2', name: 'Entity 2' });
 *
 * // Không hợp lệ, sẽ gây lỗi TypeScript
 * // processEntityWithId({ name: 'Entity 3' });
 * ```
 */
export type ExtractFromUnion<T, TU> = T extends TU ? T : never;

/**
 * Trích xuất các khóa của một kiểu dữ liệu.
 *
 * Đây là một alias cho `keyof T` nhưng với tên rõ ràng hơn về mục đích sử dụng.
 *
 * @template T - Kiểu dữ liệu cần trích xuất các khóa.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   age: number;
 * }
 *
 * // KeysOf<User> tương đương với 'id' | 'name' | 'email' | 'age'
 *
 * // Hàm truy cập thuộc tính động
 * function getProperty<T, K extends KeysOf<T>>(obj: T, key: K): T[K] {
 *   return obj[key];
 * }
 *
 * const user: User = { id: 'user-1', name: 'Nguyễn Văn A', email: 'a@example.com', age: 30 };
 *
 * // Sử dụng
 * const userName = getProperty(user, 'name'); // Kiểu dữ liệu: string
 * const userAge = getProperty(user, 'age'); // Kiểu dữ liệu: number
 *
 * // Không hợp lệ, sẽ gây lỗi TypeScript
 * // const invalid = getProperty(user, 'invalid');
 * ```
 */
export type KeysOf<T> = keyof T;

/**
 * Đại diện cho một kiểu cho phép hoặc T hoặc TU, nhưng không phải cả hai.
 *
 * Hữu ích khi bạn muốn đảm bảo rằng một đối tượng chỉ có thuộc tính từ một trong hai kiểu,
 * không phải là sự kết hợp của cả hai.
 *
 * @template T - Kiểu thứ nhất.
 * @template TU - Kiểu thứ hai.
 *
 * @example
 * ```typescript
 * // Định nghĩa hai interface không tương thích
 * interface LoginCredentials {
 *   email: string;
 *   password: string;
 * }
 *
 * interface SocialLoginCredentials {
 *   provider: 'google' | 'facebook' | 'github';
 *   token: string;
 * }
 *
 * // Tạo một type cho phép một trong hai loại đăng nhập, nhưng không phải cả hai
 * type AuthCredentials = XOR<LoginCredentials, SocialLoginCredentials>;
 *
 * // Hàm xử lý đăng nhập
 * function authenticate(credentials: AuthCredentials): void {
 *   if ('email' in credentials) {
 *     console.log(`Đăng nhập bằng email: ${credentials.email}`);
 *   } else {
 *     console.log(`Đăng nhập qua ${credentials.provider}`);
 *   }
 * }
 *
 * // Hợp lệ - đăng nhập bằng email/password
 * authenticate({ email: 'user@example.com', password: '123456' });
 *
 * // Hợp lệ - đăng nhập qua mạng xã hội
 * authenticate({ provider: 'google', token: 'google-token' });
 *
 * // Không hợp lệ - kết hợp cả hai
 * // authenticate({ email: 'user@example.com', password: '123456', provider: 'google', token: 'google-token' });
 * ```
 */
export type XOR<T, TU> = T | TU extends object
  ? T extends object
    ? { [P in Exclude<keyof T, keyof TU>]?: never } & TU
    : T
  : T | TU;
