import { IamApplicationError } from './iam-application-error';

/**
 * Cơ sở cho các lỗi liên quan đến session
 */
export abstract class AbstractSessionError extends IamApplicationError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Lỗi khi session không tìm thấy
 */
export class SessionNotFoundError extends AbstractSessionError {
  constructor(sessionId?: string) {
    const message = sessionId
      ? `Session with id ${sessionId} not found`
      : 'Session not found';
    super(message);
  }
}
