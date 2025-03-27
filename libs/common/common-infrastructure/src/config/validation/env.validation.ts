import joi from "joi";

/**
 * Environment variables validation schema for base configuration
 */
export const baseEnvValidationSchema = joi.object({
  // App settings
  NODE_ENV: joi
    .string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: joi.number().default(3000),
  DEBUG: joi.boolean().default(false),
  LOG_LEVEL: joi
    .string()
    .valid("trace", "debug", "info", "warn", "error")
    .default("info"),
  LOG_FORMAT: joi.string().valid("json", "text").default("json"),

  // MongoDB settings
  MONGODB_ENABLED: joi.boolean().default(false),
  MONGODB_URI: joi.when("MONGODB_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  MONGODB_DB_NAME: joi.string().optional(),

  // NATS settings
  NATS_ENABLED: joi.boolean().default(false),
  NATS_URI: joi.when("NATS_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),

  // RabbitMQ settings
  RABBITMQ_ENABLED: joi.boolean().default(false),
  RABBITMQ_URI: joi.when("RABBITMQ_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  RABBITMQ_EXCHANGE: joi.string().default("events"),
  RABBITMQ_EXCHANGE_TYPE: joi.string().default("topic"),
  RABBITMQ_QUEUE: joi.string().optional(),

  // Redis settings
  REDIS_ENABLED: joi.boolean().default(false),
  REDIS_HOST: joi.when("REDIS_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  REDIS_PORT: joi.when("REDIS_ENABLED", {
    is: true,
    then: joi.number().required(),
    otherwise: joi.number().optional(),
  }),
  REDIS_PASSWORD: joi.string().optional(),
  REDIS_DB: joi.number().optional(),

  // S3/MinIO settings
  S3_ENABLED: joi.boolean().default(false),
  S3_ENDPOINT: joi.string().optional(),
  S3_REGION: joi.when("S3_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  S3_ACCESS_KEY: joi.when("S3_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  S3_SECRET_KEY: joi.when("S3_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  S3_BUCKET: joi.when("S3_ENABLED", {
    is: true,
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  S3_FORCE_PATH_STYLE: joi.boolean().default(false),
});
