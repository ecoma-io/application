import { UnauthorizedError } from './unauthorized.error';

describe('UnauthorizedError', () => {
  it('Khởi tạo đúng thông tin lỗi', () => {
    const error = new UnauthorizedError('user-1');
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('not authorized');
    expect(error.name).toBe('UnauthorizedError');
    expect(error.details).toEqual({ userId: 'user-1' });
  });


});
