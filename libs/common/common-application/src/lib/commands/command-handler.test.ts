/**
 * @fileoverview Unit test cho CommandHandler implementation
 * @since 1.0.0
 */

import { ICommand } from './command';
import { ICommandHandler } from './command-handler';

/**
 * Command test để sử dụng trong unit test
 */
class TestCommand implements ICommand {
  constructor(
    public readonly data: string,
    public readonly version = '1.0.0',
    public readonly traceId?: string,
    public readonly language?: string
  ) {}
}

/**
 * Command handler test để sử dụng trong unit test
 */
class TestCommandHandler implements ICommandHandler<TestCommand, string> {
  public async handle(command: TestCommand): Promise<string> {
    return `Processed: ${command.data}`;
  }
}

describe('CommandHandler', () => {
  let handler: TestCommandHandler;

  beforeEach(() => {
    handler = new TestCommandHandler();
  });

  /**
   * Test việc thực thi command handler
   */
  describe('handle', () => {
    it('nên thực thi command thành công và trả về kết quả', async () => {
      const command = new TestCommand('test-data');
      const result = await handler.handle(command);
      expect(result).toBe('Processed: test-data');
    });

    it('nên xử lý command bất đồng bộ', async () => {
      const command = new TestCommand('test-data');
      const result = await handler.handle(command);
      expect(result).toBe('Processed: test-data');
    });

    it('nên throw lỗi khi xử lý command thất bại', async () => {
      const command = new TestCommand('test-data');
      const error = new Error('Lỗi xử lý command');
      jest.spyOn(handler, 'handle').mockRejectedValue(error);
      await expect(handler.handle(command)).rejects.toThrow(error);
    });
  });
});
