import 'reflect-metadata';
import { RetentionPolicy, RetentionRule } from '@ecoma/alm-domain';
import { RetentionPolicyDto, RetentionRuleDto } from '../dtos/retention-policy.dto';
import { RetentionPolicyDtoMapper } from './retention-policy-dto.mapper';

describe('RetentionPolicyDtoMapper', () => {
  let mapper: RetentionPolicyDtoMapper;
  let mockRetentionPolicy: RetentionPolicy;
  let mockRules: RetentionRule[];

  beforeEach(() => {
    mapper = new RetentionPolicyDtoMapper();

    // Tạo các quy tắc retention mẫu
    mockRules = [
      RetentionRule.create(30, 'IAM', 'User.Login', undefined, undefined),
      RetentionRule.create(90, 'BUM', undefined, 'Subscription', undefined),
      RetentionRule.create(365, undefined, undefined, undefined, 'tenant-123'),
    ];

    // Tạo chính sách retention mẫu
    mockRetentionPolicy = RetentionPolicy.create(
      'Test Policy',
      'Test Description',
      mockRules,
      true
    );
  });

  describe('toDto', () => {
    it('nên chuyển đổi RetentionPolicy domain sang DTO chính xác', () => {
      // Thực thi
      const result = mapper.toDto(mockRetentionPolicy, 'policy-123');

      // Kiểm tra
      expect(result).toBeDefined();
      expect(result.id).toBe('policy-123');
      expect(result.name).toBe('Test Policy');
      expect(result.description).toBe('Test Description');
      expect(result.isActive).toBe(true);
      expect(result.rules).toHaveLength(3);

      // Kiểm tra quy tắc đầu tiên
      expect(result.rules[0].boundedContext).toBe('IAM');
      expect(result.rules[0].actionType).toBe('User.Login');
      expect(result.rules[0].entityType).toBeUndefined();
      expect(result.rules[0].tenantId).toBeUndefined();
      expect(result.rules[0].retentionDuration).toBe(30);

      // Kiểm tra quy tắc thứ hai
      expect(result.rules[1].boundedContext).toBe('BUM');
      expect(result.rules[1].actionType).toBeUndefined();
      expect(result.rules[1].entityType).toBe('Subscription');
      expect(result.rules[1].tenantId).toBeUndefined();
      expect(result.rules[1].retentionDuration).toBe(90);

      // Kiểm tra quy tắc thứ ba
      expect(result.rules[2].boundedContext).toBeUndefined();
      expect(result.rules[2].actionType).toBeUndefined();
      expect(result.rules[2].entityType).toBeUndefined();
      expect(result.rules[2].tenantId).toBe('tenant-123');
      expect(result.rules[2].retentionDuration).toBe(365);
    });

    it('nên xử lý trường hợp không có id', () => {
      // Thực thi
      const result = mapper.toDto(mockRetentionPolicy);

      // Kiểm tra
      expect(result).toBeDefined();
      expect(result.id).toBeUndefined();
      expect(result.name).toBe('Test Policy');
    });
  });

  describe('toDtos', () => {
    it('nên chuyển đổi danh sách RetentionPolicy domain sang DTO chính xác', () => {
      // Chuẩn bị
      const domains = [
        { policy: mockRetentionPolicy, id: 'policy-1' },
        { policy: mockRetentionPolicy, id: 'policy-2' },
      ];

      // Thực thi
      const results = mapper.toDtos(domains);

      // Kiểm tra
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('policy-1');
      expect(results[1].id).toBe('policy-2');
    });
  });

  describe('toDomain', () => {
    it('nên chuyển đổi RetentionPolicyDto sang RetentionPolicy domain', () => {
      // Chuẩn bị
      const dto = new RetentionPolicyDto();
      dto.id = 'policy-123';
      dto.name = 'Test Policy DTO';
      dto.description = 'Test Description DTO';
      dto.isActive = true;

      const ruleDto1 = new RetentionRuleDto();
      ruleDto1.boundedContext = 'IAM';
      ruleDto1.actionType = 'User.Login';
      ruleDto1.retentionDuration = 30;

      const ruleDto2 = new RetentionRuleDto();
      ruleDto2.boundedContext = 'BUM';
      ruleDto2.entityType = 'Subscription';
      ruleDto2.retentionDuration = 90;

      dto.rules = [ruleDto1, ruleDto2];

      // Thực thi
      const result = mapper.toDomain(dto);

      // Kiểm tra
      expect(result).toBeDefined();
      expect(result.name).toBe('Test Policy DTO');
      expect(result.description).toBe('Test Description DTO');
      expect(result.isActive).toBe(true);
      expect(result.rules).toHaveLength(2);

      // Kiểm tra quy tắc đầu tiên
      expect(result.rules[0].boundedContext).toBe('IAM');
      expect(result.rules[0].actionType).toBe('User.Login');
      expect(result.rules[0].entityType).toBeUndefined();
      expect(result.rules[0].retentionDuration).toBe(30);

      // Kiểm tra quy tắc thứ hai
      expect(result.rules[1].boundedContext).toBe('BUM');
      expect(result.rules[1].actionType).toBeUndefined();
      expect(result.rules[1].entityType).toBe('Subscription');
      expect(result.rules[1].retentionDuration).toBe(90);
    });
  });
});
