export interface IPricingPlanCreatedEvent {
  readonly eventType: "PricingPlanCreated";
  readonly pricingPlanId: string;
  readonly name: string;
  readonly version: number;
  readonly details: {
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
  readonly createdAt: Date;
  readonly issuedAt: Date;
}
