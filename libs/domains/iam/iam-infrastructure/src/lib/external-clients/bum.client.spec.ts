import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { BumClient } from './bum.client';
import { ILogger } from '@ecoma/common-application';
import { lastValueFrom, of, throwError, TimeoutError } from 'rxjs';

describe('BumClient', () => {
  let client: BumClient;
  let mockBumClient: ClientProxy;
  let mockLogger: ILogger;

  beforeEach(async () => {
    mockBumClient = {
      send: jest.fn(),
      emit: jest.fn(),
      connect: jest.fn(),
      close: jest.fn(),
    } as any;

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BumClient,
        {
          provide: 'BUM',
          useValue: mockBumClient,
        },
        {
          provide: 'ILogger',
          useValue: mockLogger,
        },
      ],
    }).compile();

    client = module.get<BumClient>(BumClient);
  });

  it('nên được định nghĩa', () => {
    expect(client).toBeDefined();
  });

  describe('getOrganizationEntitlements', () => {
    it('nên lấy thông tin quyền lợi tính năng thành công', async () => {
      const mockEntitlements = [
        { featureType: 'feature1', isActive: true },
        { featureType: 'feature2', isActive: false }
      ];

      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(of(mockEntitlements))
      } as any);

      const result = await client.getOrganizationEntitlements('org-123');

      expect(result).toEqual(mockEntitlements);
      expect(mockBumClient.send).toHaveBeenCalledWith(
        'bum.subscription.get-entitlements',
        { organizationId: 'org-123' }
      );
      expect(mockLogger.debug).toHaveBeenCalledTimes(3);
    });

    it('nên xử lý khi xảy ra lỗi timeout', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(throwError(() => new TimeoutError()))
      } as any);

      await expect(client.getOrganizationEntitlements('org-123')).rejects.toThrow(
        /Hết thời gian chờ phản hồi từ BUM service/
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Hết thời gian chờ khi lấy quyền lợi tính năng của tổ chức',
        expect.any(TimeoutError),
        expect.objectContaining({ organizationId: 'org-123' })
      );
    });

    it('nên xử lý lỗi từ BumClient', async () => {
      const mockError = new Error('Test error');
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(throwError(() => mockError))
      } as any);

      await expect(client.getOrganizationEntitlements('org-123')).rejects.toThrow(mockError);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Lỗi khi lấy thông tin quyền lợi tính năng của tổ chức',
        mockError,
        expect.objectContaining({ organizationId: 'org-123' })
      );
    });
  });

  describe('hasFeatureEntitlement', () => {
    it('nên kiểm tra quyền lợi tính năng thành công khi có quyền', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(of(true))
      } as any);

      const result = await client.hasFeatureEntitlement('org-123', 'feature1');

      expect(result).toBe(true);
      expect(mockBumClient.send).toHaveBeenCalledWith(
        'bum.subscription.has-feature',
        { organizationId: 'org-123', featureType: 'feature1' }
      );
    });

    it('nên trả về false khi xảy ra lỗi timeout', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(throwError(() => new TimeoutError()))
      } as any);

      const result = await client.hasFeatureEntitlement('org-123', 'feature1');

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Hết thời gian chờ khi kiểm tra quyền lợi tính năng',
        expect.any(TimeoutError),
        expect.objectContaining({
          organizationId: 'org-123',
          featureType: 'feature1'
        })
      );
    });
  });

  describe('checkResourceLimit', () => {
    it('nên kiểm tra hạn mức tài nguyên thành công', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(of(true))
      } as any);

      const result = await client.checkResourceLimit('org-123', 'users', 5);

      expect(result).toBe(true);
      expect(mockBumClient.send).toHaveBeenCalledWith(
        'bum.subscription.check-resource-limit',
        { organizationId: 'org-123', resourceType: 'users', currentCount: 5 }
      );
    });

    it('nên trả về false khi xảy ra lỗi timeout', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(throwError(() => new TimeoutError()))
      } as any);

      const result = await client.checkResourceLimit('org-123', 'users', 5);

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('isOrganizationActive', () => {
    it('nên kiểm tra trạng thái kích hoạt tổ chức thành công', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(of(true))
      } as any);

      const result = await client.isOrganizationActive('org-123');

      expect(result).toBe(true);
      expect(mockBumClient.send).toHaveBeenCalledWith(
        'bum.subscription.is-active',
        { organizationId: 'org-123' }
      );
    });

    it('nên trả về false khi xảy ra lỗi timeout', async () => {
      jest.spyOn(mockBumClient, 'send').mockReturnValueOnce({
        pipe: jest.fn().mockReturnValue(throwError(() => new TimeoutError()))
      } as any);

      const result = await client.isOrganizationActive('org-123');

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Hết thời gian chờ khi kiểm tra trạng thái kích hoạt tổ chức',
        expect.any(TimeoutError),
        expect.objectContaining({ organizationId: 'org-123' })
      );
    });
  });
});
