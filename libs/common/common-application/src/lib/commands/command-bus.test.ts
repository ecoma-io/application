/**
 * @fileoverview Unit test cho CommandBus implementation
 * @since 1.0.0
 */

import { ICommandBus } from './command-bus';
import { ICommand } from './command';
import { ICommandHandler } from './command-handler';
import { CommandBus } from './command-bus.impl';

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

describe('CommandBus', () => {
  let commandBus: ICommandBus;

  beforeEach(() => {
    commandBus = new CommandBus();
  });

  /**
   * Test việc đăng ký command handler
   */
  describe('register', () => {
    it('nên đăng ký command handler thành công', () => {
      const handler = new TestCommandHandler();
      expect(() => commandBus.register(TestCommand, handler)).not.toThrow();
    });

    it('nên throw lỗi khi đăng ký handler cho cùng một command hai lần', () => {
      const handler = new TestCommandHandler();
      commandBus.register(TestCommand, handler);
      expect(() => commandBus.register(TestCommand, handler)).toThrow();
    });
  });

  /**
   * Test việc thực thi command
   */
  describe('execute', () => {
    it('nên thực thi command thành công và trả về kết quả', async () => {
      const handler = new TestCommandHandler();
      const handleSpy = jest.spyOn(handler, 'handle');

      commandBus.register(TestCommand, handler);
      const command = new TestCommand('test-data');

      const result = await commandBus.execute<TestCommand, string>(command);

      expect(handleSpy).toHaveBeenCalledWith(command);
      expect(result).toBe('Processed: test-data');
    });

    it('nên throw lỗi khi không có handler được đăng ký cho command', async () => {
      const command = new TestCommand('test-data');
      await expect(commandBus.execute(command)).rejects.toThrow();
    });

    it('nên truyền lỗi từ command handler', async () => {
      const handler = new TestCommandHandler();
      const error = new Error('Lỗi từ handler');

      jest.spyOn(handler, 'handle').mockRejectedValue(error);

      commandBus.register(TestCommand, handler);
      const command = new TestCommand('test-data');

      await expect(commandBus.execute(command)).rejects.toThrow(error);
    });
  });
});
