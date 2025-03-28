/**
 * @fileoverview E2E tests cho ALM Retention Service
 */
import axios from 'axios';

describe('ALM Retention Service (E2E)', () => {
  // Constants
  const API_URL = process.env.ALM_RETENTION_API_URL || 'http://localhost:3002';
  const INGESTION_URL = process.env.ALM_INGESTION_API_URL || 'http://localhost:3001';
  const QUERY_URL = process.env.ALM_QUERY_API_URL || 'http://localhost:3000';
  const TEST_TENANT_ID = 'e2e-test-tenant-retention';

  // Test data
  const createTestAuditLog = (customData = {}) => ({
    eventId: `e2e-test-event-${Date.now()}`,
    timestamp: new Date(),
    initiator: {
      type: 'User',
      id: 'e2e-test-user',
      displayName: 'E2E Test User'
    },
    boundedContext: 'IAM',
    actionType: 'User.Created',
    tenantId: TEST_TENANT_ID,
    category: 'Security',
    severity: 'High',
    entityId: `e2e-test-entity-${Date.now()}`,
    entityType: 'User',
    description: 'E2E test audit log entry',
    isSuccess: true,
    contextData: {
      ipAddress: '192.168.1.1'
    },
    ...customData
  });

  // Helpers
  const createAuditLog = async (auditLog) => {
    try {
      const response = await axios.post(`${INGESTION_URL}/api/v1/audit-logs`, auditLog);
      return response.data.id;
    } catch (error) {
      const errorMessage = `Không thể tạo audit log: ${error.message}`;
      fail(errorMessage);
      throw error;
    }
  };

  const createOldAuditLog = async (daysOld) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysOld);

    const auditLog = createTestAuditLog({
      timestamp: pastDate,
      description: `Audit log ${daysOld} ngày tuổi`
    });

    return await createAuditLog(auditLog);
  };

  const checkAuditLogExists = async (id) => {
    try {
      await axios.get(`${QUERY_URL}/api/v1/audit-logs/${id}`);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  };

  beforeAll(async () => {
    // Kiểm tra kết nối đến service
    try {
      await axios.get(`${API_URL}/health`);
    } catch (error) {
      const errorMessage = `ALM Retention Service không khả dụng: ${error.message}`;
      fail(errorMessage);
      throw new Error('ALM Retention Service không khả dụng');
    }

    // Kiểm tra kết nối đến ALM Ingestion Service
    try {
      await axios.get(`${INGESTION_URL}/health`);
    } catch (error) {
      const errorMessage = `ALM Ingestion Service không khả dụng: ${error.message}`;
      fail(errorMessage);
      throw new Error('ALM Ingestion Service không khả dụng');
    }

    // Kiểm tra kết nối đến ALM Query Service
    try {
      await axios.get(`${QUERY_URL}/health`);
    } catch (error) {
      const errorMessage = `ALM Query Service không khả dụng: ${error.message}`;
      fail(errorMessage);
      throw new Error('ALM Query Service không khả dụng');
    }
  });

  describe('GET /api/v1/retention/policies', () => {
    it('nên trả về danh sách các chính sách lưu trữ', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/retention/policies`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('POST /api/v1/retention/policies', () => {
    it('nên tạo chính sách lưu trữ mới và trả về 201 Created', async () => {
      // Arrange
      const newPolicy = {
        tenantId: TEST_TENANT_ID,
        boundedContext: 'IAM',
        retentionDays: 90,
        isEnabled: true
      };

      // Act
      const response = await axios.post(`${API_URL}/api/v1/retention/policies`, newPolicy);

      // Assert
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.tenantId).toBe(TEST_TENANT_ID);
      expect(response.data.boundedContext).toBe('IAM');
      expect(response.data.retentionDays).toBe(90);
      expect(response.data.isEnabled).toBe(true);

      // Cleanup
      await axios.delete(`${API_URL}/api/v1/retention/policies/${response.data.id}`);
    });
  });

  describe('GET /api/v1/retention/policies/:id', () => {
    let policyId: string;

    beforeEach(async () => {
      // Tạo một chính sách mới để test
      const newPolicy = {
        tenantId: TEST_TENANT_ID,
        boundedContext: 'IAM',
        retentionDays: 90,
        isEnabled: true
      };

      const response = await axios.post(`${API_URL}/api/v1/retention/policies`, newPolicy);
      policyId = response.data.id;
    });

    afterEach(async () => {
      // Xóa chính sách sau khi test
      if (policyId) {
        try {
          await axios.delete(`${API_URL}/api/v1/retention/policies/${policyId}`);
        } catch (error) {
          // Skip logging and continue with tests
          // No need to fail the test if cleanup fails
        }
      }
    });

    it('nên trả về chi tiết chính sách theo ID', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/retention/policies/${policyId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(policyId);
      expect(response.data.tenantId).toBe(TEST_TENANT_ID);
    });

    it('nên trả về lỗi 404 khi không tìm thấy chính sách', async () => {
      // Act & Assert
      try {
        await axios.get(`${API_URL}/api/v1/retention/policies/không-tồn-tại`);
        fail('Yêu cầu phải trả về lỗi 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('PUT /api/v1/retention/policies/:id', () => {
    let policyId: string;

    beforeEach(async () => {
      // Tạo một chính sách mới để test
      const newPolicy = {
        tenantId: TEST_TENANT_ID,
        boundedContext: 'IAM',
        retentionDays: 90,
        isEnabled: true
      };

      const response = await axios.post(`${API_URL}/api/v1/retention/policies`, newPolicy);
      policyId = response.data.id;
    });

    afterEach(async () => {
      // Xóa chính sách sau khi test
      if (policyId) {
        try {
          await axios.delete(`${API_URL}/api/v1/retention/policies/${policyId}`);
        } catch {
          // Skip logging and continue with tests
          // No need to fail the test if cleanup fails
        }
      }
    });

    it('nên cập nhật chính sách lưu trữ', async () => {
      // Arrange
      const updatedPolicy = {
        retentionDays: 180,
        isEnabled: false
      };

      // Act
      const response = await axios.put(`${API_URL}/api/v1/retention/policies/${policyId}`, updatedPolicy);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(policyId);
      expect(response.data.retentionDays).toBe(180);
      expect(response.data.isEnabled).toBe(false);

      // Kiểm tra xem chính sách đã được cập nhật chưa
      const getResponse = await axios.get(`${API_URL}/api/v1/retention/policies/${policyId}`);
      expect(getResponse.data.retentionDays).toBe(180);
      expect(getResponse.data.isEnabled).toBe(false);
    });
  });

  describe('DELETE /api/v1/retention/policies/:id', () => {
    let policyId: string;

    beforeEach(async () => {
      // Tạo một chính sách mới để test
      const newPolicy = {
        tenantId: TEST_TENANT_ID,
        boundedContext: 'IAM',
        retentionDays: 90,
        isEnabled: true
      };

      const response = await axios.post(`${API_URL}/api/v1/retention/policies`, newPolicy);
      policyId = response.data.id;
    });

    it('nên xóa chính sách lưu trữ', async () => {
      // Act
      const response = await axios.delete(`${API_URL}/api/v1/retention/policies/${policyId}`);

      // Assert
      expect(response.status).toBe(204);

      // Kiểm tra xem chính sách đã bị xóa chưa
      try {
        await axios.get(`${API_URL}/api/v1/retention/policies/${policyId}`);
        fail('Yêu cầu phải trả về lỗi 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('POST /api/v1/retention/execute', () => {
    let policyId: string;
    let oldAuditLogId: string;
    let newAuditLogId: string;

    beforeEach(async () => {
      // Tạo một chính sách với thời gian lưu trữ ngắn
      const newPolicy = {
        tenantId: TEST_TENANT_ID,
        boundedContext: 'IAM',
        retentionDays: 7,
        isEnabled: true
      };

      const response = await axios.post(`${API_URL}/api/v1/retention/policies`, newPolicy);
      policyId = response.data.id;

      // Tạo một audit log cũ (10 ngày)
      oldAuditLogId = await createOldAuditLog(10);

      // Tạo một audit log mới (1 ngày)
      newAuditLogId = await createOldAuditLog(1);

      // Chờ một chút để đảm bảo dữ liệu đã được lưu
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    afterEach(async () => {
      // Xóa chính sách sau khi test
      if (policyId) {
        try {
          await axios.delete(`${API_URL}/api/v1/retention/policies/${policyId}`);
        } catch (error) {
          // Skip logging and continue with tests
          // No need to fail the test if cleanup fails
        }
      }
    });

    it('nên thực thi chính sách lưu trữ và xóa các bản ghi cũ', async () => {
      // Kiểm tra xem các audit log có tồn tại trước khi thực thi không
      const oldLogExists = await checkAuditLogExists(oldAuditLogId);
      const newLogExists = await checkAuditLogExists(newAuditLogId);

      expect(oldLogExists).toBe(true);
      expect(newLogExists).toBe(true);

      // Act
      const response = await axios.post(`${API_URL}/api/v1/retention/execute`, {
        tenantId: TEST_TENANT_ID
      });

      // Chờ một chút để đảm bảo quá trình xóa đã hoàn tất
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.deletedCount).toBeGreaterThanOrEqual(1);

      // Kiểm tra xem audit log cũ đã bị xóa chưa
      const oldLogExistsAfter = await checkAuditLogExists(oldAuditLogId);
      const newLogExistsAfter = await checkAuditLogExists(newAuditLogId);

      expect(oldLogExistsAfter).toBe(false);
      expect(newLogExistsAfter).toBe(true);
    });

    it('nên không xóa bản ghi nếu chính sách bị vô hiệu hóa', async () => {
      // Vô hiệu hóa chính sách
      await axios.put(`${API_URL}/api/v1/retention/policies/${policyId}`, {
        isEnabled: false
      });

      // Act
      const response = await axios.post(`${API_URL}/api/v1/retention/execute`, {
        tenantId: TEST_TENANT_ID
      });

      // Chờ một chút để đảm bảo quá trình xử lý đã hoàn tất
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.deletedCount).toBe(0);

      // Kiểm tra xem cả hai audit log vẫn còn tồn tại
      const oldLogExists = await checkAuditLogExists(oldAuditLogId);
      const newLogExists = await checkAuditLogExists(newAuditLogId);

      expect(oldLogExists).toBe(true);
      expect(newLogExists).toBe(true);
    });
  });

  describe('GET /api/v1/retention/status', () => {
    it('nên trả về trạng thái của job lưu trữ', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/retention/status`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.lastExecutionTime).toBeDefined();
      expect(response.data.isRunning !== undefined).toBe(true);
    });
  });
});
