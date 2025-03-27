import {
  CriteriaQueryFilterDTO,
  CriteriaQueryLogicalDTO,
  CriteriaQueryPaginationDTO,
  CriteriaQuerySortDTO,
  CursorPagination,
  SortDirection,
} from "@ecoma/common-application";
import { Document, Model } from "mongoose";

/**
 * Type định nghĩa cho MongoDB query để tăng cường type safety
 */
export type MongoQuery = Record<string, unknown>;

/**
 * Các helpers hỗ trợ xây dựng và xử lý truy vấn MongoDB
 */
export class MongoQueryHelpers {
  /**
   * Xây dựng MongoDB sort options từ các tiêu chí sắp xếp
   * @param sorts Danh sách các tùy chọn sắp xếp
   * @returns Record chứa tùy chọn sắp xếp cho MongoDB
   */
  static buildSortOptions(
    sorts?: CriteriaQuerySortDTO[]
  ): Record<string, 1 | -1> {
    const result: Record<string, 1 | -1> = {};

    if (sorts && sorts.length) {
      for (const sortOption of sorts) {
        result[sortOption.field] =
          sortOption.direction === SortDirection.ASC ? 1 : -1;
      }
    }

    return result;
  }

  /**
   * Xây dựng MongoDB filter từ một CriteriaQueryFilterDTO
   * @param filter Filter cần chuyển đổi
   * @returns MongoDB filter expression
   */
  static buildFilterExpression(filter: CriteriaQueryFilterDTO): MongoQuery {
    if (!filter.field || filter.value === undefined) return {};

    const result: MongoQuery = {};

    switch (filter.operator?.toUpperCase()) {
      case "=":
        result[filter.field] = filter.value;
        break;
      case "!=":
        result[filter.field] = { $ne: filter.value };
        break;
      case ">":
        result[filter.field] = { $gt: filter.value };
        break;
      case ">=":
        result[filter.field] = { $gte: filter.value };
        break;
      case "<":
        result[filter.field] = { $lt: filter.value };
        break;
      case "<=":
        result[filter.field] = { $lte: filter.value };
        break;
      case "IN":
        result[filter.field] = {
          $in: Array.isArray(filter.value) ? filter.value : [filter.value],
        };
        break;
      case "NIN":
        result[filter.field] = {
          $nin: Array.isArray(filter.value) ? filter.value : [filter.value],
        };
        break;
      case "CONTAINS":
        result[filter.field] = { $regex: filter.value, $options: "i" };
        break;
      case "STARTSWITH":
        result[filter.field] = { $regex: `^${filter.value}`, $options: "i" };
        break;
      case "ENDSWITH":
        result[filter.field] = { $regex: `${filter.value}$`, $options: "i" };
        break;
      case "LIKE":
        {
          // Convert SQL LIKE pattern (%) to MongoDB regex pattern
          const likePattern = String(filter.value).replace(/%/g, ".*");
          result[filter.field] = { $regex: likePattern, $options: "" };
        }
        break;
      case "ILIKE":
        {
          // Case-insensitive LIKE
          const ilikePattern = String(filter.value).replace(/%/g, ".*");
          result[filter.field] = { $regex: ilikePattern, $options: "i" };
        }
        break;
      case "NOT_LIKE":
        {
          const notLikePattern = String(filter.value).replace(/%/g, ".*");
          result[filter.field] = { $not: { $regex: notLikePattern } };
        }
        break;
      case "NOT_ILIKE":
        {
          const notIlikePattern = String(filter.value).replace(/%/g, ".*");
          result[filter.field] = {
            $not: { $regex: notIlikePattern, $options: "i" },
          };
        }
        break;
      case "BETWEEN":
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          result[filter.field] = {
            $gte: filter.value[0],
            $lte: filter.value[1],
          };
        }
        break;
      default:
        // Mặc định sẽ là equals
        result[filter.field] = filter.value;
    }

    return result;
  }

  /**
   * Xây dựng MongoDB query từ cấu trúc filters phức tạp
   * @param filters Cấu trúc filters (logical hoặc filter đơn)
   * @returns MongoDB query
   */
  static buildMongoQuery(
    filters?: CriteriaQueryLogicalDTO | CriteriaQueryFilterDTO
  ): MongoQuery {
    if (!filters) return {};

    // Kiểm tra xem đây có phải là filter đơn hay không
    if ("field" in filters && "operator" in filters) {
      return this.buildFilterExpression(filters as CriteriaQueryFilterDTO);
    }

    // Xử lý logic operators (AND/OR/NOT)
    const result: MongoQuery = {};
    const logicalFilters = filters as CriteriaQueryLogicalDTO;

    // Xử lý AND
    if (logicalFilters.and && logicalFilters.and.length) {
      const andConditions = logicalFilters.and
        .map((filter) => {
          if ("field" in filter && "operator" in filter) {
            return this.buildFilterExpression(filter as CriteriaQueryFilterDTO);
          }
          return this.buildMongoQuery(filter);
        })
        .filter((condition) => Object.keys(condition).length > 0);

      if (andConditions.length > 0) {
        // Nếu chỉ có một điều kiện và không có toán tử phức tạp, trả về trực tiếp để đơn giản hóa query
        if (andConditions.length === 1) {
          return andConditions[0];
        }
        result["$and"] = andConditions;
      }
    }

    // Xử lý OR
    if (logicalFilters.or && logicalFilters.or.length) {
      const orConditions = logicalFilters.or
        .map((filter) => {
          if ("field" in filter && "operator" in filter) {
            return this.buildFilterExpression(filter as CriteriaQueryFilterDTO);
          }
          return this.buildMongoQuery(filter);
        })
        .filter((condition) => Object.keys(condition).length > 0);

      if (orConditions.length > 0) {
        result["$or"] = orConditions;
      }
    }

    // Xử lý NOT
    if (logicalFilters.not) {
      let notCondition;
      if ("field" in logicalFilters.not && "operator" in logicalFilters.not) {
        notCondition = this.buildFilterExpression(
          logicalFilters.not as CriteriaQueryFilterDTO
        );
      } else {
        notCondition = this.buildMongoQuery(logicalFilters.not);
      }

      if (Object.keys(notCondition).length > 0) {
        result["$nor"] = [notCondition];
      }
    }

    return result;
  }

  /**
   * Áp dụng phân trang vào truy vấn MongoDB
   * @param model Model mongoose
   * @param query Truy vấn ban đầu
   * @param sort Tùy chọn sắp xếp
   * @param pagination Thông tin phân trang
   * @returns Kết quả sau khi áp dụng phân trang
   */
  static async applyPagination<TDocument extends Document>(
    model: Model<TDocument>,
    query: MongoQuery,
    sort: Record<string, 1 | -1>,
    pagination?: CriteriaQueryPaginationDTO
  ): Promise<{
    docs: TDocument[];
    total: number;
    afterCursor?: string;
    beforeCursor?: string;
  }> {
    // Tính tổng số bản ghi
    const total = await model.countDocuments(query);

    // Số lượng bản ghi tối đa cho mỗi trang
    const limit = Math.max(1, Number(pagination?.limit) || 20);

    let docs: TDocument[];
    let afterCursor: string | undefined;
    let beforeCursor: string | undefined;

    // Xử lý phân trang
    if (pagination?.paginationType === "cursor") {
      // Cursor-based pagination yêu cầu phải có trường sắp xếp
      if (Object.keys(sort).length === 0) {
        throw new Error(
          "Cursor-based pagination requires at least one sort field"
        );
      }

      // Lấy trường sắp xếp đầu tiên - dùng làm cơ sở cho cursor
      const firstSortField = Object.keys(sort)[0];
      const sortDirection = sort[firstSortField];

      // Mở rộng query dựa trên cursor
      const modifiedQuery = CursorPagination.buildQueryWithCursor(
        query,
        pagination.after,
        firstSortField,
        sortDirection
      );

      // Thực hiện truy vấn với điều kiện cursor
      docs = await model
        .find(modifiedQuery)
        .sort(sort)
        .limit(limit + 1); // +1 để kiểm tra có trang tiếp theo không

      // Nếu có nhiều hơn limit bản ghi, tạo cursor cho trang tiếp theo
      if (docs.length > limit) {
        const lastDoc = docs[limit - 1]; // Bản ghi cuối cùng của trang hiện tại

        // Tạo cursor mới từ giá trị của trường sắp xếp
        const cursorValue = lastDoc.get(firstSortField);
        afterCursor = CursorPagination.encodeCursor(
          firstSortField,
          cursorValue
        );

        // Loại bỏ bản ghi thừa đã dùng để kiểm tra
        docs = docs.slice(0, limit);
      }

      // Nếu có bản ghi và cần cursor trước đó
      if (docs.length > 0) {
        const firstDoc = docs[0];
        const cursorValue = firstDoc.get(firstSortField);
        beforeCursor = CursorPagination.encodeCursor(
          firstSortField,
          cursorValue
        );
      }
    } else {
      // Offset-based pagination (mặc định)
      const offset = Math.max(0, Number(pagination?.offset) || 0);

      docs = await model.find(query).sort(sort).skip(offset).limit(limit);
    }

    return {
      docs,
      total,
      afterCursor,
      beforeCursor,
    };
  }
}
