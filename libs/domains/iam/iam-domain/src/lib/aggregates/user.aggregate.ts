import { AbstractAggregate, Email, Result } from '@ecoma/common-domain';
import { v4 as uuidv4 } from 'uuid';
import {
  UserProfile,
  UserStatus
} from '../value-objects';

/**
 * Aggregate Root đại diện cho một người dùng trong hệ thống.
 */
export class User extends AbstractAggregate<any> {
  /**
   * Email của người dùng.
   */
  private $email!: Email;

  /**
   * Hash của mật khẩu.
   */
  private $passwordHash!: string;

  /**
   * Trạng thái người dùng.
   */
  private $status!: UserStatus;

  /**
   * Thông tin hồ sơ cơ bản của người dùng.
   */
  private $profile!: UserProfile;

  /**
   * Token dùng cho quy trình đặt lại mật khẩu.
   */
  private $passwordResetToken?: string;

  /**
   * Thời điểm hết hạn của token đặt lại mật khẩu.
   */
  private $passwordResetTokenExpiresAt?: Date;

  /**
   * Token dùng cho quy trình xác minh email.
   */
  private $emailVerificationToken?: string;

  /**
   * Thời điểm hết hạn của token xác minh email.
   */
  private $emailVerificationTokenExpiresAt?: Date;

  /**
   * Thời điểm tạo người dùng.
   */
  private $createdAt!: Date;

  /**
   * Thời điểm cập nhật người dùng lần cuối.
   */
  private $updatedAt!: Date;

  // Getters

  public get email(): Email {
    return this.$email;
  }

  public get passwordHash(): string {
    return this.$passwordHash;
  }

  public get status(): UserStatus {
    return this.$status;
  }

  public get profile(): UserProfile {
    return this.$profile;
  }

  public get passwordResetToken(): string | undefined {
    return this.$passwordResetToken;
  }

  public get passwordResetTokenExpiresAt(): Date | undefined {
    return this.$passwordResetTokenExpiresAt;
  }

  public get emailVerificationToken(): string | undefined {
    return this.$emailVerificationToken;
  }

  public get emailVerificationTokenExpiresAt(): Date | undefined {
    return this.$emailVerificationTokenExpiresAt;
  }

  public get createdAt(): Date {
    return this.$createdAt;
  }

  public get updatedAt(): Date {
    return this.$updatedAt;
  }

  /**
   * Constructor riêng tư. Sử dụng các phương thức factory để tạo thực thể.
   */
  private constructor(id: string) {
    super(id);
  }

  /**
   * Factory method để tạo người dùng mới.
   */
  public static register(
    email: Email,
    passwordHash: string,
    profile: UserProfile,
    requireEmailVerification = true
  ): Result<User> {
    try {
      const user = new User(uuidv4());
      const now = new Date();

      user.$email = email;
      user.$passwordHash = passwordHash;
      user.$profile = profile;
      user.$createdAt = now;
      user.$updatedAt = now;

      // Nếu cần xác minh email, đặt trạng thái Pending và tạo token
      if (requireEmailVerification) {
        user.$status = UserStatus.PENDING_CONFIRMATION;
        user.generateEmailVerificationToken();
      } else {
        user.$status = UserStatus.ACTIVE;
      }

      return Result.ok(user);
    } catch (error) {
      return Result.fail<User>((error as Error).message);
    }
  }

  /**
   * Tạo token xác minh email mới và đặt thời gian hết hạn.
   */
  public generateEmailVerificationToken(): void {
    this.$emailVerificationToken = uuidv4();

    // Token có hiệu lực trong 24 giờ
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    this.$emailVerificationTokenExpiresAt = expiresAt;
    this.$updatedAt = new Date();
  }

  /**
   * Xác minh email dựa trên token đã cung cấp.
   */
  public verifyEmail(token: string): Result<void> {
    // Kiểm tra xem token có khớp không
    if (!this.$emailVerificationToken || this.$emailVerificationToken !== token) {
      return Result.fail('Token xác minh email không hợp lệ');
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (!this.$emailVerificationTokenExpiresAt ||
        this.$emailVerificationTokenExpiresAt < new Date()) {
      return Result.fail('Token xác minh email đã hết hạn');
    }

    // Kiểm tra xem người dùng có đang trong trạng thái chờ xác nhận không
    if (this.$status !== UserStatus.PENDING_CONFIRMATION) {
      return Result.fail('Người dùng không ở trạng thái chờ xác nhận email');
    }

    // Cập nhật trạng thái và xóa token
    this.$status = UserStatus.ACTIVE;
    this.$emailVerificationToken = undefined;
    this.$emailVerificationTokenExpiresAt = undefined;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Đặt token đặt lại mật khẩu và thời gian hết hạn.
   */
  public requestPasswordReset(): Result<string> {
    // Chỉ cho phép đặt lại mật khẩu nếu tài khoản đang active
    if (this.$status !== UserStatus.ACTIVE) {
      return Result.fail('Chỉ tài khoản đang hoạt động mới có thể yêu cầu đặt lại mật khẩu');
    }

    const resetToken = uuidv4();

    // Token có hiệu lực trong 1 giờ
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    this.$passwordResetToken = resetToken;
    this.$passwordResetTokenExpiresAt = expiresAt;
    this.$status = UserStatus.PASSWORD_RESET_REQUESTED;
    this.$updatedAt = new Date();

    return Result.ok(resetToken);
  }

  /**
   * Đặt lại mật khẩu dựa trên token đã cung cấp.
   */
  public resetPassword(token: string, newPasswordHash: string): Result<void> {
    // Kiểm tra xem token có khớp không
    if (!this.$passwordResetToken || this.$passwordResetToken !== token) {
      return Result.fail('Token đặt lại mật khẩu không hợp lệ');
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (!this.$passwordResetTokenExpiresAt ||
        this.$passwordResetTokenExpiresAt < new Date()) {
      return Result.fail('Token đặt lại mật khẩu đã hết hạn');
    }

    // Kiểm tra xem người dùng có đang trong trạng thái yêu cầu đặt lại mật khẩu không
    if (this.$status !== UserStatus.PASSWORD_RESET_REQUESTED) {
      return Result.fail('Người dùng không ở trạng thái yêu cầu đặt lại mật khẩu');
    }

    // Cập nhật mật khẩu và xóa token
    this.$passwordHash = newPasswordHash;
    this.$passwordResetToken = undefined;
    this.$passwordResetTokenExpiresAt = undefined;
    this.$status = UserStatus.ACTIVE;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Cập nhật thông tin hồ sơ người dùng.
   */
  public updateProfile(profile: UserProfile): Result<void> {
    this.$profile = profile;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Đổi mật khẩu người dùng.
   */
  public changePassword(newPasswordHash: string): Result<void> {
    this.$passwordHash = newPasswordHash;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Vô hiệu hóa tài khoản người dùng.
   */
  public deactivate(): Result<void> {
    if (this.$status === UserStatus.INACTIVE) {
      return Result.fail('Tài khoản đã ở trạng thái không hoạt động');
    }

    this.$status = UserStatus.INACTIVE;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Kích hoạt lại tài khoản người dùng.
   */
  public activate(): Result<void> {
    if (this.$status !== UserStatus.INACTIVE) {
      return Result.fail('Chỉ có tài khoản không hoạt động mới có thể được kích hoạt lại');
    }

    this.$status = UserStatus.ACTIVE;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Khôi phục một đối tượng User từ dữ liệu lưu trữ.
   */
  public static restore(data: {
    id: string;
    email: Email;
    passwordHash: string;
    status: UserStatus;
    profile: UserProfile;
    passwordResetToken?: string;
    passwordResetTokenExpiresAt?: Date;
    emailVerificationToken?: string;
    emailVerificationTokenExpiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    const user = new User(data.id);

    user.$email = data.email;
    user.$passwordHash = data.passwordHash;
    user.$status = data.status;
    user.$profile = data.profile;
    user.$passwordResetToken = data.passwordResetToken;
    user.$passwordResetTokenExpiresAt = data.passwordResetTokenExpiresAt;
    user.$emailVerificationToken = data.emailVerificationToken;
    user.$emailVerificationTokenExpiresAt = data.emailVerificationTokenExpiresAt;
    user.$createdAt = data.createdAt;
    user.$updatedAt = data.updatedAt;

    return user;
  }

  /**
   * Lấy ID của User
   */
  public getId(): string {
    return this.id.toString();
  }
}
