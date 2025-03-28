import { ICommandUseCase } from '../../ports/input/use-case.interface';
import { AbstractCommandDTO } from '../../dtos/base.dto';
import { CommandError } from '../../errors';

export abstract class AbstractCommandUseCase<TCommand extends AbstractCommandDTO> implements ICommandUseCase<TCommand> {
  async execute(command: TCommand): Promise<void> {
    try {
      await this.validate(command);
      await this.handle(command);
    } catch (error: unknown) {
      if (error instanceof CommandError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new CommandError(`Failed to execute command: ${errorMessage}`);
    }
  }

  protected abstract validate(command: TCommand): Promise<void>;
  protected abstract handle(command: TCommand): Promise<void>;
}
