export interface IUsageLimitApproachingEvent {
  readonly eventType: "UsageLimitApproaching";
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
