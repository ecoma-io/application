import { AbstractAggregate } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';
import { PricingPlanId } from '../value-objects/pricing-plan-id.value-object';
import { FeatureEntitlement } from '../value-objects/feature-entitlement.value-object';
import { ResourceEntitlement } from '../value-objects/resource-entitlement.value-object';

/**
 * Loại chu kỳ thanh toán
 */
export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

/**
 * Aggregate đại diện cho một gói dịch vụ với các quyền lợi tính năng và tài nguyên
 */
export class PricingPlan extends AbstractAggregate<PricingPlanId> {
  private name: string;
  private description: string;
  private billingCycle: BillingCycle;
  private price: number;
  private currency: string;
  private featureEntitlementsList: FeatureEntitlement[];
  private resourceEntitlementsList: ResourceEntitlement[];

  get pricingPlanId(): PricingPlanId {
    return this.id;
  }

  get nameValue(): string {
    return this.name;
  }

  get descriptionValue(): string {
    return this.description;
  }

  get billingCycleValue(): BillingCycle {
    return this.billingCycle;
  }

  get priceValue(): number {
    return this.price;
  }

  get currencyValue(): string {
    return this.currency;
  }

  get featureEntitlements(): FeatureEntitlement[] {
    return [...this.featureEntitlementsList];
  }

  get resourceEntitlements(): ResourceEntitlement[] {
    return [...this.resourceEntitlementsList];
  }

  /**
   * Tạo một gói dịch vụ mới
   * @param id ID của gói dịch vụ
   * @param name Tên gói
   * @param description Mô tả gói
   * @param billingCycle Chu kỳ thanh toán
   * @param price Giá
   * @param currency Đơn vị tiền tệ
   */
  constructor(
    id: PricingPlanId,
    name: string,
    description: string,
    billingCycle: BillingCycle,
    price: number,
    currency: string
  ) {
    super(id);

    this.name = name;
    this.description = description;
    this.billingCycle = billingCycle;
    this.price = price;
    this.currency = currency;
    this.featureEntitlementsList = [];
    this.resourceEntitlementsList = [];

    this.validate();
  }

  private validate(): void {
    Guard.againstNullOrUndefined(this.name, 'name');
    Guard.againstEmptyString(this.name, 'name');
    Guard.againstNullOrUndefined(this.description, 'description');
    Guard.againstNullOrUndefined(this.billingCycle, 'billingCycle');
    Guard.againstNullOrUndefined(this.price, 'price');
    Guard.againstNullOrUndefined(this.currency, 'currency');
    Guard.againstEmptyString(this.currency, 'currency');

    if (this.price < 0) {
      throw new Error('Giá không thể là số âm');
    }
  }

  /**
   * Thêm một quyền lợi tính năng vào gói
   * @param featureEntitlement Quyền lợi tính năng cần thêm
   */
  public addFeatureEntitlement(featureEntitlement: FeatureEntitlement): void {
    Guard.againstNullOrUndefined(featureEntitlement, 'featureEntitlement');

    // Kiểm tra xem đã tồn tại quyền lợi cho tính năng này chưa
    const existingIndex = this.featureEntitlementsList.findIndex(
      fe => fe.featureType === featureEntitlement.featureType
    );

    if (existingIndex >= 0) {
      // Nếu đã tồn tại, thay thế bằng quyền lợi mới
      this.featureEntitlementsList[existingIndex] = featureEntitlement;
    } else {
      // Nếu chưa tồn tại, thêm mới vào danh sách
      this.featureEntitlementsList.push(featureEntitlement);
    }
  }

  /**
   * Thêm một quyền lợi tài nguyên vào gói
   * @param resourceEntitlement Quyền lợi tài nguyên cần thêm
   */
  public addResourceEntitlement(resourceEntitlement: ResourceEntitlement): void {
    Guard.againstNullOrUndefined(resourceEntitlement, 'resourceEntitlement');

    // Kiểm tra xem đã tồn tại quyền lợi cho loại tài nguyên này chưa
    const existingIndex = this.resourceEntitlementsList.findIndex(
      re => re.resourceType === resourceEntitlement.resourceType
    );

    if (existingIndex >= 0) {
      // Nếu đã tồn tại, thay thế bằng quyền lợi mới
      this.resourceEntitlementsList[existingIndex] = resourceEntitlement;
    } else {
      // Nếu chưa tồn tại, thêm mới vào danh sách
      this.resourceEntitlementsList.push(resourceEntitlement);
    }
  }

  /**
   * Xóa quyền lợi tính năng khỏi gói
   * @param featureType Loại tính năng cần xóa
   */
  public removeFeatureEntitlement(featureType: string): void {
    Guard.againstNullOrUndefined(featureType, 'featureType');
    Guard.againstEmptyString(featureType, 'featureType');

    this.featureEntitlementsList = this.featureEntitlementsList.filter(
      fe => fe.featureType !== featureType
    );
  }

  /**
   * Xóa quyền lợi tài nguyên khỏi gói
   * @param resourceType Loại tài nguyên cần xóa
   */
  public removeResourceEntitlement(resourceType: string): void {
    Guard.againstNullOrUndefined(resourceType, 'resourceType');
    Guard.againstEmptyString(resourceType, 'resourceType');

    this.resourceEntitlementsList = this.resourceEntitlementsList.filter(
      re => re.resourceType !== resourceType
    );
  }

  /**
   * Cập nhật tên gói
   * @param name Tên mới
   */
  public updateName(name: string): void {
    Guard.againstNullOrUndefined(name, 'name');
    Guard.againstEmptyString(name, 'name');
    this.name = name;
  }

  /**
   * Cập nhật mô tả gói
   * @param description Mô tả mới
   */
  public updateDescription(description: string): void {
    Guard.againstNullOrUndefined(description, 'description');
    this.description = description;
  }

  /**
   * Cập nhật chu kỳ thanh toán
   * @param billingCycle Chu kỳ thanh toán mới
   */
  public updateBillingCycle(billingCycle: BillingCycle): void {
    Guard.againstNullOrUndefined(billingCycle, 'billingCycle');
    this.billingCycle = billingCycle;
  }

  /**
   * Cập nhật giá
   * @param price Giá mới
   */
  public updatePrice(price: number): void {
    Guard.againstNullOrUndefined(price, 'price');
    if (price < 0) {
      throw new Error('Giá không thể là số âm');
    }
    this.price = price;
  }

  /**
   * Cập nhật đơn vị tiền tệ
   * @param currency Đơn vị tiền tệ mới
   */
  public updateCurrency(currency: string): void {
    Guard.againstNullOrUndefined(currency, 'currency');
    Guard.againstEmptyString(currency, 'currency');
    this.currency = currency;
  }

  /**
   * Kiểm tra xem có hỗ trợ một tính năng không
   * @param featureType Loại tính năng cần kiểm tra
   * @returns true nếu có hỗ trợ và đã kích hoạt, ngược lại là false
   */
  public hasFeature(featureType: string): boolean {
    const feature = this.featureEntitlementsList.find(
      fe => fe.featureType === featureType
    );
    return feature !== undefined && feature.isEnabled;
  }

  /**
   * Lấy giới hạn cho một loại tài nguyên
   * @param resourceType Loại tài nguyên cần lấy giới hạn
   * @returns Giới hạn tài nguyên hoặc null nếu không tìm thấy
   */
  public getResourceLimit(resourceType: string): number | null {
    const resource = this.resourceEntitlementsList.find(
      re => re.resourceType === resourceType
    );
    return resource ? resource.limit : null;
  }
}
