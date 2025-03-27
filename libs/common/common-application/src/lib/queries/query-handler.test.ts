/**
 * @fileoverview Unit test cho QueryHandler implementation
 * @since 1.0.0
 */

import { IQuery } from './query';
import { IQueryHandler } from './query-handler';

/**
 * Query test để sử dụng trong unit test
 */
class TestQuery implements IQuery {
  constructor(
    public readonly data: string,
    public readonly version = '1.0.0',
    public readonly traceId?: string,
    public readonly language?: string
  ) {}
}

/**
 * Query handler test để sử dụng trong unit test
 */
class TestQueryHandler implements IQueryHandler<TestQuery, string> {
  public async handle(query: TestQuery): Promise<string> {
    return `Processed: ${query.data}`;
  }
}

describe('QueryHandler', () => {
  let handler: TestQueryHandler;

  beforeEach(() => {
    handler = new TestQueryHandler();
  });

  /**
   * Test việc thực thi query handler
   */
  describe('handle', () => {
    it('nên thực thi query thành công và trả về kết quả', async () => {
      const query = new TestQuery('test-data');
      const result = await handler.handle(query);
      expect(result).toBe('Processed: test-data');
    });

    it('nên xử lý query bất đồng bộ', async () => {
      const query = new TestQuery('test-data');
      const result = await handler.handle(query);
      expect(result).toBe('Processed: test-data');
    });

    it('nên throw lỗi khi xử lý query thất bại', async () => {
      const query = new TestQuery('test-data');
      const error = new Error('Lỗi xử lý query');
      jest.spyOn(handler, 'handle').mockRejectedValue(error);
      await expect(handler.handle(query)).rejects.toThrow(error);
    });
  });
});
