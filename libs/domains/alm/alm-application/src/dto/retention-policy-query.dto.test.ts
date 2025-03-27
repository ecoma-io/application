import {
  CriteriaQueryPaginationDTO,
  CriteriaQuerySortDTO,
} from "@ecoma/common-application";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RetentionPolicyQueryDto } from "./retention-policy-query.dto";

describe("RetentionPolicyQueryDto - class-validator hoạt động", () => {
  it("Hợp lệ: Không truyền gì vào vẫn hợp lệ (vì tất cả đều optional)", async () => {
    const dto = new RetentionPolicyQueryDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("Không hợp lệ: Truyền sort direction sai", async () => {
    const dto = new RetentionPolicyQueryDto();
    dto.sorts = plainToInstance(CriteriaQuerySortDTO, [
      { field: "createdAt", direction: "INVALID" },
    ]);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("Không hợp lệ: Truyền paginationType sai", async () => {
    const dto = new RetentionPolicyQueryDto();
    dto.pagination = plainToInstance(CriteriaQueryPaginationDTO, {
      paginationType: "PAGE",
      limit: 10,
      offset: 0,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
