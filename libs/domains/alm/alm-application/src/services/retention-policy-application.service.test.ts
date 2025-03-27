import 'reflect-metadata';
import { RetentionPolicyApplicationService } from './retention-policy-application.service';
import { CreateRetentionPolicyCommandDto } from '../dtos/commands/create-retention-policy.command.dto';
import { UpdateRetentionPolicyCommandDto } from '../dtos/commands/update-retention-policy.command.dto';

describe('RetentionPolicyApplicationService', () => {
  let service: RetentionPolicyApplicationService;
  let writeRepo: any;
  let readRepo: any;
  let logger: any;
  let deactivateHandler: any;
  let activateHandler: any;
  let createHandler: any;
  let updateHandler: any;
  let deleteHandler: any;

  beforeEach(() => {
    writeRepo = {};
    readRepo = {
      findActive: jest.fn().mockResolvedValue([{ id: 'id1', name: 'P1' }]),
      findById: jest.fn().mockResolvedValue({ id: 'id1', name: 'P1' }),
    };
    logger = { info: jest.fn(), warn: jest.fn() };
    deactivateHandler = { execute: jest.fn().mockResolvedValue({ success: true, data: 'id1', error: '', details: '' }) };
    activateHandler = { execute: jest.fn().mockResolvedValue({ success: true, data: 'id1', error: '', details: '' }) };
    createHandler = { execute: jest.fn().mockResolvedValue({ success: true, data: 'id1', error: '', details: '' }) };
    updateHandler = { execute: jest.fn().mockResolvedValue({ success: true, data: 'id1', error: '', details: '' }) };
    deleteHandler = { execute: jest.fn().mockResolvedValue({ success: true, data: 'id1', error: '', details: '' }) };
    service = new RetentionPolicyApplicationService(
      writeRepo,
      readRepo,
      logger,
      deactivateHandler,
      activateHandler,
      createHandler,
      updateHandler,
      deleteHandler
    );

    // Mock validateSync to always return empty array (no validation errors)
    jest.spyOn(require('class-validator'), 'validateSync').mockReturnValue([]);
  });

  it('Tạo retention policy thành công', async () => {
    const dto: CreateRetentionPolicyCommandDto = {
      name: 'Policy 1',
      description: 'Test policy',
      boundedContext: 'identity',
      actionType: 'User.Created',
      entityType: 'User',
      tenantId: 'tenant-1',
      retentionDays: 90,
      isActive: true
    };
    const result = await service.createRetentionPolicy(dto);
    expect(result.success).toBe(true);
    expect(createHandler.execute).toHaveBeenCalled();
  });

  it('Cập nhật retention policy thành công', async () => {
    const dto: UpdateRetentionPolicyCommandDto = {
      id: 'id1',
      name: 'Policy 1',
      description: 'Updated policy',
      boundedContext: 'identity',
      actionType: 'User.Created',
      entityType: 'User',
      tenantId: 'tenant-1',
      retentionDays: 90,
      isActive: true
    };
    const result = await service.updateRetentionPolicy('id1', dto);
    expect(result.success).toBe(true);
    expect(updateHandler.execute).toHaveBeenCalled();
  });

  it('Xóa retention policy thành công', async () => {
    const result = await service.deleteRetentionPolicy('id1');
    expect(result.success).toBe(true);
    expect(deleteHandler.execute).toHaveBeenCalled();
  });

  it('Kích hoạt retention policy thành công', async () => {
    const result = await service.activateRetentionPolicy('id1');
    expect(result.success).toBe(true);
    expect(activateHandler.execute).toHaveBeenCalled();
  });

  it('Vô hiệu hóa retention policy thành công', async () => {
    const result = await service.deactivateRetentionPolicy('id1');
    expect(result.success).toBe(true);
    expect(deactivateHandler.execute).toHaveBeenCalled();
  });

  it('Lấy danh sách retention policy', async () => {
    const result = await service.getRetentionPolicies();
    expect(Array.isArray(result)).toBe(true);
    expect(readRepo.findActive).toHaveBeenCalled();
  });

  it('Lấy chi tiết retention policy', async () => {
    const result = await service.getRetentionPolicyDetail('id1');
    expect(result).toHaveProperty('id', 'id1');
    expect(readRepo.findById).toHaveBeenCalled();
  });
});
