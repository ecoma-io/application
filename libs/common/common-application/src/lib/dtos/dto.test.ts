/**
 * @fileoverview Unit test cho Dto
 */
import { IDataTransferObject } from "./dto";

describe("IDataTransferObject", () => {
  it("nên khởi tạo được instance", () => {
    class TestDto implements IDataTransferObject {}
    const dto = new TestDto();
    expect(dto).toBeInstanceOf(TestDto);
  });
}); 