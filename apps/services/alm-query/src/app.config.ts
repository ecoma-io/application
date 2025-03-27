import { registerAs } from "@nestjs/config";
import joi from "joi";

export const appConfigValidationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: joi.number().default(3001),
  DEBUG: joi.boolean().default(false),
  LOG_LEVEL: joi
    .string()
    .valid("trace", "debug", "info", "warn", "error")
    .default("info"),
  LOG_FORMAT: joi.string().valid("json", "text").default("json"),
  MONGODB_URI: joi.string().required(),
  NATS_URI: joi.string().required(),
});

export default registerAs("app", () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3001,
  debug: process.env.DEBUG === "true",
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  nats: {
    url: process.env.NATS_URI,
  },
}));
