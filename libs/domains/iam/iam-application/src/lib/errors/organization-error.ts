import { IamApplicationError } from './iam-application-error';

/**
 * Lớp lỗi cho Organization.
 */
export class OrganizationError extends IamApplicationError {
  /**
   * Tạo một lỗi Organization mới.
   * @param message - Thông báo lỗi
   * @param statusCode - Mã HTTP nếu liên quan đến HTTP, mặc định là 400
   */
  constructor(message: string, statusCode = 400) {
    super(message, 'ORGANIZATION_ERROR', statusCode);
    this.name = 'OrganizationError';
  }
}

/**
 * Lớp lỗi cho tên tổ chức đã tồn tại.
 */
export class OrganizationNameAlreadyExistsError extends OrganizationError {
  /**
   * Tạo một lỗi tên tổ chức đã tồn tại mới.
   * @param name - Tên tổ chức đã tồn tại
   */
  constructor(name: string) {
    super(`Tổ chức với tên "${name}" đã tồn tại`);
    this.name = 'OrganizationNameAlreadyExistsError';
  }
}

/**
 * Lớp lỗi cho slug tổ chức đã tồn tại.
 */
export class OrganizationSlugAlreadyExistsError extends OrganizationError {
  /**
   * Tạo một lỗi slug tổ chức đã tồn tại mới.
   * @param slug - Slug tổ chức đã tồn tại
   */
  constructor(slug: string) {
    super(`Tổ chức với slug "${slug}" đã tồn tại`);
    this.name = 'OrganizationSlugAlreadyExistsError';
  }
}

/**
 * Lớp lỗi cho không tìm thấy tổ chức.
 */
export class OrganizationNotFoundError extends OrganizationError {
  /**
   * Tạo một lỗi không tìm thấy tổ chức mới.
   * @param identifier - Định danh tổ chức (ID, slug, v.v.)
   */
  constructor(identifier?: string) {
    super(
      identifier
        ? `Không tìm thấy tổ chức với định danh: ${identifier}`
        : 'Không tìm thấy tổ chức',
      404
    );
    this.name = 'OrganizationNotFoundError';
  }
}

/**
 * Lớp lỗi cho người dùng không phải thành viên của tổ chức.
 */
export class NotOrganizationMemberError extends OrganizationError {
  /**
   * Tạo một lỗi người dùng không phải thành viên của tổ chức mới.
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức
   */
  constructor(userId: string, organizationId: string) {
    super(`Người dùng ${userId} không phải là thành viên của tổ chức ${organizationId}`, 403);
    this.name = 'NotOrganizationMemberError';
  }
} 