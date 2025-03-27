/**
 * @fileoverview Unit test cho BaseDto
 */
import { AbstractDTO } from "./base.dto";

describe("AbstractDTO", () => {
  it("nên khởi tạo được instance", () => {
    class TestDTO extends AbstractDTO {}
    const dto = new TestDTO({});
    expect(dto).toBeInstanceOf(TestDTO);
  });
}); 