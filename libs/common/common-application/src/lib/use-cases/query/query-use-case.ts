import { DomainError } from "@ecoma/common-domain";
import { PlainObject } from "@ecoma/common-types";
import { validateSync } from "class-validator";
import { ApplicationError, ApplicationValidationError } from "../../errors";

export abstract class AbstractQueryUseCase<TQuery extends PlainObject> {
  async execute(query: TQuery): Promise<void> {
    try {
      this.validate(query);
      await this.handle(query);
    } catch (error: unknown) {
      if (error instanceof DomainError || error instanceof ApplicationError) {
        throw error;
      } else {
        throw new ApplicationError("Unknown error occurred", undefined, error);
      }
    }
  }

  protected validate(command: TQuery) {
    const errors = validateSync(command, {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      throw new ApplicationValidationError(
        "Validation error",
        undefined,
        errors
      );
    }
  }
  protected abstract handle(command: TQuery): Promise<void>;
}
