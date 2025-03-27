/**
 * @fileoverview Định nghĩa các type liên quan đến object
 * @since 1.0.0
 */

/**
 * Đệ quy làm tất cả các thuộc tính của một kiểu dữ liệu trở thành optional.
 *
 * Khác với `Partial<T>` của TypeScript, kiểu này áp dụng đệ quy cho tất cả các thuộc tính lồng nhau.
 *
 * @template T - Kiểu dữ liệu cần được biến đổi thành deeply partial.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   profile: {
 *     avatar: string;
 *     preferences: {
 *       theme: string;
 *       notifications: boolean;
 *     }
 *   }
 * }
 *
 * // Với Partial<User> thông thường, chỉ các thuộc tính cấp cao nhất là optional
 * const partialUser: Partial<User> = { name: 'Nguyễn Văn A' };
 * // Không hợp lệ: profile.preferences.theme không phải là optional
 * // partialUser.profile = { preferences: { } };
 *
 * // Với DeepPartial<User>, tất cả các thuộc tính lồng nhau đều là optional
 * const deepPartialUser: DeepPartial<User> = { name: 'Nguyễn Văn A' };
 * // Hợp lệ
 * deepPartialUser.profile = { preferences: { } };
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Đệ quy làm tất cả các thuộc tính của một kiểu object trở thành readonly.
 *
 * Khác với `Readonly<T>` của TypeScript, kiểu này áp dụng đệ quy cho tất cả các thuộc tính lồng nhau.
 *
 * @template T - Kiểu object cần được biến đổi thành deeply readonly.
 *
 * @example
 * ```typescript
 * interface Config {
 *   appName: string;
 *   settings: {
 *     timeout: number;
 *     retries: number;
 *   }
 * }
 *
 * // Khởi tạo một đối tượng Config
 * const config: DeepReadonly<Config> = {
 *   appName: 'Ecoma',
 *   settings: {
 *     timeout: 30000,
 *     retries: 3
 *   }
 * };
 *
 * // Các dòng sau sẽ gây lỗi TypeScript vì tất cả các thuộc tính đều readonly
 * // config.appName = 'New Name';
 * // config.settings.timeout = 60000;
 * ```
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Đại diện cho một dictionary với các khóa là string và giá trị có kiểu T.
 *
 * Hữu ích khi làm việc với các đối tượng được sử dụng như map/dictionary.
 *
 * @template T - Kiểu dữ liệu của các giá trị trong dictionary.
 *
 * @example
 * ```typescript
 * // Dictionary lưu trữ thông tin người dùng theo ID
 * const userCache: Dict<User> = {
 *   'user-1': { id: 'user-1', name: 'Nguyễn Văn A' },
 *   'user-2': { id: 'user-2', name: 'Trần Thị B' }
 * };
 *
 * // Truy cập một người dùng theo ID
 * const user = userCache['user-1'];
 *
 * // Thêm một người dùng mới
 * userCache['user-3'] = { id: 'user-3', name: 'Lê Văn C' };
 * ```
 */
export type Dict<T> = { [key: string]: T };

/**
 * Đại diện cho một đối tượng không có thuộc tính nào.
 *
 * Hữu ích khi bạn cần định nghĩa rõ ràng một đối tượng trống trong các định nghĩa kiểu.
 *
 * @example
 * ```typescript
 * // Định nghĩa một hàm không nhận tham số đầu vào
 * function initialize(options: EmptyObject = {}): void {
 *   console.log('Khởi tạo với đối tượng trống');
 * }
 *
 * // Sử dụng hợp lệ
 * initialize({});
 *
 * // Không hợp lệ, sẽ gây lỗi TypeScript
 * // initialize({ debug: true });
 * ```
 */
export type EmptyObject = Record<string, never>;

/**
 * Biến đổi một kiểu object T thành một union của các tuple,
 * mỗi tuple chứa một khóa của T và giá trị tương ứng.
 *
 * Hữu ích khi cần duyệt qua các cặp key-value của một object.
 *
 * @template T - Kiểu object cần được biến đổi.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   age: number;
 * }
 *
 * // Entries<User> tương đương với:
 * // ['id', string] | ['name', string] | ['age', number]
 *
 * function processUserEntries(entries: Entries<User>[]): void {
 *   entries.forEach(([key, value]) => {
 *     // key có thể là 'id', 'name', hoặc 'age'
 *     // value có kiểu tương ứng với key
 *     console.log(`${key}: ${value}`);
 *   });
 * }
 *
 * const user: User = { id: 'user-1', name: 'Nguyễn Văn A', age: 30 };
 * const entries = Object.entries(user) as Entries<User>[];
 * processUserEntries(entries);
 * ```
 */
export type Entries<T> = { [TK in keyof T]: [TK, T[TK]] }[keyof T];

/**
 * Đại diện cho một đối tượng đơn giản với các khóa là string và giá trị có thể là bất kỳ kiểu nào.
 *
 * Hữu ích khi làm việc với các đối tượng có cấu trúc không xác định hoặc động.
 *
 * @warning Nên hạn chế sử dụng kiểu này vì nó làm mất đi lợi ích của type checking.
 * Chỉ sử dụng khi thực sự cần thiết, như khi làm việc với dữ liệu JSON không xác định.
 *
 * @example
 * ```typescript
 * // Hàm xử lý dữ liệu từ API với cấu trúc không xác định
 * function processApiResponse(data: PlainObject): void {
 *   // Truy cập các thuộc tính một cách an toàn
 *   if (typeof data.status === 'string') {
 *     console.log(`Trạng thái: ${data.status}`);
 *   }
 *
 *   // Kiểm tra và xử lý dữ liệu động
 *   Object.keys(data).forEach(key => {
 *     console.log(`${key}: ${JSON.stringify(data[key])}`);
 *   });
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlainObject = { [key: string]: any };

/**
 * Một utility type làm tất cả các thuộc tính trong T trở thành optional,
 * ngoại trừ các thuộc tính được chỉ định trong TK vẫn giữ nguyên là required.
 *
 * Hữu ích khi bạn muốn một số thuộc tính bắt buộc nhưng các thuộc tính khác là tùy chọn.
 *
 * @template T - Kiểu dữ liệu cần được biến đổi.
 * @template TK - Các khóa của T cần giữ nguyên là required.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   age: number;
 *   address: string;
 * }
 *
 * // UserUpdateForm yêu cầu id bắt buộc, các trường khác là tùy chọn
 * type UserUpdateForm = PartialWithRequired<User, 'id'>;
 *
 * // Hợp lệ - chỉ cần cung cấp id
 * const update1: UserUpdateForm = { id: 'user-1' };
 *
 * // Hợp lệ - cung cấp id và một số trường khác
 * const update2: UserUpdateForm = {
 *   id: 'user-1',
 *   name: 'Nguyễn Văn A',
 *   email: 'a@example.com'
 * };
 *
 * // Không hợp lệ - thiếu id
 * // const update3: UserUpdateForm = { name: 'Nguyễn Văn A' };
 * ```
 */
export type PartialWithRequired<T, TK extends keyof T> = Partial<T> &
  Pick<T, TK>;
