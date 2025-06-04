import { HttpException, HttpStatus } from '@nestjs/common';

export class TemplateNotFoundException extends HttpException {
  constructor() {
    super('Template not found', HttpStatus.NOT_FOUND);
  }
}

export class TemplateAlreadyExistsException extends HttpException {
  constructor() {
    super('Template with this name already exists', HttpStatus.CONFLICT);
  }
}
