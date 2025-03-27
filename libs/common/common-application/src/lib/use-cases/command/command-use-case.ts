import { DomainError } from "@ecoma/common-domain";
import { PlainObject } from "@ecoma/common-types";
import { validateSync } from "class-validator";
import { GenericResult } from "../../dtos";
import { ApplicationError, ApplicationValidationError } from "../../errors";

export abstract class AbstractCommandUseCase<
  TCommand extends PlainObject,
  TResult extends GenericResult<unknown> | void
> {
  public async execute(command: TCommand): Promise<void> {
    try {
      this.validate(command);
      await this.handle(command);
    } catch (error: unknown) {
      if (error instanceof DomainError || error instanceof ApplicationError) {
        throw error;
      } else {
        throw new ApplicationError("Unknown error occurred", undefined, error);
      }
    }
  }

  protected validate(command: TCommand) {
    const errors = validateSync(command as object, {
      skipMissingProperties: false,
      forbidUnknownValues: false,
      whitelist: true,
      forbidNonWhitelisted: false,
      validationError: { target: false, value: true },
    });

    if (errors.length > 0) {
      throw new ApplicationValidationError(
        "Validation error",
        undefined,
        errors
      );
    }
  }

  protected abstract handle(command: TCommand): Promise<TResult>;
}
