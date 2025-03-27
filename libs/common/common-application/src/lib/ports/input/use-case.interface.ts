export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export type ICommandUseCase<TCommand> = IUseCase<TCommand, void>;
export type IQueryUseCase<TQuery, TResult> = IUseCase<TQuery, TResult>;
