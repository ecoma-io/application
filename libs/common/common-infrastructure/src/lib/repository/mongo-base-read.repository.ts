import { CriteriaQueryDTO, IReadRepository } from "@ecoma/common-application";
import {
  AbstractAggregate,
  AbstractId,
  IEntityProps,
} from "@ecoma/common-domain";
import { Document, Model } from "mongoose";
import { MongoQueryHelpers } from "../mongodb/mongo-query.helpers";

/**
 * Lớp cơ sở cho các repository đọc dữ liệu từ MongoDB
 */
export abstract class AbstractMongoReadRepository<
  TDocument extends Document,
  TId extends AbstractId,
  TProps extends IEntityProps<TId>,
  TAggregateRoot extends AbstractAggregate<TId, TProps>
> implements IReadRepository<TId, TProps, TAggregateRoot>
{
  /**
   * Constructor
   * @param model Model MongoDB
   */
  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Đếm số lượng aggregate roots theo tiêu chí
   * @param specification Tiêu chí tìm kiếm
   * @returns Số lượng aggregate roots tìm được
   */
  async count(specification: CriteriaQueryDTO): Promise<number> {
    const query = MongoQueryHelpers.buildMongoQuery(specification.filters);
    return this.model.countDocuments(query);
  }

  /**
   * Kiểm tra sự tồn tại của aggregate root theo ID
   * @param id ID của aggregate root
   * @returns true nếu aggregate root tồn tại, false nếu không tồn tại
   */
  async exists(id: TId): Promise<boolean> {
    return this.model.exists({ id: id.toString() }) !== null;
  }

  /**
   * Tìm kiếm aggregate root theo ID
   * @param id ID của aggregate root
   * @returns Aggregate root tìm được hoặc null nếu không tìm thấy
   */
  async findById(id: TId): Promise<TAggregateRoot | null> {
    const doc = await this.model.findOne<TDocument>({
      id: id.toString(),
    });
    return doc ? this.toDomainModel(doc) : null;
  }

  /**
   * Tìm kiếm aggregate roots theo tiêu chí
   * @param specification Tiêu chí tìm kiếm
   * @returns Danh sách aggregate roots tìm được
   */
  async find(specification: CriteriaQueryDTO): Promise<{
    items: TAggregateRoot[];
    total: number;
    afterCursor?: string;
    beforeCursor?: string;
  }> {
    // Xây dựng query từ filters
    let query = MongoQueryHelpers.buildMongoQuery(specification.filters);

    // Hook để các lớp con có thể tùy chỉnh query trước khi thực thi
    query = this.customizeQuery(query, specification);

    // Xây dựng options sắp xếp
    const sort = MongoQueryHelpers.buildSortOptions(specification.sorts);

    // Áp dụng phân trang và thực hiện truy vấn
    const result = await MongoQueryHelpers.applyPagination(
      this.model,
      query,
      sort,
      specification.pagination
    );

    // Ánh xạ kết quả sang domain model
    return {
      items: result.docs.map((doc) => this.toDomainModel(doc)),
      total: result.total,
      afterCursor: result.afterCursor,
      beforeCursor: result.beforeCursor,
    };
  }

  /**
   * Hook cho phép lớp con tùy chỉnh query trước khi thực thi
   * @param query Query ban đầu
   * @param _specification Tiêu chí tìm kiếm
   * @returns Query đã được tùy chỉnh
   */
  protected customizeQuery(
    query: Record<string, any>,
    _specification: CriteriaQueryDTO
  ): Record<string, any> {
    return query; // Mặc định không tùy chỉnh gì
  }

  /**
   * Chuyển đổi từ document sang domain model
   * @param doc Document từ MongoDB
   * @returns Domain model
   */
  protected abstract toDomainModel(doc: TDocument): TAggregateRoot;
}
