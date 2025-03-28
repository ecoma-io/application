import { IQueryUseCase } from '../../ports/input/use-case.interface';
import { AbstractQueryDTO, AbstractResponseDTO } from '../../dtos/base.dto';
import { QueryError } from '../../errors';

export abstract class AbstractQueryUseCase<TQuery extends AbstractQueryDTO, TResult extends AbstractResponseDTO>
  implements IQueryUseCase<TQuery, TResult> {

  async execute(query: TQuery): Promise<TResult> {
    try {
      await this.validate(query);
      return await this.handle(query);
    } catch (error: unknown) {
      if (error instanceof QueryError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new QueryError(`Failed to execute query: ${errorMessage}`);
    }
  }

  protected abstract validate(query: TQuery): Promise<void>;
  protected abstract handle(query: TQuery): Promise<TResult>;
}
