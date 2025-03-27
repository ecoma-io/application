import { registerAs } from "@nestjs/config";
import * as joi from "joi";

/**
 * Schema validation cho cấu hình ứng dụng
 */
export const appConfigValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: joi.number().default(3000),
  LOG_LEVEL: joi
    .string()
    .valid("trace", "debug", "info", "warn", "error")
    .default("info"),
  LOG_FORMAT: joi.string().valid("json", "text").default("json"),
  NATS_URL: joi.string().required(),
  MONGODB_URI: joi.string().required(),
});

/**
 * Cấu hình ứng dụng
 */
export default registerAs("app", () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
  nats: {
    url: process.env.NATS_URL,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
}));
