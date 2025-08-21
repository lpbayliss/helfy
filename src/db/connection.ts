import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import env from '../lib/env.js';
import { Logger } from '../lib/logger.js';
import * as schema from './schema/index.js';

/**
 * PostgreSQL connection pool configuration
 */
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  
  // Pool configuration
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Drizzle database instance with schema
 */
export const db = drizzle(pool, { 
  schema,
  logger: env.NODE_ENV === 'development'
});

/**
 * Test database connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    Logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    Logger.error('❌ Database connection failed:', { error: error instanceof Error ? error.message : String(error) });
    return false;
  }
};

/**
 * Gracefully close the database connection pool
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
    Logger.info('🔌 Database connection pool closed');
  } catch (error) {
    Logger.error('❌ Error closing database connection:', { error: error instanceof Error ? error.message : String(error) });
  }
};

// Handle graceful shutdown
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);