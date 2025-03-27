import joi from "joi";

export default () => ({
  app: {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3003", 10),
    debug: process.env.DEBUG === "true",
    logging: {
      level: process.env.LOG_LEVEL || "info",
      format: process.env.LOG_FORMAT || "pretty",
    },
    rabbitmq: {
      url: process.env.RABBITMQ_URI || "amqp://localhost:5672",
    },
    nats: {
      url: process.env.NATS_URI || "nats://localhost:4222",
      queue: "alm-worker",
    },
    mongodb: {
      uri: process.env.MONGODB_URI || "mongodb://localhost:27017/audit-logs",
    },
    worker: {
      scheduler: {
        // Mã cron để chạy scheduler (mặc định mỗi 10 phút)
        cronExpression: process.env.SCHEDULER_CRON || "0 */10 * * * *",
        // Lock timeout trong milliseconds (15 phút)
        lockTimeoutMs: parseInt(process.env.LOCK_TIMEOUT_MS || "900000", 10),
        // Kích thước batch xử lý
        batchSize: parseInt(process.env.BATCH_SIZE || "1000", 10),
      },
    },
  },
});

export const appConfigValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: joi.number().default(3003),
  DEBUG: joi.boolean().default(false),
  LOG_LEVEL: joi
    .string()
    .valid("error", "warn", "info", "debug")
    .default("info"),
  LOG_FORMAT: joi.string().valid("json", "text").default("json"),
  RABBITMQ_URI: joi.string().default("amqp://localhost:5672"),
  NATS_URI: joi.string().default("nats://localhost:4222"),
  MONGODB_URI: joi.string().required(),
  SCHEDULER_CRON: joi.string().default("0 */10 * * * *"),
  LOCK_TIMEOUT_MS: joi.number().default(900000),
  BATCH_SIZE: joi.number().default(1000),
});
