import { registerAs } from "@nestjs/config";
import joi from "joi";

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
  MONGODB_URI: joi.string().required(),
  RABBITMQ_URI: joi.string().required(),
  ALM_RABBITMQ_EXCHANGE_NAME: joi.string().default("alm.events"),
  ALM_RABBITMQ_EXCHANGE_TYPE: joi
    .string()
    .valid("topic", "direct", "fanout")
    .default("topic"),
  DEBUG: joi.boolean().default(false),
});

export default registerAs("app", () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  nats: {
    url: process.env.NATS_URL,
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI,
    exchange: {
      name: process.env.ALM_RABBITMQ_EXCHANGE_NAME || "alm.events",
      type: process.env.ALM_RABBITMQ_EXCHANGE_TYPE || "topic",
    },
  },
  debug: process.env.DEBUG === "true",
}));
