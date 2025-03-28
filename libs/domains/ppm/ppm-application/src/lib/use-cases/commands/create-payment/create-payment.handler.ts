import { IPaymentTransactionRepository } from '@ecoma/ppm-domain';
import { PaymentTransaction, Money, PaymentMethodType, PaymentMethodDetails } from '@ecoma/ppm-domain';
import { IEventEmitter } from '../../../interfaces/message-broker';
import { IPaymentProcessor } from '../../../interfaces/payments';
import { CreatePaymentCommand } from './create-payment.command';
import { Injectable } from '@nestjs/common';

/**
 * Handler xử lý CreatePaymentCommand
 */
@Injectable()
export class CreatePaymentHandler {
  constructor(
    private readonly paymentTransactionRepository: IPaymentTransactionRepository,
    private readonly paymentProcessor: IPaymentProcessor,
    private readonly eventEmitter: IEventEmitter,
  ) {}

  /**
   * Xử lý command tạo giao dịch thanh toán mới
   * @param command - Command tạo giao dịch thanh toán
   * @returns Promise<string> - ID của giao dịch thanh toán đã tạo
   */
  async execute(command: CreatePaymentCommand): Promise<string> {
    // Tạo các value objects cần thiết
    const amount = Money.create(command.amount, command.currency);
    const paymentMethodType = PaymentMethodType.fromString(command.paymentMethodType);
    const paymentMethodDetails = PaymentMethodDetails.fromObject(command.paymentMethodDetails);

    // Xác định cổng thanh toán phù hợp nếu không được chỉ định
    let gatewayId = command.gatewayId;
    if (!gatewayId) {
      const supportedGateways = await this.paymentProcessor.getSupportedGateways(
        paymentMethodType,
        command.organizationId,
      );

      if (supportedGateways.length === 0) {
        throw new Error(
          `Không tìm thấy cổng thanh toán hỗ trợ cho phương thức thanh toán ${command.paymentMethodType}`,
        );
      }

      // Chọn cổng thanh toán đầu tiên trong danh sách hỗ trợ
      gatewayId = supportedGateways[0];
    }

    // Tạo aggregate root PaymentTransaction
    const transaction = PaymentTransaction.createPayment({
      organizationId: command.organizationId,
      amount,
      paymentMethodType,
      paymentMethodDetails,
      description: command.description,
      metadata: command.metadata,
      externalOrderId: command.externalOrderId,
      externalCustomerId: command.externalCustomerId,
      gatewayId,
    });

    // Lưu giao dịch vào repository
    await this.paymentTransactionRepository.save(transaction);

    // Phát các domain events
    const events = transaction.getEvents();
    if (events.length > 0) {
      await this.eventEmitter.emitMany(events);
    }

    // Trả về ID của giao dịch đã tạo
    return transaction.id;
  }
}
