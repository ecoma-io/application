/**
 * Định nghĩa cấu hình RabbitMQ cho ALM.
 * @interface IRabbitMqConfig
 * @property {string} uri - URI của RabbitMQ.
 * @property {{auditLog: string}} exchanges - Đổi tên cho các trao đổi.
 * @property {{auditLogIngestion: string; retentionPolicy: string}} queues - Đổi tên cho các hàng đợi.
 * @property {{maxRetries: number; initialInterval: number; maxInterval: number; multiplier: number}} retryPolicy - Chính sách thử lại.
 */
export interface IRabbitMqConfig {
  uri: string;
  exchanges: {
    auditLog: string;
  };
  queues: {
    auditLogIngestion: string;
    retentionPolicy: string;
  };
  retryPolicy: {
    maxRetries: number;
    initialInterval: number;
    maxInterval: number;
    multiplier: number;
  };
}

/**
 * Định nghĩa cấu hình mặc định cho RabbitMQ.
 * @const {IRabbitMqConfig} defaultRabbitMqConfig
 */
export const defaultRabbitMqConfig: IRabbitMqConfig = {
  uri: process.env['ALM_RABBITMQ_URI'] || 'amqp://localhost:5672',
  exchanges: {
    auditLog: 'alm.audit-log',
  },
  queues: {
    auditLogIngestion: 'alm.audit-log.ingestion',
    retentionPolicy: 'alm.retention-policy',
  },
  retryPolicy: {
    maxRetries: 3,
    initialInterval: 1000, // 1 giây
    maxInterval: 60000, // 1 phút
    multiplier: 2, // tăng dần theo cấp số nhân
  },
};
