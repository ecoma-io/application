export interface IUsageLimitExceededEvent {
  readonly eventType: "UsageLimitExceeded";
  readonly tenantId: string;
  readonly subscriptionId: string;
  readonly resourceType: string;
  readonly currentUsage: number;
  readonly usageLimit: number;
  readonly billingCyclePeriod: {
    startDate: Date;
    endDate: Date;
    timezone: string;
  };
  readonly issuedAt: Date;
}
