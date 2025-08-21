import { pgTable, uuid, varchar, timestamp, decimal, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/**
 * Biometric measurements table - simple health tracking for single user
 */
export const biometrics = pgTable('biometrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Measurement details
  type: varchar('type', { length: 50 }).notNull(), // 'weight', 'waist', 'body_fat', etc.
  value: decimal('value', { precision: 8, scale: 2 }).notNull(), // The measured value
  unit: varchar('unit', { length: 10 }).notNull(), // 'kg', 'cm', '%', etc.
  
  // Optional context
  notes: text('notes'), // User notes about the measurement
  
  // Timestamps
  measuredAt: timestamp('measured_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Zod schemas
export const insertBiometricSchema = createInsertSchema(biometrics, {
  value: (schema) => schema.positive(),
  type: (schema) => schema.min(1).max(50),
  unit: (schema) => schema.min(1).max(10),
}).omit({
  id: true,
  createdAt: true,
});

export const selectBiometricSchema = createSelectSchema(biometrics);

// Types
export type Biometric = typeof biometrics.$inferSelect;
export type NewBiometric = typeof biometrics.$inferInsert;