import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ILogger } from '@ecoma/common-application';
import { IUsageTrackerPort } from '@ecoma/domains/bum/bum-application';
import { UsageRecordEntity } from '../persistence/typeorm/entities/usage-record.entity';

/**
 * Service triển khai IUsageTrackerPort để theo dõi và ghi nhận mức sử dụng tài nguyên
 */
@Injectable()
export class UsageTrackerService implements IUsageTrackerPort {
  constructor(
    @InjectRepository(UsageRecordEntity)
    private readonly usageRecordRepository: Repository<UsageRecordEntity>,
    private readonly logger: ILogger
  ) {}

  /**
   * Ghi nhận mức sử dụng tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   * @param amount Số lượng sử dụng (dương là thêm, âm là giảm)
   * @param metadata Metadata bổ sung (tùy chọn)
   */
  async recordUsage(
    organizationId: string,
    resourceType: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    this.logger.debug(`Recording resource usage`, {
      organizationId,
      resourceType,
      amount,
      metadata
    });

    const usageRecord = new UsageRecordEntity();
    usageRecord.organizationId = organizationId;
    usageRecord.resourceType = resourceType;
    usageRecord.amount = amount;
    usageRecord.timestamp = new Date();
    usageRecord.metadata = metadata || {};

    await this.usageRecordRepository.save(usageRecord);

    this.logger.debug(`Usage record saved successfully`, {
      organizationId,
      resourceType,
      amount
    });
  }

  /**
   * Lấy mức sử dụng hiện tại của một tài nguyên trong chu kỳ thanh toán hiện tại
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   */
  async getCurrentUsage(
    organizationId: string,
    resourceType: string
  ): Promise<number> {
    this.logger.debug(`Getting current resource usage`, {
      organizationId,
      resourceType
    });

    // In a real implementation, we would get the billing cycle dates from the subscription
    // For simplicity, we'll use the current month as the billing cycle
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return this.getUsageInPeriod(organizationId, resourceType, firstDayOfMonth, lastDayOfMonth);
  }

  /**
   * Lấy tổng mức sử dụng tài nguyên của tổ chức trong một khoảng thời gian
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   * @param startDate Ngày bắt đầu
   * @param endDate Ngày kết thúc
   */
  async getUsageInPeriod(
    organizationId: string,
    resourceType: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    this.logger.debug(`Getting resource usage in period`, {
      organizationId,
      resourceType,
      startDate,
      endDate
    });

    const usageRecords = await this.usageRecordRepository.find({
      where: {
        organizationId,
        resourceType,
        timestamp: Between(startDate, endDate)
      }
    });

    // Sum up all usage amounts
    const totalUsage = usageRecords.reduce((sum, record) => sum + Number(record.amount), 0);

    this.logger.debug(`Total usage retrieved: ${totalUsage}`, {
      organizationId,
      resourceType,
      totalUsage
    });

    return totalUsage;
  }
}
