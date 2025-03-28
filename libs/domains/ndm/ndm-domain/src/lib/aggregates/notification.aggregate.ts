import { AbstractAggregate } from '@ecoma/common-domain';
import { Channel, Locale, NotificationContext, NotificationStatus, StringId } from '../value-objects';
import { NotificationCreatedEvent, NotificationStatusChangedEvent } from '../domain-events';

/**
 * Aggregate root đại diện cho một thông báo
 */
export class Notification extends AbstractAggregate<StringId> {
  private readonly templateIdValue: string;
  private readonly channelValue: Channel;
  private readonly localeValue: Locale;
  private readonly contextValue: NotificationContext;
  private readonly recipientIdValue: string;
  private readonly organizationIdValue: string;
  private statusValue: NotificationStatus;
  private readonly subjectValue: string;
  private readonly contentValue: string;
  private failureReasonValue?: string;
  private sentAtValue?: Date;
  private deliveredAtValue?: Date;
  private readAtValue?: Date;

  constructor(
    id: string,
    templateId: string,
    channel: Channel,
    locale: Locale,
    context: NotificationContext,
    recipientId: string,
    organizationId: string,
    subject: string,
    content: string,
  ) {
    super(StringId.create(id));
    this.templateIdValue = templateId;
    this.channelValue = channel;
    this.localeValue = locale;
    this.contextValue = context;
    this.recipientIdValue = recipientId;
    this.organizationIdValue = organizationId;
    this.statusValue = NotificationStatus.createPending();
    this.subjectValue = subject;
    this.contentValue = content;

    // Phát ra event NotificationCreated
    this.addDomainEvent(
      new NotificationCreatedEvent(
        id,
        this.templateIdValue,
        this.channelValue,
        this.localeValue,
        this.contextValue,
        this.recipientIdValue,
        this.organizationIdValue,
      ),
    );
  }

  // Getters
  get templateId(): string {
    return this.templateIdValue;
  }

  get channel(): Channel {
    return this.channelValue;
  }

  get locale(): Locale {
    return this.localeValue;
  }

  get context(): NotificationContext {
    return this.contextValue;
  }

  get recipientId(): string {
    return this.recipientIdValue;
  }

  get organizationId(): string {
    return this.organizationIdValue;
  }

  get status(): NotificationStatus {
    return this.statusValue;
  }

  get subject(): string {
    return this.subjectValue;
  }

  get content(): string {
    return this.contentValue;
  }

  get failureReason(): string | undefined {
    return this.failureReasonValue;
  }

  get sentAt(): Date | undefined {
    return this.sentAtValue;
  }

  get deliveredAt(): Date | undefined {
    return this.deliveredAtValue;
  }

  get readAt(): Date | undefined {
    return this.readAtValue;
  }

  /**
   * Đánh dấu thông báo đang được gửi
   */
  public markAsSending(): void {
    if (!this.statusValue.isPending() && !this.statusValue.isRetrying()) {
      throw new Error('Cannot mark as sending: notification is not in pending or retrying state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createSending();

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue),
    );
  }

  /**
   * Đánh dấu thông báo đã được gửi thành công
   */
  public markAsSent(): void {
    if (!this.statusValue.isSending()) {
      throw new Error('Cannot mark as sent: notification is not in sending state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createSent();
    this.sentAtValue = new Date();

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue),
    );
  }

  /**
   * Đánh dấu thông báo gửi thất bại
   */
  public markAsFailed(reason: string): void {
    if (!this.statusValue.isSending()) {
      throw new Error('Cannot mark as failed: notification is not in sending state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createFailed();
    this.failureReasonValue = reason;

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue, reason),
    );
  }

  /**
   * Đánh dấu thông báo đang chờ thử lại
   */
  public markAsRetrying(): void {
    if (!this.statusValue.isFailed()) {
      throw new Error('Cannot mark as retrying: notification is not in failed state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createRetrying();

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue),
    );
  }

  /**
   * Đánh dấu thông báo đã được gửi đến người nhận
   */
  public markAsDelivered(): void {
    if (!this.statusValue.isSent()) {
      throw new Error('Cannot mark as delivered: notification is not in sent state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createDelivered();
    this.deliveredAtValue = new Date();

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue),
    );
  }

  /**
   * Đánh dấu thông báo đã được đọc
   */
  public markAsRead(): void {
    if (!this.statusValue.isDelivered()) {
      throw new Error('Cannot mark as read: notification is not in delivered state');
    }

    const oldStatus = this.statusValue;
    this.statusValue = NotificationStatus.createRead();
    this.readAtValue = new Date();

    this.addDomainEvent(
      new NotificationStatusChangedEvent(this.id.value, oldStatus, this.statusValue),
    );
  }

  /**
   * Kiểm tra thông báo có thể gửi lại không
   */
  public canBeRetried(): boolean {
    return this.statusValue.isFailed();
  }

  /**
   * Kiểm tra thông báo có thể đánh dấu là đã đọc không
   */
  public canBeMarkedAsRead(): boolean {
    return this.statusValue.isDelivered();
  }
}
