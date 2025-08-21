import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, testConnection, closeConnection } from './connection.js';
import { Logger } from '../lib/logger.js';

/**
 * Run database migrations
 */
async function runMigrations() {
  try {
    Logger.info('🚀 Starting database migrations...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    
    Logger.info('✅ Migrations completed successfully');
  } catch (error) {
    Logger.error('❌ Migration failed:', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}

export { runMigrations };