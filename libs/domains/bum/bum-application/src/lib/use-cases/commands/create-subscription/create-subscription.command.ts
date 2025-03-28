/**
 * Command để tạo mới một subscription
 */
export class CreateSubscriptionCommand {
  constructor(
    public readonly organizationId: string,
    public readonly pricingPlanId: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly autoRenew: boolean
  ) {}
}
