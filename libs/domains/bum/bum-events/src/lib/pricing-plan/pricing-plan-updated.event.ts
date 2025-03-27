export interface IPricingPlanUpdatedEvent {
  readonly eventType: "PricingPlanUpdated";
  readonly pricingPlanId: string;
  readonly name: string;
  readonly oldVersion: number;
  readonly newVersion: number;
  readonly newDetails: {
    basePrice: {
      amount: number;
      currency: string;
    };
    billingCycle: {
      value: number;
      unit: "Day" | "Month" | "Year" | "Forever";
    };
    components: Array<{
      type: "Base" | "Resource" | "Feature";
      details: {
        resourceType?: string;
        featureType?: string;
        usageLimit?: number;
        pricePerUnit?: {
          amount: number;
          currency: string;
        };
      };
    }>;
  };
  readonly updatedAt: Date;
  readonly issuedAt: Date;
}
