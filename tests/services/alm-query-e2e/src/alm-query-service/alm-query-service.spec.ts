/**
 * @fileoverview E2E tests cho ALM Query Service
 */

import axios from 'axios';
import { AuditLogEntry, Initiator } from '@ecoma/alm-domain';

describe('ALM Query Service (E2E)', () => {
  // Constants
  const API_URL = process.env.ALM_QUERY_API_URL || 'http://localhost:3000';
  const TEST_TENANT_ID = 'e2e-test-tenant';

  // Test data
  const mockAuditLog = {
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
    }
  };

  // Helpers
  const createAuditLog = async (auditLog = mockAuditLog) => {
    try {
      const ingestUrl = process.env.ALM_INGESTION_API_URL || 'http://localhost:3001';
      await axios.post(`${ingestUrl}/api/v1/audit-logs`, auditLog);

      // Chờ một chút để đảm bảo dữ liệu đã được lưu
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      // Log error to test output instead of using console.error
      const errorMessage = `Không thể tạo audit log: ${error.message}`;
      fail(errorMessage);
      throw error;
    }
  };

  beforeAll(async () => {
    // Kiểm tra kết nối đến service
    try {
      await axios.get(`${API_URL}/health`);
    } catch (error) {
      // Log error to test output instead of using console.error
      const errorMessage = `ALM Query Service không khả dụng: ${error.message}`;
      fail(errorMessage);
      throw new Error('ALM Query Service không khả dụng');
    }
  });

  describe('GET /api/v1/audit-logs', () => {
    beforeEach(async () => {
      // Tạo một bản ghi audit log mới trước mỗi test
      await createAuditLog();
    });

    it('nên trả về danh sách audit logs với phân trang', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          page: 1,
          pageSize: 10
        }
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.items).toBeInstanceOf(Array);
      expect(response.data.total).toBeGreaterThanOrEqual(1);
      expect(response.data.page).toBe(1);
      expect(response.data.pageSize).toBe(10);

      // Kiểm tra có ít nhất một bản ghi khớp với dữ liệu test
      const foundLog = response.data.items.find(item =>
        item.tenantId === TEST_TENANT_ID &&
        item.boundedContext === 'IAM' &&
        item.actionType === 'User.Created'
      );
      expect(foundLog).toBeDefined();
    });

    it('nên lọc audit logs theo boundedContext', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          boundedContext: 'IAM',
          page: 1,
          pageSize: 10
        }
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.items.length).toBeGreaterThanOrEqual(1);

      // Kiểm tra tất cả các bản ghi đều có boundedContext là IAM
      expect(response.data.items.every(item => item.boundedContext === 'IAM')).toBe(true);
    });

    it('nên lọc audit logs theo actionType', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          actionType: 'User.Created',
          page: 1,
          pageSize: 10
        }
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.items.length).toBeGreaterThanOrEqual(1);

      // Kiểm tra tất cả các bản ghi đều có actionType là User.Created
      expect(response.data.items.every(item => item.actionType === 'User.Created')).toBe(true);
    });

    it('nên lọc audit logs theo khoảng thời gian', async () => {
      // Arrange
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1); // 1 ngày trước

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1); // 1 ngày sau

      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          page: 1,
          pageSize: 10
        }
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.items.length).toBeGreaterThanOrEqual(1);

      // Kiểm tra tất cả các bản ghi đều nằm trong khoảng thời gian
      expect(response.data.items.every(item => {
        const timestamp = new Date(item.timestamp);
        return timestamp >= startDate && timestamp <= endDate;
      })).toBe(true);
    });

    it('nên trả về mảng rỗng khi không có audit logs nào khớp với điều kiện lọc', async () => {
      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          boundedContext: 'KHÔNG_TỒN_TẠI',
          page: 1,
          pageSize: 10
        }
      });

      // Assert
      expect(response.status).toBe(200);
      expect(response.data.items).toBeInstanceOf(Array);
      expect(response.data.items.length).toBe(0);
      expect(response.data.total).toBe(0);
    });
  });

  describe('GET /api/v1/audit-logs/:id', () => {
    let testAuditLogId: string;

    beforeEach(async () => {
      // Tạo một bản ghi audit log mới và lưu ID
      const customLog = {
        ...mockAuditLog,
        eventId: `e2e-test-specific-${Date.now()}`
      };
      await createAuditLog(customLog);

      // Lấy ID của audit log vừa tạo
      const response = await axios.get(`${API_URL}/api/v1/audit-logs`, {
        params: {
          tenantId: TEST_TENANT_ID,
          eventId: customLog.eventId
        }
      });

      testAuditLogId = response.data.items[0]?.id;
    });

    it('nên trả về chi tiết audit log theo ID', async () => {
      // Skip nếu không tìm thấy ID
      if (!testAuditLogId) {
        // Use pending() instead of console.warn
        pending('Không tìm thấy ID audit log để test');
        return;
      }

      // Act
      const response = await axios.get(`${API_URL}/api/v1/audit-logs/${testAuditLogId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(testAuditLogId);
      expect(response.data.tenantId).toBe(TEST_TENANT_ID);
      expect(response.data.boundedContext).toBe('IAM');
      expect(response.data.actionType).toBe('User.Created');
    });

    it('nên trả về lỗi 404 khi không tìm thấy audit log', async () => {
      // Act & Assert
      try {
        await axios.get(`${API_URL}/api/v1/audit-logs/không-tồn-tại`);
        // Nếu không có lỗi, test fail
        fail('Yêu cầu phải trả về lỗi 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('Xử lý lỗi', () => {
    it('nên trả về lỗi 400 khi thiếu tenantId', async () => {
      // Act & Assert
      try {
        await axios.get(`${API_URL}/api/v1/audit-logs`);
        // Nếu không có lỗi, test fail
        fail('Yêu cầu phải trả về lỗi 400');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('tenantId');
      }
    });

    it('nên trả về lỗi 400 khi tham số phân trang không hợp lệ', async () => {
      // Act & Assert
      try {
        await axios.get(`${API_URL}/api/v1/audit-logs`, {
          params: {
            tenantId: TEST_TENANT_ID,
            page: -1,
            pageSize: 1000
          }
        });
        // Nếu không có lỗi, test fail
        fail('Yêu cầu phải trả về lỗi 400');
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
