import "@dotenvx/dotenvx/config";
import { z } from "zod";
import { Logger } from "./logger.js";

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default(4000),
  LOG_LEVEL: z.enum(['info', 'warn', 'error']).default('info'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  Logger.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

export default env.data;