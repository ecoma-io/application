import { Test } from '@nestjs/testing';
import { LoggerMock } from '@ecoma/common-testing';
import { ILogger } from '@ecoma/common-application';
import {
  Subscription,
  SubscriptionId,
  OrganizationId,
  PricingPlanId,
  SubscriptionStatus,
  PricingPlan,
  FeatureEntitlement,
  ResourceEntitlement,
  ISubscriptionRepository,
  IPricingPlanRepository,
  BillingCycle
} from '@ecoma/bum-domain';

import { CreateSubscriptionCommand } from './create-subscription.command';
import { CreateSubscriptionHandler } from './create-subscription.handler';
import { IEventPublisherPort } from '../../../interfaces/event-publisher.interface';

// Constants for DI tokens
const SUBSCRIPTION_REPOSITORY_TOKEN = 'ISubscriptionRepository';
const PRICING_PLAN_REPOSITORY_TOKEN = 'IPricingPlanRepository';
const EVENT_PUBLISHER_PORT_TOKEN = 'IEventPublisherPort';
const LOGGER_TOKEN = 'ILogger';

describe('CreateSubscriptionHandler', () => {
  let createSubscriptionHandler: CreateSubscriptionHandler;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let pricingPlanRepository: jest.Mocked<IPricingPlanRepository>;
  let eventPublisher: jest.Mocked<IEventPublisherPort>;

  beforeEach(async () => {
    // Create mock repositories and services
    const subscriptionRepositoryMock = {
      findById: jest.fn(),
      findByOrganizationId: jest.fn(),
      findActiveByOrganizationId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    const pricingPlanRepositoryMock = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findAllActive: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };

    const eventPublisherMock = {
      publish: jest.fn(),
      publishAll: jest.fn()
    };

    const module = await Test.createTestingModule({
      providers: [
        CreateSubscriptionHandler,
        { provide: SUBSCRIPTION_REPOSITORY_TOKEN, useValue: subscriptionRepositoryMock },
        { provide: PRICING_PLAN_REPOSITORY_TOKEN, useValue: pricingPlanRepositoryMock },
        { provide: EVENT_PUBLISHER_PORT_TOKEN, useValue: eventPublisherMock },
        { provide: LOGGER_TOKEN, useClass: LoggerMock }
      ],
    }).compile();

    createSubscriptionHandler = module.get<CreateSubscriptionHandler>(CreateSubscriptionHandler);
    subscriptionRepository = module.get(SUBSCRIPTION_REPOSITORY_TOKEN) as jest.Mocked<ISubscriptionRepository>;
    pricingPlanRepository = module.get(PRICING_PLAN_REPOSITORY_TOKEN) as jest.Mocked<IPricingPlanRepository>;
    eventPublisher = module.get(EVENT_PUBLISHER_PORT_TOKEN) as jest.Mocked<IEventPublisherPort>;

    // Mock the generateId method to return a fixed ID for testing
    jest.spyOn<any, any>(createSubscriptionHandler, 'generateId').mockReturnValue('test_id');
  });

  it('nên tạo subscription mới thành công', async () => {
    // Arrange
    const command = new CreateSubscriptionCommand(
      'org_123',
      'plan_123',
      '2023-01-01',
      '2023-12-31',
      true
    );

    // Mock the pricing plan repository to return a plan
    const featureEntitlements = [new FeatureEntitlement('feature1', true)];
    const resourceEntitlements = [new ResourceEntitlement('resource1', 100)];
    const pricingPlan = new PricingPlan(
      new PricingPlanId('plan_123'),
      'Test Plan',
      'Test Description',
      BillingCycle.MONTHLY,
      100,
      'USD'
    );
    pricingPlanRepository.findById.mockResolvedValue(pricingPlan);

    // Mock that the organization doesn't already have an active subscription
    subscriptionRepository.findActiveByOrganizationId.mockResolvedValue(null);

    // Act
    const result = await createSubscriptionHandler.execute(command);

    // Assert
    // Check that the result is the ID we mocked
    expect(result).toBe('test_id');

    // Verify that the subscription repository's save method was called once
    expect(subscriptionRepository.save).toHaveBeenCalledTimes(1);

    // Verify the properties of the saved subscription
    const savedSubscription = subscriptionRepository.save.mock.calls[0][0];
    expect(savedSubscription).toBeInstanceOf(Subscription);
    expect(savedSubscription.subscriptionId.value).toBe('test_id');
    expect(savedSubscription.organizationIdValue.value).toBe('org_123');
    expect(savedSubscription.pricingPlanIdValue.value).toBe('plan_123');
    expect(savedSubscription.statusValue.value).toBe('Active');
    expect(savedSubscription.startDateValue).toEqual(new Date('2023-01-01'));
    expect(savedSubscription.endDateValue).toEqual(new Date('2023-12-31'));
    expect(savedSubscription.autoRenewValue).toBe(true);

    // Verify that events were published
    expect(eventPublisher.publishAll).toHaveBeenCalledTimes(1);
    expect(eventPublisher.publishAll.mock.calls[0][0]).toEqual(savedSubscription.getUncommittedEvents());
  });

  it('nên ném lỗi khi pricing plan không tồn tại', async () => {
    // Arrange
    const command = new CreateSubscriptionCommand(
      'org_123',
      'plan_123',
      '2023-01-01',
      '2023-12-31',
      true
    );

    // Mock that the pricing plan doesn't exist
    pricingPlanRepository.findById.mockResolvedValue(null);

    // Act and Assert
    await expect(createSubscriptionHandler.execute(command)).rejects.toThrow(
      'Pricing plan with ID plan_123 not found'
    );

    // Verify that the subscription repository's save method was not called
    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('nên ném lỗi khi pricing plan không active', async () => {
    // Arrange
    const command = new CreateSubscriptionCommand(
      'org_123',
      'plan_123',
      '2023-01-01',
      '2023-12-31',
      true
    );

    // Mock an inactive pricing plan
    const featureEntitlements = [new FeatureEntitlement('feature1', true)];
    const resourceEntitlements = [new ResourceEntitlement('resource1', 100)];
    const pricingPlan = new PricingPlan(
      new PricingPlanId('plan_123'),
      'Test Plan',
      'Test Description',
      BillingCycle.MONTHLY,
      100,
      'USD'
    );
    pricingPlanRepository.findById.mockResolvedValue(pricingPlan);

    // Act and Assert
    await expect(createSubscriptionHandler.execute(command)).rejects.toThrow(
      'Pricing plan with ID plan_123 is not active'
    );

    // Verify that the subscription repository's save method was not called
    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });

  it('nên ném lỗi khi tổ chức đã có subscription active', async () => {
    // Arrange
    const command = new CreateSubscriptionCommand(
      'org_123',
      'plan_123',
      '2023-01-01',
      '2023-12-31',
      true
    );

    // Mock an active pricing plan
    const featureEntitlements = [new FeatureEntitlement('feature1', true)];
    const resourceEntitlements = [new ResourceEntitlement('resource1', 100)];
    const pricingPlan = new PricingPlan(
      new PricingPlanId('plan_123'),
      'Test Plan',
      'Test Description',
      BillingCycle.MONTHLY,
      100,
      'USD'
    );
    pricingPlanRepository.findById.mockResolvedValue(pricingPlan);

    // Mock that the organization already has an active subscription
    const existingSubscription = new Subscription(
      new SubscriptionId('existing_sub'),
      new OrganizationId('org_123'),
      new PricingPlanId('plan_456'),
      SubscriptionStatus.active(),
      new Date('2022-01-01'),
      new Date('2022-12-31'),
      true
    );
    subscriptionRepository.findActiveByOrganizationId.mockResolvedValue(existingSubscription);

    // Act and Assert
    await expect(createSubscriptionHandler.execute(command)).rejects.toThrow(
      'Organization org_123 already has an active subscription'
    );

    // Verify that the subscription repository's save method was not called
    expect(subscriptionRepository.save).not.toHaveBeenCalled();
  });
});
