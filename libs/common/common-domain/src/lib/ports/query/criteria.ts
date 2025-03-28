/**
 * @description Định nghĩa các kiểu dữ liệu nguyên thủy được hỗ trợ trong giá trị lọc.
 * @type {string | number | boolean | symbol | bigint | Date} Bao gồm các kiểu cơ bản và Date.
 */
export type Primitive = string | number | boolean | symbol | bigint | Date;

/**
 * @description Kiểu helper biểu diễn một giá trị có thể là T hoặc null.
 * @template T Kiểu dữ liệu cần wrap
 */
export type Nullable<T> = T | null;

// --- Định nghĩa các loại Toán tử Lọc ---

/**
 * @description Định nghĩa các toán tử so sánh cơ bản.
 * @type {'=' | '!=' | '>' | '>=' | '<' | '<='}
 */
export type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=';

/**
 * @description Định nghĩa các toán tử kiểm tra sự bao gồm trong tập hợp.
 * @type {'IN' | 'NOT_IN'} VALUE cho các toán tử này PHẢI LÀ MẢNG.
 */
export type InclusionOperator = 'IN' | 'NOT_IN';

/**
 * @description Định nghĩa các toán tử so khớp chuỗi (LIKE/ILIKE - case-insensitive LIKE).
 * @type {'LIKE' | 'NOT_LIKE' | 'ILIKE' | 'NOT_ILIKE'} VALUE cho các toán tử này PHẢI LÀ CHUỖI (pattern).
 */
export type StringOperator = 'LIKE' | 'NOT_LIKE' | 'ILIKE' | 'NOT_ILIKE';

/**
 * @description Định nghĩa các toán tử kiểm tra giá trị null.
 * @type {'IS_NULL' | 'IS_NOT_NULL'} KHÔNG CÓ VALUE cho các toán tử này.
 */
export type NullOperator = 'IS_NULL' | 'IS_NOT_NULL';

/**
 * @description Định nghĩa toán tử cho khoảng giá trị (bao gồm cả hai đầu).
 * @type {'BETWEEN'} VALUE cho toán tử này PHẢI LÀ MẢNG 2 phần tử [giá trị thấp, giá trị cao].
 */
export type RangeOperator = 'BETWEEN';

/**
 * @description Định nghĩa các toán tử cho truy vấn không gian địa lý cơ bản.
 * @type {'WITHIN_DISTANCE'} VALUE cho các toán tử này có cấu trúc phức tạp hơn.
 */
export type GeospatialOperator = 'WITHIN_DISTANCE';

/**
 * @description Tập hợp tất cả các toán tử lọc được hỗ trợ.
 * @type {ComparisonOperator | InclusionOperator | StringOperator | NullOperator | RangeOperator | GeospatialOperator}
 */
export type FilterOperator =
    | ComparisonOperator
    | InclusionOperator
    | StringOperator
    | NullOperator
    | RangeOperator
    | GeospatialOperator;


// --- Định nghĩa các Interface cho VALUE của Toán tử Geospatial ---

/**
 * @description Interface định nghĩa một điểm tọa độ địa lý
 * @interface IPoint
 */
export interface IPoint {
    /** @description Vĩ độ của điểm */
    lat: number;
    /** @description Kinh độ của điểm */
    lng: number;
}

/**
 * @description Interface định nghĩa giá trị cho toán tử WITHIN_DISTANCE
 * @interface IWithinDistanceValue
 */
export interface IWithinDistanceValue {
    /** @description Điểm trung tâm để tính khoảng cách */
    point: IPoint;
    /** @description Khoảng cách cần kiểm tra */
    distance: number;
    /** @description Đơn vị khoảng cách (ví dụ: 'km', 'miles' - tùy chọn) */
    unit?: string;
}


// --- Các Interface định nghĩa một điều kiện lọc đơn lẻ dựa trên Operator ---

/**
 * @description Điều kiện lọc dùng các toán tử so sánh (so sánh 1-1).
 * @interface IComparisonCondition
 */
export interface IComparisonCondition {
    /** @description Tên trường cần so sánh */
    field: string;
    /** @description Toán tử so sánh */
    operator: ComparisonOperator;
    /** @description Giá trị so sánh */
    value: Nullable<Primitive>;
}

/**
 * @description Điều kiện lọc dùng các toán tử tập hợp (kiểm tra giá trị nằm trong/không nằm trong tập hợp).
 * @interface IInclusionCondition
 */
export interface IInclusionCondition {
    /** @description Tên trường cần kiểm tra */
    field: string;
    /** @description Toán tử tập hợp */
    operator: InclusionOperator;
    /** @description Mảng các giá trị cần kiểm tra */
    value: Array<Nullable<Primitive>>;
}

/**
 * @description Điều kiện lọc dùng các toán tử chuỗi (so khớp pattern).
 * @interface IStringCondition
 */
export interface IStringCondition {
    /** @description Tên trường cần so khớp */
    field: string;
    /** @description Toán tử chuỗi */
    operator: StringOperator;
    /** @description Pattern cần so khớp */
    value: string;
}

/**
 * @description Điều kiện lọc dùng các toán tử kiểm tra null.
 * @interface INullCheckCondition
 */
export interface INullCheckCondition {
    /** @description Tên trường cần kiểm tra null */
    field: string;
    /** @description Toán tử kiểm tra null */
    operator: NullOperator;
}

/**
 * @description Điều kiện lọc dùng toán tử khoảng giá trị.
 * @interface IRangeCondition
 */
export interface IRangeCondition {
    /** @description Tên trường cần kiểm tra */
    field: string;
    /** @description Toán tử khoảng */
    operator: RangeOperator;
    /** @description Mảng 2 phần tử [giá trị thấp, giá trị cao] */
    value: [Primitive, Primitive];
}

/**
 * @description Điều kiện lọc dùng toán tử không gian địa lý.
 * @interface IGeospatialCondition
 */
export interface IGeospatialCondition {
    /** @description Tên trường chứa dữ liệu địa lý */
    field: string;
    /** @description Toán tử địa lý */
    operator: GeospatialOperator;
    /** @description Giá trị điều kiện địa lý */
    value: IWithinDistanceValue;
}


/**
 * @description Kiểu của một điều kiện lọc đơn lẻ (lá trong cây tiêu chí).
 * @type {IComparisonCondition | IInclusionCondition | IStringCondition | INullCheckCondition | IRangeCondition | IGeospatialCondition}
 */
export type FilterCondition =
    | IComparisonCondition
    | IInclusionCondition
    | IStringCondition
    | INullCheckCondition
    | IRangeCondition
    | IGeospatialCondition;


// --- Interface định nghĩa nhóm tiêu chí kết hợp bằng toán tử logic ---

/**
 * @description Đại diện cho một nhóm các tiêu chí con được kết hợp bằng toán tử logic (AND, OR, NOT).
 * @interface ILogicalCriteria
 */
export interface ILogicalCriteria {
    /** @description Mảng các tiêu chí kết hợp bằng AND */
    and?: FilterCriteria[];
    /** @description Mảng các tiêu chí kết hợp bằng OR */
    or?: FilterCriteria[];
    /** @description Tiêu chí phủ định (NOT) */
    not?: FilterCriteria;
}

/**
 * @description Kiểu đệ quy định nghĩa cấu trúc của toàn bộ tiêu chí lọc.
 * @type {FilterCondition | ILogicalCriteria} Có thể là một điều kiện đơn lẻ hoặc một nhóm logic.
 */
export type FilterCriteria = FilterCondition | ILogicalCriteria;