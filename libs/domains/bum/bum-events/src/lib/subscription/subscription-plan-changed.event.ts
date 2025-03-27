export interface ISubscriptionPlanChangedEvent {
  readonly eventType: "SubscriptionPlanChanged";
  readonly subscriptionId: string;
  readonly tenantId: string;
  readonly oldPricingPlanId: string;
  readonly oldPricingPlanVersion: number;
  readonly newPricingPlanId: string;
  readonly newPricingPlanVersion: number;
  readonly newFeatureEntitlements: Array<{
    type: "Feature" | "Resource";
    featureType?: string;
    resourceType?: string;
    limit?: number;
  }>;
  readonly transactionId?: string;
  readonly issuedAt: Date;
}
