/**
 * @fileoverview Unit test cho QueryBus implementation
 * @since 1.0.0
 */

import { IQueryBus } from './query-bus';
import { IQuery } from './query';
import { IQueryHandler } from './query-handler';
import { QueryBus } from './query-bus.impl';

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

describe('QueryBus', () => {
  let queryBus: IQueryBus;

  beforeEach(() => {
    queryBus = new QueryBus();
  });

  /**
   * Test việc đăng ký query handler
   */
  describe('register', () => {
    it('nên đăng ký query handler thành công', () => {
      const handler = new TestQueryHandler();
      expect(() => queryBus.register(TestQuery, handler)).not.toThrow();
    });

    it('nên throw lỗi khi đăng ký handler cho cùng một query hai lần', () => {
      const handler = new TestQueryHandler();
      queryBus.register(TestQuery, handler);
      expect(() => queryBus.register(TestQuery, handler)).toThrow();
    });
  });

  /**
   * Test việc thực thi query
   */
  describe('execute', () => {
    it('nên thực thi query thành công và trả về kết quả', async () => {
      const handler = new TestQueryHandler();
      const handleSpy = jest.spyOn(handler, 'handle');

      queryBus.register(TestQuery, handler);
      const query = new TestQuery('test-data');

      const result = await queryBus.execute<TestQuery, string>(query);

      expect(handleSpy).toHaveBeenCalledWith(query);
      expect(result).toBe('Processed: test-data');
    });

    it('nên throw lỗi khi không có handler được đăng ký cho query', async () => {
      const query = new TestQuery('test-data');
      await expect(queryBus.execute(query)).rejects.toThrow();
    });

    it('nên truyền lỗi từ query handler', async () => {
      const handler = new TestQueryHandler();
      const error = new Error('Lỗi từ handler');

      jest.spyOn(handler, 'handle').mockRejectedValue(error);

      queryBus.register(TestQuery, handler);
      const query = new TestQuery('test-data');

      await expect(queryBus.execute(query)).rejects.toThrow(error);
    });
  });
});
