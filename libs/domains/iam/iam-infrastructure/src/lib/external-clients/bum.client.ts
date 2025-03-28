import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IBumClient, ISubscriptionEntitlementDetails } from '@ecoma/iam-application';
import { ILogger } from '@ecoma/common-application';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

/**
 * Triển khai client giao tiếp với BUM Bounded Context.
 */
@Injectable()
export class BumClient implements IBumClient {
  /**
   * Thời gian chờ mặc định cho các cuộc gọi RPC (mili giây).
   */
  private readonly defaultTimeoutMs: number = 5000;

  /**
   * Constructor.
   * @param bumClient - NATS client để giao tiếp với BUM service
   * @param logger - Logger service
   */
  constructor(
    @Inject('BUM')
    private readonly bumClient: ClientProxy,
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {
    this.logger.debug('Khởi tạo BumClient');
  }

  /**
   * Lấy thông tin quyền lợi tính năng của tổ chức.
   * @param organizationId - ID của tổ chức
   * @returns Promise<ISubscriptionEntitlementDetails[]> - Danh sách quyền lợi tính năng
   */
  async getOrganizationEntitlements(organizationId: string): Promise<ISubscriptionEntitlementDetails[]> {
    this.logger.debug('Lấy thông tin quyền lợi tính năng của tổ chức', { organizationId });

    try {
      const entitlements = await firstValueFrom(
        this.bumClient
          .send<ISubscriptionEntitlementDetails[]>(
            'bum.subscription.get-entitlements',
            { organizationId }
          )
          .pipe(timeout(this.defaultTimeoutMs))
      );

      this.logger.debug('Đã nhận thông tin quyền lợi tính năng của tổ chức', {
        organizationId,
        entitlementsCount: entitlements.length
      });

      return entitlements;
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error('Hết thời gian chờ khi lấy quyền lợi tính năng của tổ chức', error, {
          organizationId,
          timeoutMs: this.defaultTimeoutMs
        });
        throw new Error(`Hết thời gian chờ phản hồi từ BUM service: ${error.message}`);
      }

      this.logger.error('Lỗi khi lấy thông tin quyền lợi tính năng của tổ chức', error as Error, {
        organizationId,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Kiểm tra xem tổ chức có quyền lợi tính năng cụ thể không.
   * @param organizationId - ID của tổ chức
   * @param featureType - Loại tính năng cần kiểm tra
   * @returns Promise<boolean> - true nếu có quyền lợi và quyền lợi đang hoạt động
   */
  async hasFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean> {
    this.logger.debug('Kiểm tra quyền lợi tính năng của tổ chức', {
      organizationId,
      featureType
    });

    try {
      const hasEntitlement = await firstValueFrom(
        this.bumClient
          .send<boolean>(
            'bum.subscription.has-feature',
            { organizationId, featureType }
          )
          .pipe(timeout(this.defaultTimeoutMs))
      );

      this.logger.debug('Kết quả kiểm tra quyền lợi tính năng', {
        organizationId,
        featureType,
        hasEntitlement
      });

      return hasEntitlement;
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error('Hết thời gian chờ khi kiểm tra quyền lợi tính năng', error, {
          organizationId,
          featureType,
          timeoutMs: this.defaultTimeoutMs
        });
        // Trong trường hợp timeout, nên trả về false an toàn thay vì throw exception
        return false;
      }

      this.logger.error('Lỗi khi kiểm tra quyền lợi tính năng', error as Error, {
        organizationId,
        featureType,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Kiểm tra xem tổ chức có vượt quá hạn mức tài nguyên không.
   * @param organizationId - ID của tổ chức
   * @param resourceType - Loại tài nguyên
   * @param currentCount - Số lượng hiện tại
   * @returns Promise<boolean> - true nếu trong hạn mức, false nếu vượt quá
   */
  async checkResourceLimit(organizationId: string, resourceType: string, currentCount: number): Promise<boolean> {
    this.logger.debug('Kiểm tra hạn mức tài nguyên của tổ chức', {
      organizationId,
      resourceType,
      currentCount
    });

    try {
      const withinLimit = await firstValueFrom(
        this.bumClient
          .send<boolean>(
            'bum.subscription.check-resource-limit',
            { organizationId, resourceType, currentCount }
          )
          .pipe(timeout(this.defaultTimeoutMs))
      );

      this.logger.debug('Kết quả kiểm tra hạn mức tài nguyên', {
        organizationId,
        resourceType,
        currentCount,
        withinLimit
      });

      return withinLimit;
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error('Hết thời gian chờ khi kiểm tra hạn mức tài nguyên', error, {
          organizationId,
          resourceType,
          currentCount,
          timeoutMs: this.defaultTimeoutMs
        });
        // Trong trường hợp timeout, nên trả về false an toàn thay vì throw exception
        return false;
      }

      this.logger.error('Lỗi khi kiểm tra hạn mức tài nguyên', error as Error, {
        organizationId,
        resourceType,
        currentCount,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Lấy trạng thái kích hoạt của tổ chức từ BUM.
   * @param organizationId - ID của tổ chức
   * @returns Promise<boolean> - true nếu tổ chức đang hoạt động, false nếu bị tạm ngưng
   */
  async isOrganizationActive(organizationId: string): Promise<boolean> {
    this.logger.debug('Kiểm tra trạng thái kích hoạt của tổ chức', { organizationId });

    try {
      const isActive = await firstValueFrom(
        this.bumClient
          .send<boolean>(
            'bum.subscription.is-active',
            { organizationId }
          )
          .pipe(timeout(this.defaultTimeoutMs))
      );

      this.logger.debug('Trạng thái kích hoạt của tổ chức', {
        organizationId,
        isActive
      });

      return isActive;
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error('Hết thời gian chờ khi kiểm tra trạng thái kích hoạt tổ chức', error, {
          organizationId,
          timeoutMs: this.defaultTimeoutMs
        });
        // Trong trường hợp timeout, nên trả về false an toàn thay vì throw exception
        return false;
      }

      this.logger.error('Lỗi khi kiểm tra trạng thái kích hoạt của tổ chức', error as Error, {
        organizationId,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
