import { pgTable, uuid, varchar, timestamp, integer, decimal, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

/**
 * Workout sessions table - single user fitness tracking
 */
export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Basic workout info
  name: varchar('name', { length: 255 }), // e.g., "Push Day", "Morning Run"
  notes: text('notes'),
  
  // Timestamps
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Exercise sets - simple tracking of individual exercise performances
 */
export const exerciseSets = pgTable('exercise_sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id').references(() => workouts.id, { onDelete: 'cascade' }),
  
  // Exercise details
  exerciseName: varchar('exercise_name', { length: 255 }).notNull(),
  
  // Performance data
  reps: integer('reps'),
  weight: decimal('weight', { precision: 6, scale: 2 }), // Weight in kg or lbs
  
  // Optional context
  notes: text('notes'),
  
  // Timestamps
  performedAt: timestamp('performed_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Zod schemas
export const insertWorkoutSchema = createInsertSchema(workouts, {
  name: (schema) => schema.max(255).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertExerciseSetSchema = createInsertSchema(exerciseSets, {
  exerciseName: (schema) => schema.min(1).max(255),
  reps: (schema) => schema.positive().optional(),
  weight: (schema) => schema.positive().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const selectWorkoutSchema = createSelectSchema(workouts);
export const selectExerciseSetSchema = createSelectSchema(exerciseSets);

// Types
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type ExerciseSet = typeof exerciseSets.$inferSelect;
export type NewExerciseSet = typeof exerciseSets.$inferInsert;