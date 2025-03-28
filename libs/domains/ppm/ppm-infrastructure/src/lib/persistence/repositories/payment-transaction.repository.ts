import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaymentTransactionRepository,
  PaymentTransaction,
  Money,
  PaymentMethodType,
  PaymentMethodDetails,
  TransactionType,
  TransactionStatus,
} from '@ecoma/ppm-domain';
import { PaymentTransactionEntity } from '../models/typeorm/payment-transaction.entity';

/**
 * TypeORM implementation của IPaymentTransactionRepository
 */
@Injectable()
export class PaymentTransactionRepository implements IPaymentTransactionRepository {
  constructor(
    @InjectRepository(PaymentTransactionEntity)
    private readonly repository: Repository<PaymentTransactionEntity>,
  ) {}

  /**
   * Lưu một PaymentTransaction trong cơ sở dữ liệu
   * @param transaction - PaymentTransaction cần lưu
   * @returns Promise<PaymentTransaction> - PaymentTransaction đã được lưu
   */
  async save(transaction: PaymentTransaction): Promise<PaymentTransaction> {
    const transactionData = transaction.toObject();

    // Chuyển đổi domain object thành entity ORM
    const entity = new PaymentTransactionEntity();
    entity.id = transactionData.id;
    entity.organizationId = transactionData.organizationId;
    entity.transactionType = transactionData.transactionType;
    entity.status = transactionData.status;
    entity.amount = transactionData.amount.amount;
    entity.currency = transactionData.amount.currency;
    entity.paymentMethodType = transactionData.paymentMethodType;
    entity.paymentMethodDetails = transactionData.paymentMethodDetails;
    entity.description = transactionData.description;
    entity.metadata = transactionData.metadata;
    entity.externalOrderId = transactionData.externalOrderId;
    entity.externalCustomerId = transactionData.externalCustomerId;
    entity.gatewayId = transactionData.gatewayId;
    entity.createdAt = transactionData.createdAt;
    entity.updatedAt = transactionData.updatedAt;

    // Chuyển đổi attempts
    entity.attempts = transactionData.attempts.map((attempt) => {
      return {
        id: attempt.id,
        transactionId: transactionData.id,
        attemptDate: attempt.attemptDate,
        status: attempt.status,
        gatewayResponse: attempt.gatewayResponse,
        failureReason: attempt.failureReason,
        createdAt: attempt.createdAt,
        transaction: entity,
      };
    });

    // Chuyển đổi refunds
    entity.refunds = transactionData.refunds.map((refund) => {
      return {
        id: refund.id,
        transactionId: transactionData.id,
        amount: refund.amount.amount,
        currency: refund.amount.currency,
        status: refund.status,
        reason: refund.reason,
        description: refund.description,
        gatewayRefundId: refund.gatewayRefundId,
        failureReason: refund.failureReason,
        createdAt: refund.createdAt,
        updatedAt: refund.updatedAt,
        transaction: entity,
      };
    });

    // Lưu entity vào cơ sở dữ liệu
    await this.repository.save(entity);

    // Trả về domain object đã lưu
    return transaction;
  }

  /**
   * Tìm PaymentTransaction theo ID
   * @param id - ID của PaymentTransaction cần tìm
   * @returns Promise<PaymentTransaction | null> - PaymentTransaction nếu tìm thấy, null nếu không tìm thấy
   */
  async findById(id: string): Promise<PaymentTransaction | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['attempts', 'refunds'],
    });

    if (!entity) {
      return null;
    }

    return this._mapEntityToDomain(entity);
  }

  /**
   * Tìm tất cả các PaymentTransaction theo externalOrderId
   * @param externalOrderId - ID đơn hàng bên ngoài
   * @returns Promise<PaymentTransaction[]> - Danh sách PaymentTransaction liên quan đến đơn hàng
   */
  async findByExternalOrderId(externalOrderId: string): Promise<PaymentTransaction[]> {
    const entities = await this.repository.find({
      where: { externalOrderId },
      relations: ['attempts', 'refunds'],
    });

    return entities.map((entity) => this._mapEntityToDomain(entity));
  }

  /**
   * Tìm tất cả các PaymentTransaction theo organizationId
   * @param organizationId - ID của tổ chức
   * @param options - Tùy chọn phân trang và sắp xếp
   * @returns Promise<{ items: PaymentTransaction[]; totalCount: number }> - Danh sách PaymentTransaction và tổng số
   */
  async findByOrganizationId(
    organizationId: string,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    },
  ): Promise<{ items: PaymentTransaction[]; totalCount: number }> {
    const [entities, totalCount] = await this.repository.findAndCount({
      where: { organizationId },
      relations: ['attempts', 'refunds'],
      skip: options?.skip,
      take: options?.take,
      order: options?.orderBy
        ? { [options.orderBy.field]: options.orderBy.direction }
        : { createdAt: 'DESC' },
    });

    const items = entities.map((entity) => this._mapEntityToDomain(entity));

    return { items, totalCount };
  }

  /**
   * Tìm kiếm PaymentTransaction theo nhiều tiêu chí
   * @param criteria - Các tiêu chí tìm kiếm
   * @param options - Tùy chọn phân trang và sắp xếp
   * @returns Promise<{ items: PaymentTransaction[]; totalCount: number }> - Danh sách PaymentTransaction và tổng số
   */
  async findByCriteria(
    criteria: {
      organizationId?: string;
      externalOrderId?: string;
      externalCustomerId?: string;
      status?: string[];
      fromDate?: Date;
      toDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      currency?: string;
      paymentMethodType?: string;
      gatewayId?: string;
    },
    options?: {
      skip?: number;
      take?: number;
      orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    },
  ): Promise<{ items: PaymentTransaction[]; totalCount: number }> {
    // Xây dựng điều kiện tìm kiếm
    const queryBuilder = this.repository
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.attempts', 'attempts')
      .leftJoinAndSelect('tx.refunds', 'refunds');

    if (criteria.organizationId) {
      queryBuilder.andWhere('tx.organizationId = :organizationId', {
        organizationId: criteria.organizationId,
      });
    }

    if (criteria.externalOrderId) {
      queryBuilder.andWhere('tx.externalOrderId = :externalOrderId', {
        externalOrderId: criteria.externalOrderId,
      });
    }

    if (criteria.externalCustomerId) {
      queryBuilder.andWhere('tx.externalCustomerId = :externalCustomerId', {
        externalCustomerId: criteria.externalCustomerId,
      });
    }

    if (criteria.status && criteria.status.length > 0) {
      queryBuilder.andWhere('tx.status IN (:...status)', {
        status: criteria.status,
      });
    }

    if (criteria.fromDate) {
      queryBuilder.andWhere('tx.createdAt >= :fromDate', {
        fromDate: criteria.fromDate,
      });
    }

    if (criteria.toDate) {
      queryBuilder.andWhere('tx.createdAt <= :toDate', {
        toDate: criteria.toDate,
      });
    }

    if (criteria.minAmount !== undefined) {
      queryBuilder.andWhere('tx.amount >= :minAmount', {
        minAmount: criteria.minAmount,
      });
    }

    if (criteria.maxAmount !== undefined) {
      queryBuilder.andWhere('tx.amount <= :maxAmount', {
        maxAmount: criteria.maxAmount,
      });
    }

    if (criteria.currency) {
      queryBuilder.andWhere('tx.currency = :currency', {
        currency: criteria.currency,
      });
    }

    if (criteria.paymentMethodType) {
      queryBuilder.andWhere('tx.paymentMethodType = :paymentMethodType', {
        paymentMethodType: criteria.paymentMethodType,
      });
    }

    if (criteria.gatewayId) {
      queryBuilder.andWhere('tx.gatewayId = :gatewayId', {
        gatewayId: criteria.gatewayId,
      });
    }

    // Thêm phân trang và sắp xếp
    if (options?.orderBy) {
      queryBuilder.orderBy(
        `tx.${options.orderBy.field}`,
        options.orderBy.direction,
      );
    } else {
      queryBuilder.orderBy('tx.createdAt', 'DESC');
    }

    if (options?.skip !== undefined) {
      queryBuilder.skip(options.skip);
    }

    if (options?.take !== undefined) {
      queryBuilder.take(options.take);
    }

    // Thực hiện truy vấn
    const [entities, totalCount] = await queryBuilder.getManyAndCount();

    // Chuyển đổi kết quả
    const items = entities.map((entity) => this._mapEntityToDomain(entity));

    return { items, totalCount };
  }

  /**
   * Chuyển đổi từ Entity sang Domain Object
   * @param entity - PaymentTransactionEntity cần chuyển đổi
   * @returns PaymentTransaction - Domain Object tương ứng
   * @private
   */
  private _mapEntityToDomain(entity: PaymentTransactionEntity): PaymentTransaction {
    return PaymentTransaction.fromPersistence(
      {
        id: entity.id,
        organizationId: entity.organizationId,
        transactionType: entity.transactionType,
        status: entity.status,
        amount: Number(entity.amount),
        currency: entity.currency,
        paymentMethodType: entity.paymentMethodType,
        paymentMethodDetails: entity.paymentMethodDetails,
        description: entity.description,
        metadata: entity.metadata,
        externalOrderId: entity.externalOrderId,
        externalCustomerId: entity.externalCustomerId,
        gatewayId: entity.gatewayId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
      entity.attempts?.map((attempt) => ({
        id: attempt.id,
        attemptDate: attempt.attemptDate,
        status: attempt.status,
        gatewayResponse: attempt.gatewayResponse,
        failureReason: attempt.failureReason,
        createdAt: attempt.createdAt,
      })) || [],
      entity.refunds?.map((refund) => ({
        id: refund.id,
        amount: Number(refund.amount),
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        description: refund.description,
        gatewayRefundId: refund.gatewayRefundId,
        createdAt: refund.createdAt,
        updatedAt: refund.updatedAt,
      })) || [],
    );
  }
}
