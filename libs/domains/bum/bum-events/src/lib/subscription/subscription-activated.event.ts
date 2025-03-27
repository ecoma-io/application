export interface ISubscriptionActivatedEvent {
  readonly eventType: "SubscriptionActivated";
  readonly subscriptionId: string;
  readonly tenantId: string;
  readonly pricingPlanId: string;
  readonly pricingPlanVersion: number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly featureEntitlements: Array<{
    type: "Feature" | "Resource";
    featureType?: string;
    resourceType?: string;
    limit?: number;
  }>;
  readonly issuedAt: Date;
}
