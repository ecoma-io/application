import { Injectable, Logger } from '@nestjs/common';
import { IPaymentProcessor } from '@ecoma/ppm-application';
import {
  IPaymentTransactionRepository,
  PaymentMethodType,
  PaymentTransaction,
} from '@ecoma/ppm-domain';
import { PaymentGatewayFactoryService } from '../payment-gateways/factory/payment-gateway-factory.service';
import { IPaymentGatewayConfigurationRepository } from '@ecoma/ppm-domain';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementation của IPaymentProcessor
 */
@Injectable()
export class PaymentProcessorService implements IPaymentProcessor {
  private readonly logger = new Logger(PaymentProcessorService.name);

  constructor(
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
    private readonly gatewayConfigurationRepository: IPaymentGatewayConfigurationRepository,
    private readonly gatewayFactory: PaymentGatewayFactoryService,
  ) {}

  /**
   * Xử lý thanh toán cho một giao dịch
   * @param transactionId - ID của giao dịch thanh toán
   * @returns Promise<{ success: boolean; attemptId: string; errorMessage?: string }> - Kết quả xử lý
   */
  async processPayment(transactionId: string): Promise<{
    success: boolean;
    attemptId: string;
    errorMessage?: string;
  }> {
    try {
      // Tìm giao dịch cần xử lý
      const transaction = await this.paymentTransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error(`Không tìm thấy giao dịch với ID: ${transactionId}`);
      }

      // Thêm một lần thử mới
      const attemptId = transaction.addNewAttempt();

      // Lấy cổng thanh toán phù hợp
      const gateway = await this.gatewayFactory.getGateway(transaction.gatewayId);

      // Chuẩn bị thông tin thanh toán
      const paymentRequest = {
        amount: transaction.amount.amount,
        currency: transaction.amount.currency,
        paymentMethodDetails: transaction.paymentMethodDetails.toObject(),
        description: transaction.description || undefined,
        metadata: {
          transactionId: transaction.id,
          externalOrderId: transaction.externalOrderId || undefined,
          externalCustomerId: transaction.externalCustomerId || undefined,
          ...transaction.metadata,
        },
        customerId: transaction.externalCustomerId || undefined,
        idempotencyKey: `${transaction.id}-${attemptId}`,
      };

      // Xử lý thanh toán thông qua cổng thanh toán
      const result = await gateway.processPayment(paymentRequest);

      // Cập nhật kết quả lần thử
      if (result.success) {
        transaction.markAttemptAsSuccess(attemptId, result.gatewayResponse);
      } else {
        transaction.markAttemptAsFailure(
          attemptId,
          result.errorMessage || 'Lỗi không xác định',
          result.gatewayResponse,
          true, // Đánh dấu là lần thử cuối cùng
        );
      }

      // Lưu giao dịch với kết quả mới
      await this.paymentTransactionRepository.save(transaction);

      // Trả về kết quả
      return {
        success: result.success,
        attemptId,
        errorMessage: result.errorMessage,
      };
    } catch (error) {
      this.logger.error(
        `Lỗi khi xử lý thanh toán cho giao dịch ${transactionId}: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        attemptId: uuidv4(), // Tạo một ID giả nếu chưa tạo được lần thử
        errorMessage: `Lỗi hệ thống: ${error.message}`,
      };
    }
  }

  /**
   * Xử lý hoàn tiền cho một giao dịch
   * @param transactionId - ID của giao dịch thanh toán
   * @param refundId - ID của yêu cầu hoàn tiền
   * @returns Promise<{ success: boolean; errorMessage?: string }> - Kết quả xử lý
   */
  async processRefund(
    transactionId: string,
    refundId: string,
  ): Promise<{
    success: boolean;
    errorMessage?: string;
  }> {
    try {
      // Tìm giao dịch cần hoàn tiền
      const transaction = await this.paymentTransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error(`Không tìm thấy giao dịch với ID: ${transactionId}`);
      }

      // Tìm khoản hoàn tiền
      const refund = transaction.refunds.find((r) => r.id === refundId);
      if (!refund) {
        throw new Error(`Không tìm thấy khoản hoàn tiền với ID: ${refundId}`);
      }

      // Lấy cổng thanh toán phù hợp
      const gateway = await this.gatewayFactory.getGateway(transaction.gatewayId);

      // Chuẩn bị thông tin hoàn tiền
      const refundRequest = {
        amount: refund.amount.amount,
        currency: refund.amount.currency,
        originalTransactionId: transaction.id,
        reason: refund.reason,
        metadata: {
          transactionId: transaction.id,
          refundId: refund.id,
          externalOrderId: transaction.externalOrderId || undefined,
          externalCustomerId: transaction.externalCustomerId || undefined,
        },
        idempotencyKey: `${transaction.id}-refund-${refundId}`,
      };

      // Xử lý hoàn tiền thông qua cổng thanh toán
      const result = await gateway.processRefund(refundRequest);

      // Cập nhật kết quả hoàn tiền
      if (result.success) {
        transaction.markRefundAsProcessed(refundId, result.gatewayRefundId!);
      } else {
        transaction.markRefundAsFailed(
          refundId,
          result.errorMessage || 'Lỗi không xác định',
        );
      }

      // Lưu giao dịch với kết quả mới
      await this.paymentTransactionRepository.save(transaction);

      // Trả về kết quả
      return {
        success: result.success,
        errorMessage: result.errorMessage,
      };
    } catch (error) {
      this.logger.error(
        `Lỗi khi xử lý hoàn tiền cho giao dịch ${transactionId}, refund ${refundId}: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        errorMessage: `Lỗi hệ thống: ${error.message}`,
      };
    }
  }

  /**
   * Lấy danh sách các cổng thanh toán hỗ trợ phương thức thanh toán cụ thể
   * @param paymentMethodType - Loại phương thức thanh toán
   * @param organizationId - ID của tổ chức
   * @returns Promise<string[]> - Danh sách ID của các cổng thanh toán hỗ trợ
   */
  async getSupportedGateways(
    paymentMethodType: PaymentMethodType,
    organizationId: string,
  ): Promise<string[]> {
    try {
      // Lấy tất cả cấu hình cổng thanh toán của tổ chức
      const configs = await this.gatewayConfigurationRepository.findByOrganizationId(
        organizationId,
      );

      // Lọc ra những cổng thanh toán đang hoạt động
      const activeConfigs = configs.filter((config) => config.isActive);

      // Kiểm tra từng cổng thanh toán xem có hỗ trợ phương thức thanh toán không
      const supportedGateways: string[] = [];

      for (const config of activeConfigs) {
        const gateway = await this.gatewayFactory.getGateway(config.gatewayId);

        if (gateway.supportsPaymentMethodType(paymentMethodType.toString())) {
          supportedGateways.push(config.gatewayId);
        }
      }

      return supportedGateways;
    } catch (error) {
      this.logger.error(
        `Lỗi khi tìm cổng thanh toán hỗ trợ cho ${paymentMethodType.toString()}: ${error.message}`,
        error.stack,
      );
      return [];
    }
  }
}
