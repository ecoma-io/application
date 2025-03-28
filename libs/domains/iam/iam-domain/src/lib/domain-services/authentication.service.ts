import { Result, Email } from '@ecoma/common-domain';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../entities/session.entity';
import { User } from '../aggregates/user.aggregate';
import { ISessionRepository, IUserRepository, IMembershipRepository } from '../interfaces';

/**
 * Domain Service xử lý quy trình đăng nhập, xác minh thông tin xác thực, tạo và quản lý Token/Session.
 * Sử dụng Session Token Stateful để hỗ trợ:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 *
 * @since 1.0.0
 */
export class AuthenticationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly membershipRepository: IMembershipRepository
  ) {}

  /**
   * Xác thực người dùng dựa trên email và mật khẩu.
   *
   * @param email - Email của người dùng
   * @param password - Mật khẩu chưa hash
   * @param passwordHasher - Hàm để hash và so sánh mật khẩu
   * @returns Promise<Result<User>> - Kết quả chứa người dùng nếu xác thực thành công
   */
  public async authenticate(
    email: string,
    password: string,
    passwordHasher: (password: string, hash: string) => Promise<boolean>
  ): Promise<Result<User>> {
    try {
      // Tìm người dùng theo email
      const emailObj = new Email(email);
      const user = await this.userRepository.findByEmail(emailObj);
      if (!user) {
        return Result.fail<User>('Email hoặc mật khẩu không chính xác');
      }

      // Kiểm tra trạng thái người dùng
      if (user.status !== 'Active') {
        return Result.fail<User>('Tài khoản không hoạt động');
      }

      // Xác thực mật khẩu
      const isPasswordValid = await passwordHasher(password, user.passwordHash);
      if (!isPasswordValid) {
        return Result.fail<User>('Email hoặc mật khẩu không chính xác');
      }

      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail<User>((error as Error).message);
    }
  }

  /**
   * Tạo phiên làm việc mới cho người dùng.
   *
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức (null nếu là phiên nội bộ)
   * @param sessionDurationInHours - Thời gian hiệu lực của phiên (giờ)
   * @returns Promise<Result<Session>> - Kết quả chứa phiên làm việc mới
   */
  public async createSession(
    userId: string,
    organizationId: string | null,
    sessionDurationInHours = 24
  ): Promise<Result<Session>> {
    try {
      // Nếu là phiên tổ chức, kiểm tra xem người dùng có phải là thành viên của tổ chức không
      if (organizationId) {
        const membership = await this.membershipRepository.findByUserIdAndOrganizationId(userId, organizationId);
        if (!membership) {
          return Result.fail<Session>('Người dùng không phải là thành viên của tổ chức');
        }
      } else {
        // Nếu là phiên nội bộ, kiểm tra xem người dùng có vai trò nội bộ không
        const internalMemberships = await this.membershipRepository.findInternalMemberships();
        const userInternalMembership = internalMemberships.find(m => m.getUserId === userId);
        if (!userInternalMembership) {
          return Result.fail<Session>('Người dùng không có quyền truy cập nội bộ');
        }
      }

      // Tạo token và thời gian hết hạn
      const token = uuidv4();
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setHours(expiresAt.getHours() + sessionDurationInHours);

      // Tạo phiên làm việc mới với lastActiveAt là thời điểm hiện tại
      const session = new Session(
        uuidv4(),
        userId,
        organizationId,
        token,
        expiresAt,
        now,
        now
      );

      // Lưu phiên làm việc
      await this.sessionRepository.save(session);

      return Result.ok<Session>(session);
    } catch (error) {
      return Result.fail<Session>((error as Error).message);
    }
  }

  /**
   * Xác thực token và lấy thông tin phiên làm việc.
   * Cập nhật lastActiveAt thành thời điểm hiện tại nếu token hợp lệ.
   *
   * @param token - Token phiên làm việc
   * @returns Promise<Result<Session>> - Kết quả chứa phiên làm việc nếu token hợp lệ
   */
  public async validateToken(token: string): Promise<Result<Session>> {
    try {
      const session = await this.sessionRepository.findByToken(token);
      if (!session) {
        return Result.fail<Session>('Token không hợp lệ');
      }

      if (session.isExpired()) {
        return Result.fail<Session>('Phiên làm việc đã hết hạn');
      }

      // Cập nhật thời điểm hoạt động cuối cùng
      session.updateLastActiveAt();
      await this.sessionRepository.save(session);

      return Result.ok<Session>(session);
    } catch (error) {
      return Result.fail<Session>((error as Error).message);
    }
  }

  /**
   * Kết thúc phiên làm việc (đăng xuất).
   *
   * @param token - Token phiên làm việc
   * @returns Promise<Result<void>> - Kết quả thành công hoặc thất bại
   */
  public async terminateSession(token: string): Promise<Result<void>> {
    try {
      const session = await this.sessionRepository.findByToken(token);
      if (!session) {
        return Result.fail<void>('Token không hợp lệ');
      }

      session.terminate();
      await this.sessionRepository.save(session);

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>((error as Error).message);
    }
  }

  /**
   * Kết thúc tất cả phiên làm việc của một người dùng.
   * Hỗ trợ đăng xuất tất cả phiên từ xa, quan trọng khi cần vô hiệu hóa tài khoản.
   *
   * @param userId - ID của người dùng
   * @returns Promise<Result<number>> - Kết quả chứa số lượng phiên làm việc đã kết thúc
   */
  public async terminateAllUserSessions(userId: string): Promise<Result<number>> {
    try {
      const sessionsRemoved = await this.sessionRepository.deleteByUserId(userId);
      return Result.ok<number>(sessionsRemoved);
    } catch (error) {
      return Result.fail<number>((error as Error).message);
    }
  }

  /**
   * Kết thúc tất cả phiên làm việc của một tổ chức.
   * Quan trọng khi cần vô hiệu hóa tổ chức ngay lập tức.
   *
   * @param organizationId - ID của tổ chức
   * @returns Promise<Result<number>> - Kết quả chứa số lượng phiên làm việc đã kết thúc
   */
  public async terminateAllOrganizationSessions(organizationId: string): Promise<Result<number>> {
    try {
      const sessionsRemoved = await this.sessionRepository.deleteByOrganizationId(organizationId);
      return Result.ok<number>(sessionsRemoved);
    } catch (error) {
      return Result.fail<number>((error as Error).message);
    }
  }

  /**
   * Lấy tất cả các phiên làm việc của một người dùng.
   *
   * @param userId - ID của người dùng
   * @returns Promise<Result<Session[]>> - Kết quả chứa danh sách các phiên làm việc
   */
  public async getUserSessions(userId: string): Promise<Result<Session[]>> {
    try {
      const sessions = await this.sessionRepository.findByUserId(userId);
      return Result.ok<Session[]>(sessions);
    } catch (error) {
      return Result.fail<Session[]>((error as Error).message);
    }
  }
}
