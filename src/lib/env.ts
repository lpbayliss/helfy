import "@dotenvx/dotenvx/config";
import { z } from "zod";
import { Logger } from "./logger.js";

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default(4000),
  LOG_LEVEL: z.enum(['info', 'warn', 'error']).default('info'),
  
  // Database configuration
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default(5432),
  DB_USER: z.string().default('helfy'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('helfy_app'),
  DB_SSL: z.string().transform((val) => val === 'true').default(false),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  Logger.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

export default env.data;