import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  CriteriaQueryDTO,
  CriteriaQueryFilterDTO,
  CriteriaQueryLogicalDTO,
  CriteriaQueryPaginationDTO,
  CriteriaQuerySortDTO,
  PaginationType,
  SortDirection,
} from "./criteria-query.dto";

describe("CriteriaQueryDTO", () => {
  describe("Kiểm tra logic lọc (filter)", () => {
    it("Hợp lệ: Lọc đơn giản với 1 điều kiện", async () => {
      const filter = new CriteriaQueryFilterDTO();
      filter.field = "status";
      filter.operator = "=";
      filter.value = "active";
      const dto = new CriteriaQueryDTO();
      dto.filters = new CriteriaQueryLogicalDTO();
      dto.filters.and = [filter];
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: Lọc lồng nhau với AND/OR", async () => {
      const filter1 = new CriteriaQueryFilterDTO();
      filter1.field = "status";
      filter1.operator = "=";
      filter1.value = "active";
      const filter2 = new CriteriaQueryFilterDTO();
      filter2.field = "age";
      filter2.operator = ">";
      filter2.value = 18;
      const orGroup = new CriteriaQueryLogicalDTO();
      orGroup.or = [filter2];
      const andGroup = new CriteriaQueryLogicalDTO();
      andGroup.and = [filter1, orGroup];
      const dto = new CriteriaQueryDTO();
      dto.filters = andGroup;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: Lọc phủ định (NOT)", async () => {
      const filter = new CriteriaQueryFilterDTO();
      filter.field = "deleted";
      filter.operator = "=";
      filter.value = false;
      const notGroup = new CriteriaQueryLogicalDTO();
      notGroup.not = filter;
      const dto = new CriteriaQueryDTO();
      dto.filters = notGroup;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: Lọc lồng ghép sâu nhiều cấp (5 cấp)", async () => {
      const group: CriteriaQueryLogicalDTO = new CriteriaQueryLogicalDTO();
      let current = group;
      for (let i = 0; i < 5; i++) {
        const next = new CriteriaQueryLogicalDTO();
        current.and = [next];
        current = next;
      }
      const filter = new CriteriaQueryFilterDTO();
      filter.field = "deep";
      filter.operator = "=";
      filter.value = "ok";
      current.and = [filter];
      const dto = new CriteriaQueryDTO();
      dto.filters = group;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: filter là undefined hoặc null", async () => {
      let dto = new CriteriaQueryDTO();
      dto.filters = undefined;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);
      dto = new CriteriaQueryDTO();
      dto.filters = null as any;
      errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: filter thiếu trường bắt buộc (field/operator)", async () => {
      const filter = new CriteriaQueryFilterDTO();
      // thiếu field và operator
      const dto = new CriteriaQueryDTO();
      dto.filters = new CriteriaQueryLogicalDTO();
      dto.filters.and = [filter];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: filter field/operator là chuỗi rỗng", async () => {
      const filter = new CriteriaQueryFilterDTO();
      filter.field = "";
      filter.operator = "";
      filter.value = "test";
      const dto = new CriteriaQueryDTO();
      dto.filters = new CriteriaQueryLogicalDTO();
      dto.filters.and = [filter];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: filter field/operator là null/undefined/số/object", async () => {
      const filter = new CriteriaQueryFilterDTO();
      filter.field = null as any;
      filter.operator = undefined as any;
      filter.value = "test";
      const dto = new CriteriaQueryDTO();
      dto.filters = new CriteriaQueryLogicalDTO();
      dto.filters.and = [filter];
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      // số
      filter.field = 123 as any;
      filter.operator = 456 as any;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      // object
      filter.field = { foo: "bar" } as any;
      filter.operator = { bar: "baz" } as any;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: filter là object lạ không phải DTO", async () => {
      const dto = new CriteriaQueryDTO();
      dto.filters = plainToInstance(CriteriaQueryLogicalDTO, {
        foo: "bar",
      } as any) as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: filter logic group chỉ có and/or là mảng rỗng", async () => {
      const group = new CriteriaQueryLogicalDTO();
      group.and = [];
      group.or = [];
      const dto = new CriteriaQueryDTO();
      dto.filters = group;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);
      group.and = [new CriteriaQueryFilterDTO()];
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // vì filter thiếu field/operator
    });

    it("Không hợp lệ: filter logic group and/or chứa phần tử null/undefined", async () => {
      const group = new CriteriaQueryLogicalDTO();
      group.and = [null as any, undefined as any];
      const dto = new CriteriaQueryDTO();
      dto.filters = group;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Hợp lệ: filter logic group chỉ có not", async () => {
      const filter = new CriteriaQueryFilterDTO();
      filter.field = "deleted";
      filter.operator = "=";
      filter.value = false;
      const group = new CriteriaQueryLogicalDTO();
      group.not = filter;
      const dto = new CriteriaQueryDTO();
      dto.filters = group;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: filter là non-filter object", async () => {
      const dto = new CriteriaQueryDTO();
      dto.filters = plainToInstance(CriteriaQueryLogicalDTO, {
        foo: "bar",
      } as any) as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Kiểm tra logic sắp xếp (sort) và phân trang (pagination)", () => {
    it("Hợp lệ: Sắp xếp và phân trang đúng định dạng", async () => {
      const sort = new CriteriaQuerySortDTO();
      sort.field = "createdAt";
      sort.direction = SortDirection.DESC;
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.OFFSET;
      pagination.limit = 10;
      pagination.offset = 0;
      const dto = new CriteriaQueryDTO();
      dto.sorts = [sort];
      dto.pagination = pagination;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: Giá trị direction của sort không hợp lệ", async () => {
      const sort = new CriteriaQuerySortDTO();
      sort.field = "createdAt";
      sort.direction = "invalid" as any;
      const dto = new CriteriaQueryDTO();
      dto.sorts = [sort];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: Giá trị paginationType không hợp lệ", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = "page" as any;
      pagination.limit = 10;
      pagination.offset = 0 as any;
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Hợp lệ: sorts là mảng rỗng", async () => {
      const dto = new CriteriaQueryDTO();
      dto.sorts = [];
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: sorts là undefined", async () => {
      const dto = new CriteriaQueryDTO();
      dto.sorts = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: pagination.limit > 100 hoặc < 1", async () => {
      let dto = plainToInstance(CriteriaQueryDTO, {
        pagination: {
          paginationType: PaginationType.OFFSET,
          limit: 101,
          offset: 0,
        },
      });
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        pagination: {
          paginationType: PaginationType.OFFSET,
          limit: 0,
          offset: 0,
        },
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: sorts chứa phần tử null/undefined", async () => {
      const dto = new CriteriaQueryDTO();
      dto.sorts = [null, undefined] as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Hợp lệ: pagination là undefined hoặc null", async () => {
      let dto = new CriteriaQueryDTO();
      dto.pagination = undefined;
      let errors = await validate(dto);
      expect(errors.length).toBe(0);
      dto = new CriteriaQueryDTO();
      dto.pagination = null as any;
      errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: sorts chứa phần tử hợp lệ và không hợp lệ", async () => {
      const validSort = new CriteriaQuerySortDTO();
      validSort.field = "createdAt";
      validSort.direction = SortDirection.ASC;
      const dto = new CriteriaQueryDTO();
      dto.sorts = [validSort, null as any];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: sorts chứa object không phải sort", async () => {
      const dto = new CriteriaQueryDTO();
      dto.sorts = plainToInstance(CriteriaQuerySortDTO, [
        { foo: "bar" } as any,
      ]) as any;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Kiểm tra logic phân trang nâng cao", () => {
    it("Hợp lệ: after/before là string khi paginationType là cursor", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.CURSOR;
      pagination.after = "abc";
      pagination.before = "def";
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Không hợp lệ: after/before là string khi paginationType là offset", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.OFFSET;
      pagination.after = "abc";
      pagination.before = "def";
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: after/before là number/object/null khi paginationType là cursor", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.CURSOR;
      pagination.after = 123 as any;
      pagination.before = { foo: "bar" } as any;
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.after = null as any;
      pagination.before = null as any;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: offset là số âm, số thực, NaN, Infinity khi paginationType là offset", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.OFFSET;
      pagination.limit = 10;
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      pagination.offset = -1;
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.offset = 1.5;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.offset = NaN;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.offset = Infinity;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: offset là undefined khi paginationType là offset", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.OFFSET;
      pagination.limit = 10;
      // pagination.offset = undefined;
      const dto = new CriteriaQueryDTO();
      dto.pagination = pagination;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: limit không hợp lệ", async () => {
      const pagination = new CriteriaQueryPaginationDTO();
      pagination.paginationType = PaginationType.OFFSET;
      pagination.offset = 1;
      const dto = new CriteriaQueryDTO();
      pagination.limit = "abc" as any;
      dto.pagination = pagination;
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.limit = -1;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.limit = 1.5;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.limit = NaN;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      pagination.limit = Infinity;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: paginationType là số, object, boolean", async () => {
      let dto = plainToInstance(CriteriaQueryDTO, {
        pagination: { paginationType: 123, limit: 10, offset: 1 },
      });
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        pagination: { paginationType: {}, limit: 10, offset: 1 },
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        pagination: { paginationType: true, limit: 10, offset: 1 },
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("Không hợp lệ: offset là string", async () => {
      const dto = plainToInstance(CriteriaQueryDTO, {
        pagination: {
          paginationType: PaginationType.OFFSET,
          limit: 10,
          offset: "abc",
        },
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Kiểm tra enum và giá trị không hợp lệ", () => {
    it("Không hợp lệ: direction/paginationType là null, số, object", async () => {
      let dto = plainToInstance(CriteriaQueryDTO, {
        sorts: [{ field: "createdAt", direction: null }],
      });
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        sorts: [{ field: "createdAt", direction: 123 }],
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        pagination: { paginationType: null, limit: 10, offset: 0 },
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      dto = plainToInstance(CriteriaQueryDTO, {
        pagination: { paginationType: {}, limit: 10, offset: 0 },
      });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Kiểm tra edge case & đặc biệt", () => {
    it("Hợp lệ: DTO có tất cả trường undefined/null", async () => {
      const dto = new CriteriaQueryDTO();
      dto.filters = null as any;
      dto.sorts = null as any;
      dto.pagination = null as any;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("Hợp lệ: Bỏ qua trường thừa trong DTO", async () => {
      const dto = plainToInstance(CriteriaQueryDTO, {
        filters: undefined,
        sorts: undefined,
        pagination: undefined,
        extraField: "should be ignored",
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
