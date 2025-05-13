import { AbstractEntity, UuidId } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';
import { v4 as uuidv4 } from 'uuid';

export interface ISessionProps {
  readonly userId: string;
  readonly organizationId?: string;
  readonly token: string;
  expiresAt: Date; // Can be updated (e.g. extend session)
  readonly createdAt: Date;
  lastActiveAt: Date; // Can be updated
  // readonly ipAddress?: string;
  // readonly userAgent?: string;
}
export class Session extends AbstractEntity<UuidId> {
  private readonly $props: ISessionProps;

  private constructor(props: ISessionProps, id: UuidId) {
    super(id);
    this.$props = props;
  }

  public static create(props: {
    userId: string;
    token: string;
    expiresAt: Date;
    organizationId?: string;
  }, id?: UuidId): Session {
    // Validate
    Guard.againstNullOrEmpty(props.userId, 'userId');
    Guard.againstNullOrEmpty(props.token, 'token');
    Guard.againstNullOrUndefined(props.expiresAt, 'expiresAt');

    // Ensure expiresAt is in the future
    if (props.expiresAt <= new Date()) {
      throw new Error('Session expiration must be in the future');
    }

    const now = new Date();
    return new Session({
      userId: props.userId,
      token: props.token,
      expiresAt: props.expiresAt,
      organizationId: props.organizationId,
      createdAt: now,
      lastActiveAt: now,
    }, id || new UuidId(uuidv4()));
  }

  public static hydrate(props: ISessionProps, id: UuidId): Session {
    return new Session(props, id);
  }

  get userId(): string { return this.$props.userId; }
  get organizationId(): string | undefined { return this.$props.organizationId; }
  get token(): string { return this.$props.token; }
  get expiresAt(): Date { return this.$props.expiresAt; }
  get createdAt(): Date { return this.$props.createdAt; }
  get lastActiveAt(): Date { return this.$props.lastActiveAt; }
  // get ipAddress(): string | undefined { return this.props.ipAddress; }
  // get userAgent(): string | undefined { return this.props.userAgent; }

  /**
   * Check if the session is expired
   */
  public isExpired(): boolean {
    return this.$props.expiresAt <= new Date();
  }

  public terminate(): void {
    // Conceptual termination; actual deletion or status change would be in a service.
    // If adding a status to ISessionProps, update it here.
    // this.props.status = SessionStatus.TERMINATED;
    // this.addDomainEvent(new SessionTerminatedEvent(this.id.value)); // If Session becomes an Aggregate
  }

  /**
   * Update the last active time to now
   */
  public updateLastActiveTime(): void {
    this.$props.lastActiveAt = new Date();
  }

  /**
   * Extend the session by setting a new expiration date
   */
  public extendSession(newExpiresAt: Date): void {
    Guard.againstNullOrUndefined(newExpiresAt, 'newExpiresAt');
    // Ensure the new expiration is in the future
    if (newExpiresAt <= new Date()) {
      throw new Error('New session expiration must be in the future');
    }
    // Ensure the new expiration is after the current one
    if (newExpiresAt <= this.$props.expiresAt) {
      throw new Error('New session expiration must be after the current expiration');
    }
    this.$props.expiresAt = newExpiresAt;
  }
}
