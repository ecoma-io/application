export abstract class AbstractApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class UseCaseError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class CommandError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class QueryError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}
